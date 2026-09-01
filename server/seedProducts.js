const fs = require("fs");
const path = require("path");
const db = require("./db");

// Read your existing frontend products.js
const productsPath = path.join(
  __dirname,
  "..",
  "client",
  "src",
  "data",
  "products.js"
);

function loadProducts() {
  let source = fs.readFileSync(productsPath, "utf8");

  // Convert:
  // export default products;
  // into:
  // return products;
  source = source.replace(
    /export\s+default\s+products\s*;?\s*$/,
    "return products;"
  );

  return new Function(source)();
}

async function seedProducts() {
  try {
    const products = loadProducts();

    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      await db.execute(
        `
        INSERT INTO products (
          id,
          slug,
          title,
          brand,
          category,
          collection,
          badge,
          price,
          old_price,
          rating,
          reviews,
          stock,
          in_stock,
          description,
          image,
          images,
          colors,
          sizes,
          features,
          specifications
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          brand = VALUES(brand),
          category = VALUES(category),
          collection = VALUES(collection),
          badge = VALUES(badge),
          price = VALUES(price),
          old_price = VALUES(old_price),
          rating = VALUES(rating),
          reviews = VALUES(reviews),
          stock = VALUES(stock),
          in_stock = VALUES(in_stock),
          description = VALUES(description),
          image = VALUES(image),
          images = VALUES(images),
          colors = VALUES(colors),
          sizes = VALUES(sizes),
          features = VALUES(features),
          specifications = VALUES(specifications)
        `,
        [
          product.id,
          product.slug,
          product.title,
          product.brand,
          product.category,
          product.collection,
          product.badge || null,
          product.price,
          product.oldPrice || null,
          product.rating || 0,
          product.reviews || 0,
          product.stock || 0,
          product.inStock ? 1 : 0,
          product.description || null,
          product.image || null,
          JSON.stringify(product.images || []),
          JSON.stringify(product.colors || []),
          JSON.stringify(product.sizes || []),
          JSON.stringify(product.features || []),
          JSON.stringify(product.specifications || {}),
        ]
      );
    }

    console.log("✅ All products inserted successfully!");

    const [rows] = await db.execute(
      "SELECT id, title, price, stock FROM products ORDER BY id"
    );

    console.table(rows);

    process.exit(0);
  } catch (error) {
    console.error("❌ Product seeding failed:");
    console.error(error);
    process.exit(1);
  }
}

seedProducts();