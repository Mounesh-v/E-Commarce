import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addToCollection,
  createCollection,
  getCollections,
} from "../controller/Cart.js";
import authMiddleware from "../middleware/auth.js";

const cart = express.Router();

cart.post("/add", authMiddleware, addToCart);
cart.post("/create-collection", authMiddleware, createCollection);
cart.get("/collections", authMiddleware, getCollections);
cart.post("/collection", authMiddleware, addToCollection);

cart.get("/get-cart", authMiddleware, getCart);
cart.put("/update", authMiddleware, updateCartItem);
cart.delete("/remove/:productId", authMiddleware, removeCartItem);
cart.delete("/clear", authMiddleware, clearCart);

export default cart;
