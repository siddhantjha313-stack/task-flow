import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDemoData } from "./utils/seedData.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection error — continuing without database:", error.message);
  }

  try {
    if (process.env.DEMO_SEED === "true") {
      await seedDemoData({ reset: false });
    }
  } catch (error) {
    console.error("Demo seed failed — continuing without seed data:", error.message);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`TaskFlow AI API running on port ${port}`);
    console.log(`Server accessible on all interfaces (0.0.0.0:${port})`);
  });
};

startServer();
