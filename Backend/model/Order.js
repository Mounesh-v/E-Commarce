import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Objectid,
    ref: "User",
    required: true,
  },
  products: [
    {
      products: {
        type: mongoose.Schema.Types.Objectid,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
  },
});

const Order = mongoose.model("Orders", OrderSchema);

export default Order;
