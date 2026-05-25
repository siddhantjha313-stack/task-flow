import express from "express";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    }).populate("owner members", "-password");
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const project = new Project({
      name,
      description,
      color,
      owner: req.user.id,
      members: [req.user.id]
    });
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner members", "-password");
    const tasks = await Task.find({ project: req.params.id }).populate("assignee", "-password");
    res.json({ success: true, project, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, color },
      { new: true }
    ).populate("owner members", "-password");
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: "archived" });
    res.json({ success: true, message: "Project archived" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

