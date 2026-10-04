import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import Order from "../model/Order.js";
dotenv.config();

const app = express();
app.use(express.json());

let razorpay = null;

const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

app.post("/create-order", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Razorpay credentials not configured",
      });
    }

    const { amount, currency = "INR", receipt } = req.body;

    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    // Razorpay rejects with plain objects (not Error instances).
    const description =
      error?.error?.description || error?.message || "Unknown payment error";
    const statusCode = error?.statusCode || error?.status || 500;

    console.error("Razorpay order creation error:", error);

    const isAuthError =
      statusCode === 401 || /auth/i.test(String(description));

    res.status(500).json({
      success: false,
      error: isAuthError
        ? "Razorpay authentication failed. Set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env"
        : description,
    });
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

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Persist the order so it shows up on the Orders page.
    let orderSaved = false;
    try {
      const products = (Array.isArray(items) ? items : [])
        .filter((item) => item && (item.product || item.name))
        .map((item) => ({
          product:
            item.product && mongoose.isValidObjectId(item.product)
              ? item.product
              : undefined,
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image,
          quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
        }));

      const total = Number(totalPrice);

      if (products.length && Number.isFinite(total) && total > 0) {
        const existing = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (existing) {
          orderSaved = true;
        } else {
          const saved = await Order.create({
            user: req.user._id,
            products,
            totalPrice: total,
            status: "paid",
            razorpayOrderId: razorpay_order_id,
          });
          orderSaved = Boolean(saved?._id);
          console.log(`[payment] order saved: ${saved?._id} (user: ${req.user._id})`);
        }
      } else {
        console.warn("[payment] order not saved: missing items or invalid totalPrice", {
          hasProducts: products.length > 0,
          total,
        });
      }
    } catch (orderError) {
      // Payment is authentic — log the persistence failure but don't fail the request.
      console.error("Order save after payment failed:", orderError);
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
      orderCreated: orderSaved,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error?.error?.description || error?.message || "Verification failed",
    });
  }
});

export default app;
