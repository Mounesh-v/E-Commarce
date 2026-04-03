import express from "express";
import { createProduct, createProductsBulk, deleteProduct, getAllProducts, getSingleProduct, searchProducts, suggestProducts, updateProduct } from "../controller/Product.js";

const product = express.Router();

product.post("/",createProduct)
product.get("/get-all-products", getAllProducts);
product.post("/bulk", createProductsBulk);

// always keep search and suggest routes above the :id route to avoid conflicts
product.get("/search", searchProducts);
product.get("/suggest", suggestProducts);

// /:id route should be at the end to avoid conflicts with other routes
product.get("/:id", getSingleProduct);
product.put("/:id", updateProduct);
product.delete("/:id", deleteProduct);

export default product;