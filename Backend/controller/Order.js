import Order from "../model/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice, status } = req.body;
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      status,
    });
    await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};
