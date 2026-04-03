import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  subtotal: Number,
});

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true},
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ NORMAL CART
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },

    // ✅ COLLECTION FEATURE
    collections: [collectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartSchema);
