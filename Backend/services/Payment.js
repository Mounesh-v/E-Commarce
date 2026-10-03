import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";
import Order from "../model/Order.js";
dotenv.config();

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const safeCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
};

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(numericAmount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalPrice,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = safeCompare(expectedSignature, razorpay_signature);

    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    let orderSaved = false;
    try {
      const orderItems = (Array.isArray(items) ? items : [])
        .filter((item) => item && item.name)
        .map((item) => ({
          product: item.product,
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image,
          quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
        }));

      const total = Number(totalPrice);
      if (orderItems.length && Number.isFinite(total) && total > 0) {
        await Order.create({
          user: req.user._id,
          products: orderItems,
          totalPrice: total,
          status: "paid",
          razorpayOrderId: razorpay_order_id,
        });
        orderSaved = true;
      }
    } catch (error) {
      console.error("Order save failed after verified payment:", error);
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderSaved,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
