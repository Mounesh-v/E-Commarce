import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import user from "./router/User.js";
import product from "./router/Product.js";
import cart from "./router/Cart.js";
import aiRoutes from "./router/ai.routes.js";
import payment from "./services/Payment.js";
import { cleanupAiResources } from "./services/ai.service.js";
import { logMemoryUsage } from "./services/transformer.util.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const memoryLogIntervalMs = Number(process.env.MEMORY_LOG_INTERVAL_MS || 60000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: process.env.JSON_BODY_LIMIT || "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.URLENCODED_BODY_LIMIT || "1mb",
  }),
);

app.get("/", (req, res) => {
  res.json({ msg: "Server Running Health Check" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api/auth", user);
app.use("/api/product", product);
app.use("/api/cart", cart);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", payment);

let memoryTimer;
let server;

const shutdown = async (signal) => {
  console.log(`[server] ${signal} received, shutting down`);
  if (memoryTimer) clearInterval(memoryTimer);

  await cleanupAiResources().catch((error) => {
    console.error("AI cleanup error:", error.message);
  });

  if (server) {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown("uncaughtException");
});

const startServer = async () => {
  await connectDb();

  logMemoryUsage("startup");
  memoryTimer = setInterval(() => logMemoryUsage("interval"), memoryLogIntervalMs);
  memoryTimer.unref?.();

  server = app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
};

startServer();
