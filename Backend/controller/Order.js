import Order from "../model/Order.js";
import mongoose from "mongoose";

const sanitizeProducts = (products = []) =>
  (Array.isArray(products) ? products : [])
    .filter((item) => item && (item.product || item.name))
    .map((item) => ({
      product: item.product && mongoose.isValidObjectId(item.product) ? item.product : undefined,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image,
      quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
    }));

export const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, status } = req.body;
    const items = sanitizeProducts(products);
    const total = Number(totalPrice);

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid totalPrice required",
      });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      products: items,
      totalPrice: total,
      status: status === "paid" ? "paid" : "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};
