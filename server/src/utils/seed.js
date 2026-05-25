import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { seedDemoData } from "./seedData.js";

try {
  await connectDB();
  const result = await seedDemoData({ reset: true });
  console.log("Seed complete:", result);
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
}
