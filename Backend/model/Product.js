import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: String,
  brand: String,
  price: {
    type: Number,
    required: true,
  },
  discountPrice: Number,
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
      },
    },
  ],
  stock: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  embedding: {
    type: [Number], // vector
    default: [],
  },
});

ProductSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
