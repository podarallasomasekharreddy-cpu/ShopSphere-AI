const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
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

    // Check if email already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Create JWT
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

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
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

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
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

// Get all addresses for logged-in user
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


// Add new address
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

// Get all orders for a user
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await db.query(
      `SELECT
        o.id,
        o.order_number,
        o.total,
        o.shipping_method,
        o.payment_method,
        o.status,
        o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// Get single order details for a user
app.get("/api/orders/:userId/:orderId", async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    // Get order and delivery address
    const [orders] = await db.query(
      `SELECT
        o.id,
        o.order_number,
        o.total,
        o.shipping_method,
        o.payment_method,
        o.status,
        o.created_at,
        a.id AS address_id,
        a.full_name,
        a.phone,
        a.city,
        a.postal_code,
        a.complete_address
       FROM orders o
       LEFT JOIN addresses a
         ON o.address_id = a.id
       WHERE o.id = ?
         AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orders[0];

    // Get products/items belonging to this order
    const [items] = await db.query(
      `SELECT
        oi.product_id,
        oi.quantity,
        oi.price,
        p.title,
        p.image
       FROM order_items oi
       LEFT JOIN products p
         ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({
      order,
      items,
    });
  } catch (error) {
    console.error("Get order details error:", error);

    res.status(500).json({
      message: "Failed to fetch order details",
    });
  }
});

// Get tracking history for an order
app.get("/api/orders/:userId/:orderId/tracking", async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    // Make sure the order belongs to this user
    const [orders] = await db.query(
      `SELECT id
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const [history] = await db.query(
      `SELECT
        id,
        status,
        created_at
       FROM order_status_history
       WHERE order_id = ?
       ORDER BY created_at ASC`,
      [orderId]
    );

    res.json(history);
  } catch (error) {
    console.error("Get tracking history error:", error);

    res.status(500).json({
      message: "Failed to fetch tracking history",
    });
  }
});

// Create new order
app.post("/api/orders", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      userId,
      orderNumber,
      total,
      shippingMethod,
      paymentMethod,
      addressId,
      items,
    } = req.body;

    if (
      !userId ||
      !orderNumber ||
      total === undefined ||
      !shippingMethod ||
      !paymentMethod ||
      !addressId ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Incomplete order information",
      });
    }

    await connection.beginTransaction();

    // ===============================

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (
         user_id,
         order_number,
         total,
         shipping_method,
         payment_method,
         status,
         address_id
       )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        total,
        shippingMethod,
        paymentMethod,
        "Confirmed",
        addressId,
      ]
    );

    const orderId = orderResult.insertId;

    // Save initial tracking status
await connection.query(
  `INSERT INTO order_status_history
   (order_id, status)
   VALUES (?, ?)`,
  [orderId, "Confirmed"]
);

    // Add order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items
         (
           order_id,
           product_id,
           quantity,
           price
         )
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      orderNumber,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  } finally {
    connection.release();
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

// Create a return or exchange request
app.post("/api/orders/:orderId/return-request", async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      userId,
      productId,
      requestType,
      reason,
    } = req.body;

    // Validate input
    if (
      !userId ||
      !productId ||
      !requestType ||
      !reason
    ) {
      return res.status(400).json({
        message:
          "User ID, product ID, request type and reason are required",
      });
    }

    // Only Return or Exchange is allowed
    if (!["Return", "Exchange"].includes(requestType)) {
      return res.status(400).json({
        message: "Invalid request type",
      });
    }

    // Check that the order belongs to this user
    // and has been delivered
    const [orders] = await db.query(
      `SELECT id, status, created_at
       FROM orders
       WHERE id = ?
         AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orders[0];

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message:
          "Return or exchange is available only after delivery",
      });
    }

    // Check that this product belongs to the order
    const [orderItems] = await db.query(
      `SELECT product_id
       FROM order_items
       WHERE order_id = ?
         AND product_id = ?`,
      [orderId, productId]
    );

    if (orderItems.length === 0) {
      return res.status(400).json({
        message: "This product does not belong to the order",
      });
    }

    // Prevent duplicate active requests
    const [existingRequests] = await db.query(
      `SELECT id
       FROM return_requests
       WHERE order_id = ?
         AND product_id = ?
         AND status NOT IN ('Completed', 'Rejected')`,
      [orderId, productId]
    );

    if (existingRequests.length > 0) {
      return res.status(409).json({
        message:
          "A return or exchange request already exists for this product",
      });
    }

    // Create request
    const [result] = await db.query(
      `INSERT INTO return_requests
       (
         order_id,
         product_id,
         request_type,
         reason,
         status,
         refund_status
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        productId,
        requestType,
        reason,
        "Requested",
        requestType === "Return"
          ? "Pending"
          : "Not Applicable",
      ]
    );

    res.status(201).json({
      message:
        `${requestType} request submitted successfully`,
      requestId: result.insertId,
    });
  } catch (error) {
    console.error(
      "Create return/exchange request error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create return/exchange request",
    });
  }
});


// Get return/exchange requests for an order
app.get(
  "/api/orders/:orderId/return-requests",
  async (req, res) => {
    try {
      const { orderId } = req.params;

      const [requests] = await db.query(
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
          p.title,
          p.image
         FROM return_requests rr
         LEFT JOIN products p
           ON rr.product_id = p.id
         WHERE rr.order_id = ?
         ORDER BY rr.created_at DESC`,
        [orderId]
      );

      res.json(requests);
    } catch (error) {
      console.error(
        "Get return/exchange requests error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch return/exchange requests",
      });
    }
  }
);


// Update return/exchange request status
app.put(
  "/api/return-requests/:requestId/status",
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
          SET status = ?,
              refund_status = ?
          WHERE id = ?
        `;

        values = [
          status,
          refundStatus,
          requestId,
        ];
      } else {
        query = `
          UPDATE return_requests
          SET status = ?
          WHERE id = ?
        `;

        values = [
          status,
          requestId,
        ];
      }

      const [result] = await db.query(
        query,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Return/exchange request not found",
        });
      }

      res.json({
        message:
          "Return/exchange status updated successfully",
        requestId,
        status,
        refundStatus:
          refundStatus || undefined,
      });
    } catch (error) {
      console.error(
        "Update return/exchange status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update return/exchange status",
      });
    }
  }
);

// ===============================
// ADMIN DASHBOARD API
// ===============================

app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const [[ordersCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM orders`
    );

    const [[productsCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM products`
    );

    const [[customersCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM users
       WHERE role = 'customer'`
    );

    const [[returnsCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM return_requests
       WHERE status NOT IN ('Completed', 'Rejected')`
    );

    const [statusRows] = await db.query(
      `SELECT status, COUNT(*) AS total
       FROM orders
       GROUP BY status`
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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`ShopSpher server running on port ${PORT}`);
});