import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

dotenv.config();

async function seed() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    
    // Create demo users
    const admin = await User.create({
      email: "admin@taskflow.ai",
      password: "password123",
      name: "Admin User",
      role: "admin"
    });
    
    const member1 = await User.create({
      email: "john@taskflow.ai",
      password: "password123",
      name: "John Doe",
      role: "member"
    });
    
    const member2 = await User.create({
      email: "jane@taskflow.ai",
      password: "password123",
      name: "Jane Smith",
      role: "member"
    });
    
    // Create demo projects
    const project1 = await Project.create({
      name: "Website Redesign",
      description: "Redesign company website",
      owner: admin._id,
      members: [admin._id, member1._id, member2._id],
      color: "#3b82f6"
    });
    
    const project2 = await Project.create({
      name: "Mobile App",
      description: "Build mobile application",
      owner: admin._id,
      members: [admin._id, member1._id],
      color: "#10b981"
    });
    
    // Create demo tasks
    await Task.create({
      title: "Design mockups",
      description: "Create UI mockups for new design",
      project: project1._id,
      assignee: member1._id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    await Task.create({
      title: "Setup development environment",
      description: "Configure dev tools and dependencies",
      project: project2._id,
      assignee: member2._id,
      status: "todo",
      priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });
    
    console.log("✓ Database seeded successfully");
    await disconnectDB();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();

