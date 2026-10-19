
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "shopspher",
  port: Number(process.env.DB_PORT || 3306),

  // Enable secure TLS connection for hosted TiDB
  ssl:
    process.env.DB_SSL === "true"
      ? { minVersion: "TLSv1.2" }
      : undefined,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
}

testConnection();

module.exports = pool;
