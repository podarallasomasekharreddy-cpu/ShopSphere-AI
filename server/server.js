const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  verifyEmailService,
} = require("./emailService");
const multer = require("multer");
const crypto = require("crypto");
const Razorpay = require("razorpay");

// Razorpay is initialized only when payment endpoints are used, so COD and
// the rest of the API can still start if test keys have not been configured.
function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    const error = new Error(
      "Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env."
    );
    error.statusCode = 503;
    throw error;
  }

  return new Razorpay({ key_id, key_secret });
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || !orderId || !paymentId || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(String(signature), "hex");

  return (
    a.length === b.length &&
    a.length > 0 &&
    crypto.timingSafeEqual(a, b)
  );
}

// Resolve prices from the database/API rather than trusting prices sent by React.
async function getTrustedOrderItems(items, connection = db) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Your cart is empty.");
    error.statusCode = 400;
    throw error;
  }

  const trusted = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      const error = new Error("Invalid item quantity.");
      error.statusCode = 400;
      throw error;
    }

    const onlineMatch = /^online-(\d+)$/.exec(String(item.id));
    let product;

    if (onlineMatch) {
      const slug = `online-dummyjson-${onlineMatch[1]}`;

      const [rows] = await connection.query(
        `SELECT id, price, title, category, brand, description,
                image, images, old_price, rating, reviews, stock, in_stock
         FROM products
         WHERE slug = ?
         LIMIT 1`,
        [slug]
      );

      if (rows.length) {
        product = rows[0];
      } else {
        const response = await fetch(
          `https://dummyjson.com/products/${onlineMatch[1]}`
        );

        if (!response.ok) {
          const error = new Error(
            `Could not verify online product ${item.id}.`
          );
          error.statusCode = 400;
          throw error;
        }

        const external = await response.json();

        product = {
          id: String(item.id),
          price: Number(external.price),
          title: external.title,
          category: external.category,
          brand: external.brand || "Unbranded",
          description: external.description || null,
          image: external.thumbnail || external.images?.[0] || null,
          images: external.images || [],
          old_price: null,
          rating: external.rating || 0,
          reviews: 0,
          stock: external.stock || 0,
          in_stock: (external.stock || 0) > 0,
        };
      }
    } else {
      const id = Number(item.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        const error = new Error(`Invalid product ID: ${item.id}`);
        error.statusCode = 400;
        throw error;
      }

      const [rows] = await connection.query(
        `SELECT id, price, title, category, brand, description,
                image, images, old_price, rating, reviews, stock, in_stock
         FROM products
         WHERE id = ?
         LIMIT 1`,
        [id]
      );

      if (!rows.length) {
        const error = new Error(`Product not found: ${item.id}`);
        error.statusCode = 400;
        throw error;
      }

      product = rows[0];
    }

    const price = Number(product.price);

    if (!Number.isFinite(price) || price < 0) {
      const error = new Error("A product has an invalid price.");
      error.statusCode = 400;
      throw error;
    }

    if (
      product.in_stock === 0 ||
      product.in_stock === false ||
      (Number(product.stock) === 0 && product.stock !== null)
    ) {
      const error = new Error(
        `${product.title || item.title || "A product"} is out of stock.`
      );
      error.statusCode = 400;
      throw error;
    }

    trusted.push({
      ...item,
      ...product,
      id: item.id,
      quantity,
      price,
    });
  }

  return trusted;
}

function calculateTrustedTotal(items, shippingMethod) {
  if (!["standard", "express"].includes(shippingMethod)) {
    const error = new Error("Invalid shipping method.");
    error.statusCode = 400;
    throw error;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return Math.round(
    (subtotal + (shippingMethod === "standard" ? 199 : 0)) * 100
  ) / 100;
}

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "ShopSpher API is running successfully 🚀",
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

/* ==================================
   ONLINE PRODUCT CATALOGUE
   Data source: DummyJSON
   ================================== */

// Get all available product categories
app.get("/api/online-products/categories", async (req, res) => {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category-list"
    );

    if (!response.ok) {
      throw new Error("Category API request failed");
    }

    const categories = await response.json();
    res.json(categories);
  } catch (error) {
    console.error("Online categories error:", error);

    res.status(502).json({
      message: "Unable to fetch online product categories",
    });
  }
});

// Get the online product catalogue
app.get("/api/online-products", async (req, res) => {
  try {
    const response = await fetch(
      "https://dummyjson.com/products?limit=0"
    );

    if (!response.ok) {
      throw new Error("Products API request failed");
    }

    const data = await response.json();

    let products = data.products.map((product) => ({
      id: `online-${product.id}`,
      externalId: product.id,
      title: product.title,
      slug: product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      brand: product.brand || "Unbranded",
      category: product.category,
      collection: product.category,
      badge: null,
      price: product.price,
      old_price: product.discountPercentage
        ? Number(
            (
              product.price /
              (1 - product.discountPercentage / 100)
            ).toFixed(2)
          )
        : null,
      rating: product.rating ?? 0,
      reviews: product.reviews?.length ?? 0,
      stock: product.stock ?? 0,
      in_stock: (product.stock ?? 0) > 0,
      description: product.description,
      image: product.thumbnail || product.images?.[0] || "",
      images: product.images || [],
      colors: [],
      sizes: [],
      features: [],
      specifications: {
        source: "DummyJSON",
        discountPercentage: product.discountPercentage ?? 0,
      },
    }));

    const category = req.query.category;

    if (category && category !== "All") {
      products = products.filter(
        (product) => product.category === category
      );
    }

    const search = String(req.query.q || "")
      .trim()
      .toLowerCase();

    if (search) {
      products = products.filter((product) =>
        [
          product.title,
          product.brand,
          product.category,
          product.description,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))
      );
    }

    res.json({
      products,
      total: products.length,
      source: "DummyJSON",
    });
  } catch (error) {
    console.error("Online products error:", error);

    res.status(502).json({
      message: "Unable to fetch online products",
    });
  }
});
/* ==================================
   IMPORT DUMMYJSON PRODUCTS TO MYSQL
   ================================== */

app.post(
  "/api/admin/import-dummyjson",
  requireAdmin,
  async (req, res) => {
    try {
      const response = await fetch(
        "https://dummyjson.com/products?limit=0"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch DummyJSON products");
      }

      const data = await response.json();
      let imported = 0;
      let updated = 0;

      for (const product of data.products) {
        const productSlug =
          `dummyjson-${product.id}-` +
          product.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const [result] = await db.query(
          `INSERT INTO products (
            title, slug, brand, category, collection, badge,
            price, old_price, rating, reviews, stock, in_stock,
            description, image, images, colors, sizes, features,
            specifications
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            brand = VALUES(brand),
            category = VALUES(category),
            collection = VALUES(collection),
            price = VALUES(price),
            old_price = VALUES(old_price),
            rating = VALUES(rating),
            reviews = VALUES(reviews),
            stock = VALUES(stock),
            in_stock = VALUES(in_stock),
            description = VALUES(description),
            image = VALUES(image),
            images = VALUES(images),
            specifications = VALUES(specifications)`,
          [
            product.title,
            productSlug,
            product.brand || "Unbranded",
            product.category || "General",
            product.category || null,
            null,
            product.price ?? 0,
            product.discountPercentage
              ? Number(
                  (
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)
                )
              : null,
            product.rating ?? 0,
            product.reviews?.length ?? 0,
            product.stock ?? 0,
            (product.stock ?? 0) > 0,
            product.description || "",
            product.thumbnail || product.images?.[0] || "",
            JSON.stringify(product.images || []),
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify({
              source: "DummyJSON",
              externalId: product.id,
              discountPercentage: product.discountPercentage ?? 0,
            }),
          ]
        );

        if (result.affectedRows === 1) imported++;
        else if (result.affectedRows > 1) updated++;
      }

      res.json({
        message: "DummyJSON import completed",
        sourceProducts: data.products.length,
        imported,
        updated,
      });
    } catch (error) {
      console.error("DummyJSON import error:", error);

      res.status(502).json({
        message: "Failed to import DummyJSON products",
        error: error.message,
      });
    }
  }
);

// ===============================
// ADMIN PRODUCT CRUD
// ===============================

app.post(
  "/api/admin/upload-images",
  requireAdmin,
  upload.array("images", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No images uploaded",
        });
      }

      const imageUrls = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      res.json({
        message: "Images uploaded successfully",
        images: imageUrls,
      });
    } catch (error) {
      console.error("Image upload error:", error);

      res.status(500).json({
        message: "Failed to upload images",
      });
    }
  }
);

// Add new product
app.post("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      brand,
      category,
      collection,
      badge,
      price,
      oldPrice,
      rating,
      reviews,
      stock,
      inStock,
      description,
      image,
      images,
      colors,
      sizes,
      features,
      specifications,
    } = req.body;

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (
      !title ||
      !brand ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Title, brand, category, price and stock are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products
       (
         title, slug, brand, category, collection, badge,
         price, old_price, rating, reviews, stock, in_stock,
         description, image, images, colors, sizes, features,
         specifications
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        brand,
        category,
        collection || null,
        badge || null,
        price,
        oldPrice || null,
        rating || 0,
        reviews || 0,
        stock,
        inStock !== undefined ? inStock : stock > 0,
        description || null,
        image || null,
        JSON.stringify(images || []),
        JSON.stringify(colors || []),
        JSON.stringify(sizes || []),
        JSON.stringify(features || []),
        JSON.stringify(specifications || {}),
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Admin create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
});

// Update product
app.put(
  "/api/admin/products/:productId",
  requireAdmin,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const {
        title,
        brand,
        category,
        collection,
        badge,
        price,
        oldPrice,
        rating,
        reviews,
        stock,
        inStock,
        description,
        image,
        images,
        colors,
        sizes,
        features,
        specifications,
      } = req.body;

      if (
        !title ||
        !brand ||
        !category ||
        price === undefined ||
        stock === undefined
      ) {
        return res.status(400).json({
          message: "Title, brand, category, price and stock are required",
        });
      }

      const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const [result] = await db.query(
        `UPDATE products
         SET
           title = ?,
           brand = ?,
           category = ?,
           collection = ?,
           badge = ?,
           price = ?,
           old_price = ?,
           rating = ?,
           reviews = ?,
           stock = ?,
           in_stock = ?,
           description = ?,
           image = ?,
           images = ?,
           colors = ?,
           sizes = ?,
           features = ?,
           specifications = ?
         WHERE id = ?`,
        [
          title,
          brand,
          category,
          collection || null,
          badge || null,
          price,
          oldPrice || null,
          rating || 0,
          reviews || 0,
          stock,
          inStock !== undefined ? inStock : stock > 0,
          description || null,
          image || null,
          JSON.stringify(images || []),
          JSON.stringify(colors || []),
          JSON.stringify(sizes || []),
          JSON.stringify(features || []),
          JSON.stringify(specifications || {}),
          productId,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Admin update product error:", error);

      res.status(500).json({
        message: "Failed to update product",
      });
    }
  }
);

// Delete product
app.delete(
  "/api/admin/products/:productId",
  requireAdmin,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const [result] = await db.query(
        "DELETE FROM products WHERE id = ?",
        [productId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Admin delete product error:", error);

      res.status(500).json({
        message: "Failed to delete product",
      });
    }
  }
);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// ADMIN AUTHENTICATION MIDDLEWARE
// ===============================

function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "shopspher-development-secret"
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

// ===============================
// AUTHENTICATION APIs
// ===============================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        email,
      },
      process.env.JWT_SECRET || "shopspher-development-secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Failed to create account",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "shopspher-development-secret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Failed to login",
    });
  }
});

// ===============================
// ADDRESS APIs
// ===============================

app.get("/api/addresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM addresses
       WHERE user_id = ?
       ORDER BY id DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      message: "Failed to fetch addresses",
    });
  }
});

app.post("/api/addresses", async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      city,
      postalCode,
      completeAddress,
    } = req.body;

    if (
      !userId ||
      !fullName ||
      !phone ||
      !city ||
      !postalCode ||
      !completeAddress
    ) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO addresses
       (user_id, full_name, phone, city, postal_code, complete_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        fullName,
        phone,
        city,
        postalCode,
        completeAddress,
      ]
    );

    res.status(201).json({
      message: "Address saved successfully",
      addressId: result.insertId,
    });
  } catch (error) {
    console.error("Add address error:", error);

    res.status(500).json({
      message: "Failed to save address",
    });
  }
});
// ===============================
// ORDER APIs
// ===============================

app.get("/api/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await db.query(
      `SELECT
        o.id, o.order_number, o.total, o.shipping_method,
        o.payment_method, o.status, o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:userId/:orderId", async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const [orders] = await db.query(
      `SELECT
        o.id, o.order_number, o.total, o.shipping_method,
        o.payment_method, o.status, o.created_at,
        a.id AS address_id, a.full_name, a.phone, a.city,
        a.postal_code, a.complete_address
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.price, p.title, p.image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orders[0].id]
    );

    res.json({ order: orders[0], items });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});

app.get("/api/orders/:userId/:orderId/tracking", async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const [orders] = await db.query(
      "SELECT id FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [history] = await db.query(
      `SELECT id, status, created_at
       FROM order_status_history
       WHERE order_id = ?
       ORDER BY created_at ASC`,
      [orderId]
    );

    res.json(history);
  } catch (error) {
    console.error("Get tracking history error:", error);
    res.status(500).json({ message: "Failed to fetch order tracking" });
  }
});

// Create a Razorpay order using server-calculated prices.
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const {
      userId,
      orderNumber,
      shippingMethod,
      items,
    } = req.body || {};

    if (
      !userId ||
      !orderNumber ||
      !shippingMethod ||
      !Array.isArray(items) ||
      !items.length
    ) {
      return res.status(400).json({
        message: "User, order number, shipping method and cart items are required.",
      });
    }

    const trustedItems = await getTrustedOrderItems(items);
    const total = calculateTrustedTotal(trustedItems, shippingMethod);
    const razorpay = getRazorpayClient();

    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: String(orderNumber).slice(0, 40),
      notes: {
        userId: String(userId),
        orderNumber: String(orderNumber),
      },
    });

    res.status(201).json({
      id: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to create Razorpay payment order.",
    });
  }
});

// Verify Razorpay payment signature and gateway details.
app.post("/api/payments/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (
      !verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).json({
        verified: false,
        message: "Payment signature verification failed.",
      });
    }

    const razorpay = getRazorpayClient();

    const [paymentOrder, payment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);

    if (
      payment.order_id !== paymentOrder.id ||
      Number(payment.amount) !== Number(paymentOrder.amount) ||
      payment.currency !== "INR" ||
      !["captured", "authorized"].includes(payment.status)
    ) {
      return res.status(400).json({
        verified: false,
        message: "Payment details do not match the Razorpay order.",
      });
    }

    res.json({
      verified: true,
      orderNumber: paymentOrder.receipt,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    res.status(error.statusCode || 500).json({
      verified: false,
      message: "Unable to verify this payment.",
    });
  }
});

// Save the order only after validating Razorpay payment proof.
app.post("/api/orders", async (req, res) => {
  let connection;
  let transactionStarted = false;

  try {
    const {
      userId,
      orderNumber,
      shippingMethod,
      paymentMethod,
      addressId,
      items,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (
      !userId ||
      !orderNumber ||
      !shippingMethod ||
      !paymentMethod ||
      !addressId ||
      !Array.isArray(items) ||
      !items.length
    ) {
      return res.status(400).json({
        message: "Incomplete order information.",
      });
    }

    const normalizedMethod = String(paymentMethod).toLowerCase();

    if (!["cod", "razorpay"].includes(normalizedMethod)) {
      return res.status(400).json({
        message: "Unsupported payment method.",
      });
    }

    if (normalizedMethod === "razorpay") {
      if (
        !verifyRazorpaySignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        )
      ) {
        return res.status(400).json({
          message: "Payment signature verification failed.",
        });
      }

      const razorpay = getRazorpayClient();

      const [gatewayOrder, payment] = await Promise.all([
        razorpay.orders.fetch(razorpay_order_id),
        razorpay.payments.fetch(razorpay_payment_id),
      ]);

      if (
        gatewayOrder.receipt !== String(orderNumber).slice(0, 40) ||
        payment.order_id !== gatewayOrder.id ||
        payment.currency !== "INR" ||
        !["captured", "authorized"].includes(payment.status)
      ) {
        return res.status(400).json({
          message: "Payment does not match this order.",
        });
      }
    }

    connection = await db.getConnection();

    const trustedItems = await getTrustedOrderItems(items, connection);
    const total = calculateTrustedTotal(trustedItems, shippingMethod);

    if (normalizedMethod === "razorpay") {
      const razorpay = getRazorpayClient();
      const gatewayOrder = await razorpay.orders.fetch(razorpay_order_id);

      if (Number(gatewayOrder.amount) !== Math.round(total * 100)) {
        return res.status(400).json({
          message: "Payment amount does not match the cart total. Please restart checkout.",
        });
      }
    }

    const [addresses] = await connection.query(
      `SELECT id FROM addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [addressId, userId]
    );

    if (!addresses.length) {
      return res.status(400).json({
        message: "Selected delivery address was not found for this user.",
      });
    }

    await connection.beginTransaction();
    transactionStarted = true;

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (user_id, order_number, total, shipping_method,
        payment_method, status, address_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        total,
        shippingMethod,
        normalizedMethod,
        "Confirmed",
        addressId,
      ]
    );

    const orderId = orderResult.insertId;

    await connection.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES (?, ?)`,
      [orderId, "Confirmed"]
    );

    for (const item of trustedItems) {
      let productId;

      const onlineMatch = /^online-(\d+)$/.exec(String(item.id));

      if (onlineMatch) {
        const slug = `online-dummyjson-${onlineMatch[1]}`;

        const [existingProducts] = await connection.query(
          "SELECT id FROM products WHERE slug = ? LIMIT 1",
          [slug]
        );

        if (existingProducts.length) {
          productId = existingProducts[0].id;

          await connection.query(
            "UPDATE products SET price = ? WHERE id = ?",
            [item.price, productId]
          );
        } else {
          const [productResult] = await connection.query(
            `INSERT INTO products
             (slug, title, brand, category, price, old_price,
              rating, reviews, stock, in_stock, description, image, images)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              slug,
              item.title,
              item.brand || "Unbranded",
              item.category || "Other",
              item.price,
              item.old_price ?? item.oldPrice ?? null,
              item.rating ?? 0,
              item.reviews ?? 0,
              item.stock ?? 0,
              item.in_stock ?? item.inStock ?? true,
              item.description || null,
              item.image || null,
              JSON.stringify(
                Array.isArray(item.images)
                  ? item.images
                  : item.image
                    ? [item.image]
                    : []
              ),
            ]
          );

          productId = productResult.insertId;
        }
      } else {
        productId = Number(item.id);
      }

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, productId, item.quantity, item.price]
      );
    }

    await connection.commit();
    transactionStarted = false;

    try {
      const [users] = await db.query(
        "SELECT name, email FROM users WHERE id = ? LIMIT 1",
        [userId]
      );

      if (users.length && users[0].email) {
        await sendOrderConfirmation({
          to: users[0].email,
          customerName: users[0].name,
          orderNumber,
          total,
          paymentMethod: normalizedMethod,
          shippingMethod,
        });

        console.log(`Order confirmation email sent for ${orderNumber}`);
      }
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      orderNumber,
      total,
    });
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Order rollback failed:", rollbackError.message);
      }
    }

    console.error("Create order error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to create order.",
    });
  } finally {
    if (connection) connection.release();
  }
});
// ===============================
// UPDATE ORDER STATUS
// ===============================

app.put("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        allowedStatuses,
      });
    }

    const [result] = await db.query(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      orderId,
      status,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
});

// ===============================
// RETURN / EXCHANGE APIs
// ===============================

app.post("/api/orders/:orderId/return-request", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId, productId, requestType, reason } = req.body;

    if (!userId || !productId || !requestType || !reason) {
      return res.status(400).json({
        message: "User ID, product ID, request type and reason are required",
      });
    }

    if (!["Return", "Exchange"].includes(requestType)) {
      return res.status(400).json({
        message: "Invalid request type",
      });
    }

    const [orders] = await db.query(
      `SELECT id, status, created_at
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orders[0].status !== "Delivered") {
      return res.status(400).json({
        message: "Return or exchange is available only after delivery",
      });
    }

    const [orderItems] = await db.query(
      `SELECT product_id
       FROM order_items
       WHERE order_id = ? AND product_id = ?`,
      [orderId, productId]
    );

    if (!orderItems.length) {
      return res.status(400).json({
        message: "This product does not belong to the order",
      });
    }

    const [existingRequests] = await db.query(
      `SELECT id
       FROM return_requests
       WHERE order_id = ?
         AND product_id = ?
         AND status NOT IN ('Completed', 'Rejected')`,
      [orderId, productId]
    );

    if (existingRequests.length) {
      return res.status(409).json({
        message: "A return or exchange request already exists for this product",
      });
    }

    const [result] = await db.query(
      `INSERT INTO return_requests
       (order_id, product_id, request_type, reason, status, refund_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        productId,
        requestType,
        reason,
        "Requested",
        requestType === "Return" ? "Pending" : "Not Applicable",
      ]
    );

    res.status(201).json({
      message: `${requestType} request submitted successfully`,
      requestId: result.insertId,
    });
  } catch (error) {
    console.error("Create return/exchange request error:", error);

    res.status(500).json({
      message: "Failed to create return/exchange request",
    });
  }
});

// Get return/exchange requests for an order
app.get("/api/orders/:orderId/return-requests", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [requests] = await db.query(
      `SELECT
        rr.id, rr.order_id, rr.product_id, rr.request_type,
        rr.reason, rr.status, rr.refund_status,
        rr.created_at, rr.updated_at, p.title, p.image
       FROM return_requests rr
       LEFT JOIN products p ON rr.product_id = p.id
       WHERE rr.order_id = ?
       ORDER BY rr.created_at DESC`,
      [orderId]
    );

    res.json(requests);
  } catch (error) {
    console.error("Get return/exchange requests error:", error);

    res.status(500).json({
      message: "Failed to fetch return/exchange requests",
    });
  }
});

// Update return/exchange request status
app.put(
  "/api/return-requests/:requestId/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status, refundStatus } = req.body;

      const allowedStatuses = [
        "Requested",
        "Approved",
        "Pickup Scheduled",
        "Picked Up",
        "Processing",
        "Completed",
        "Rejected",
      ];

      const allowedRefundStatuses = [
        "Not Applicable",
        "Pending",
        "Processed",
      ];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid return/exchange status",
          allowedStatuses,
        });
      }

      if (
        refundStatus &&
        !allowedRefundStatuses.includes(refundStatus)
      ) {
        return res.status(400).json({
          message: "Invalid refund status",
          allowedRefundStatuses,
        });
      }

      let query;
      let values;

      if (refundStatus) {
        query = `
          UPDATE return_requests
          SET status = ?, refund_status = ?
          WHERE id = ?
        `;
        values = [status, refundStatus, requestId];
      } else {
        query = `
          UPDATE return_requests
          SET status = ?
          WHERE id = ?
        `;
        values = [status, requestId];
      }

      const [result] = await db.query(query, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Return/exchange request not found",
        });
      }

      res.json({
        message: "Return/exchange status updated successfully",
        requestId,
        status,
        refundStatus: refundStatus || undefined,
      });
    } catch (error) {
      console.error("Update return/exchange status error:", error);

      res.status(500).json({
        message: "Failed to update return/exchange status",
      });
    }
  }
);

// ===============================
// ADMIN CUSTOMERS API
// ===============================

app.get("/api/admin/customers", requireAdmin, async (req, res) => {
  try {
    const [customers] = await db.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.created_at,
        COUNT(DISTINCT o.id) AS orders_count,
        COALESCE(SUM(o.total), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id
       WHERE u.role = 'customer'
       GROUP BY u.id, u.name, u.email, u.created_at
       ORDER BY u.created_at DESC`
    );

    res.json(customers);
  } catch (error) {
    console.error("Admin customers error:", error);

    res.status(500).json({
      message: "Failed to fetch admin customers",
    });
  }
});
// ===============================
// ADMIN DASHBOARD API
// ===============================

app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const [[ordersCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders"
    );

    const [[productsCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM products"
    );

    const [[customersCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'customer'"
    );

    const [[returnsCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM return_requests
       WHERE status NOT IN ('Completed', 'Rejected')`
    );

    const [statusRows] = await db.query(
      "SELECT status, COUNT(*) AS total FROM orders GROUP BY status"
    );

    const statusCounts = {
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      "Out for Delivery": 0,
      Delivered: 0,
    };

    statusRows.forEach((row) => {
      statusCounts[row.status] = Number(row.total);
    });

    res.json({
      totalOrders: Number(ordersCount.total),
      products: Number(productsCount.total),
      customers: Number(customersCount.total),
      returns: Number(returnsCount.total),
      orderStatuses: statusCounts,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      message: "Failed to load admin dashboard",
    });
  }
});

// ===============================
// ADMIN ORDERS API
// ===============================

app.get("/api/admin/orders", requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT
        o.id,
        o.order_number,
        o.total,
        o.shipping_method,
        o.payment_method,
        o.status,
        o.created_at,
        u.id AS user_id,
        u.name AS customer_name,
        u.email AS customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    console.error("Admin orders error:", error);

    res.status(500).json({
      message: "Failed to fetch admin orders",
    });
  }
});

// Update order status from admin panel
app.put(
  "/api/admin/orders/:orderId/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
      ];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
          allowedStatuses,
        });
      }

      const [result] = await db.query(
        `UPDATE orders
         SET status = ?
         WHERE id = ?`,
        [status, orderId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      await db.query(
        `INSERT INTO order_status_history (order_id, status)
         VALUES (?, ?)`,
        [orderId, status]
      );

      try {
        const [orders] = await db.query(
          `SELECT
             o.order_number,
             u.name AS customer_name,
             u.email AS customer_email
           FROM orders o
           LEFT JOIN users u ON o.user_id = u.id
           WHERE o.id = ?
           LIMIT 1`,
          [orderId]
        );

        if (orders.length && orders[0].customer_email) {
          await sendOrderStatusUpdate({
            to: orders[0].customer_email,
            customerName: orders[0].customer_name,
            orderNumber: orders[0].order_number,
            status,
          });

          console.log(
            `Order status email sent for ${orders[0].order_number}: ${status}`
          );
        } else {
          console.warn(`No customer email found for order ${orderId}`);
        }
      } catch (emailError) {
        console.error("Order status email failed:", emailError.message);
      }

      res.json({
        message: "Order status updated successfully",
        orderId,
        status,
      });
    } catch (error) {
      console.error("Admin update order status error:", error);

      res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);

// ===============================
// ADMIN RETURNS API
// ===============================

app.get("/api/admin/returns", requireAdmin, async (req, res) => {
  try {
    const [returns] = await db.query(
      `SELECT
        rr.id,
        rr.order_id,
        rr.product_id,
        rr.request_type,
        rr.reason,
        rr.status,
        rr.refund_status,
        rr.created_at,
        rr.updated_at,
        p.title AS product_title,
        p.image AS product_image,
        o.order_number,
        u.name AS customer_name,
        u.email AS customer_email
       FROM return_requests rr
       LEFT JOIN products p ON rr.product_id = p.id
       LEFT JOIN orders o ON rr.order_id = o.id
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY rr.created_at DESC`
    );

    res.json(returns);
  } catch (error) {
    console.error("Admin returns error:", error);

    res.status(500).json({
      message: "Failed to fetch admin returns",
    });
  }
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`ShopSpher server running on port ${PORT}`);

  const emailReady = await verifyEmailService();

  if (emailReady) {
    console.log("ShopSpher email service is ready.");
  } else {
    console.warn(
      "ShopSpher email service is not ready. Check your private server/.env settings."
    );
  }
});