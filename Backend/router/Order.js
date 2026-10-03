import express from "express";
import { createOrder, getMyOrders } from "../controller/Order.js";
import authMiddleware from "../middleware/auth.js";

const order = express.Router();

order.get("/", authMiddleware, getMyOrders);
order.post("/", authMiddleware, createOrder);

export default order;
