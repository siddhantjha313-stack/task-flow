import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn(
      "Warning: MONGO_URI is not set. Skipping MongoDB connection. " +
      "Database-dependent features will be unavailable."
    );
    return;
  }

  mongoose.set("strictQuery", true);

  try {
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};
