import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import { webhookStripe } from "./controllers/order.controller.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

/* -------------------- CONNECT DB ONCE -------------------- */
await connectDB();

/* -------------------- STRIPE WEBHOOK (MUST BE FIRST) -------------------- */
app.post(
  "/api/order/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookStripe
);
/* -------------------- MIDDLEWARE -------------------- */
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "*",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

/* -------------------- ROOT ROUTE (FIX Cannot GET /) -------------------- */
app.get("/", (req, res) => {
  res.send("🚀 API is running successfully");
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

/* -------------------- LOCAL DEV ONLY -------------------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("✅ Server running on port", PORT);
  });
}

/* -------------------- EXPORT FOR VERCEL -------------------- */
export default app;
