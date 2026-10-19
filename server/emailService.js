
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify the email configuration
async function verifyEmailService() {
  try {
    await transporter.verify();
    console.log("Email service connected successfully");
    return true;
  } catch (error) {
    console.error("Email service connection failed:", error.message);
    return false;
  }
}

// Send order confirmation email
async function sendOrderConfirmation({
  to,
  customerName,
  orderNumber,
  total,
  paymentMethod,
  shippingMethod,
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `ShopSpher Order Confirmed - ${orderNumber}`,
    text: `
Hi ${customerName || "Customer"},

Thank you for shopping with ShopSpher!

Your order has been confirmed.

Order Number: ${orderNumber}
Order Total: ₹${Number(total).toFixed(2)}
Payment Method: ${paymentMethod}
Shipping Method: ${shippingMethod}
Order Status: Confirmed

Thank you for choosing ShopSpher!
    `,
  });
}

// Send order status update email
async function sendOrderStatusUpdate({
  to,
  customerName,
  orderNumber,
  status,
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `ShopSpher Order Update - ${orderNumber}`,
    text: `
Hi ${customerName || "Customer"},

Your ShopSpher order status has been updated.

Order Number: ${orderNumber}
Current Status: ${status}

Thank you for shopping with ShopSpher!
    `,
  });
}

module.exports = {
  verifyEmailService,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};
