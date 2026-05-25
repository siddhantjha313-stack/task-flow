import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow";
  
  try {
    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function disconnectDB() {
  return mongoose.disconnect();
}

