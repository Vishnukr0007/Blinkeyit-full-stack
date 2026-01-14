import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from "./route/cart.route.js"
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import { webhookStripe } from './controllers/order.controller.js'

dotenv.config()

const app = express()

// Connect to database (serverless-friendly): ensure DB is ready before handlers
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('❌ Failed to connect to DB:', error)
    return res.status(500).json({
      message: 'Database connection failed',
      error: true
    })
  }
})

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookStripe
);

// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || "*"
}))
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
  crossOriginResourcePolicy: false
}))


app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log('✅ Server is running on port', PORT)
    })
  }).catch(err => {
    console.error('❌ Failed to connect to DB:', err)
  })
}

// Export for Vercel serverless function
export default app
