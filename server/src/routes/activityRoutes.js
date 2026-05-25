import express from "express";
import { ActivityLog } from "../models/ActivityLog.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const activities = await ActivityLog.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

