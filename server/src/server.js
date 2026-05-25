import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDemoData } from "./utils/seedData.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.DEMO_SEED === "true") {
      await seedDemoData({ reset: false });
    }

    app.listen(port, () => {
      console.log(`TaskFlow AI API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
