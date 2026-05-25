import express from "express";
import { User } from "../models/User.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ status: "active" }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/invite", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    
    const user = new User({ email, name, password: "temp", role: "member" });
    await user.save();
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "inactive" });
    res.json({ success: true, message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

