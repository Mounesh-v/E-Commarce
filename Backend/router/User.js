import express from "express";
import {
  getMe,
  getUser,
  login,
  register,
  updateProfile,
} from "../controller/User.js";
import authMiddleware from "../middleware/auth.js";
// import upload from "../middleware/upload.js";
const user = express.Router();

user.post("/user/register",register);
user.post("/user/login",login);
user.get("/me", authMiddleware, getMe);
user.put("/profile", authMiddleware, updateProfile);
user.get("/user/:id", getUser);

export default user;
