import mongoose  from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.MONGODB_URI){
    throw new Error(
    "please provider MONGODB_URI in the .env file"
    )
}

// Cache connection for serverless environments
let cachedConnection = null

async function connectDB() {
    // Return cached connection if available (serverless optimization)
    if (cachedConnection) {
        return cachedConnection
    }

    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            // Optimize for serverless
            maxPoolSize: 1, // Maintain only one connection per instance
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        })
        console.log('✅ Connected to MongoDB')
        cachedConnection = connection
        return connection
    }catch(error){
       console.error("❌ MongoDB connect error:", error)
       // Don't exit in serverless - let the function handle the error
       if (process.env.NODE_ENV === 'production') {
           throw error
       } else {
           process.exit(1)
       }
    }
}

export default connectDB