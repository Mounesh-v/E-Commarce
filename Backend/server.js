import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import user from "./router/User.js";
import product from "./router/Product.js";
import cart from "./router/Cart.js";
import aiRoutes from "./router/ai.routes.js";
import { loadModel } from "./services/ai.service.js";
import payment from "./services/Payment.js";
import cors from "cors";
dotenv.config();

const app = express();
const port =3000;

// connectDb();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "hi" });
});

app.use(cors({
  origin: "*",
  credentials: true
}))


app.use("/api/auth",user)
app.use("/api/product",product)
app.use("/api/cart",cart)
app.use("/api/ai", aiRoutes);
app.use("/api/payment",payment)



const startServer = async () => {
  await connectDb();
  await loadModel(); // 🔥 must load first

  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
};

startServer();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})