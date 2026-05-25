import express from "express";
import { Task } from "../models/Task.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignee project", "-password");
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, project, assignee, priority, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      project,
      assignee,
      priority,
      dueDate
    });
    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignee project comments.author", "-password");
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status, priority, assignee, subtasks } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, priority, assignee, subtasks },
      { new: true }
    ).populate("assignee project", "-password");
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: { author: req.user.id, text }
        }
      },
      { new: true }
    ).populate("comments.author", "-password");
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

