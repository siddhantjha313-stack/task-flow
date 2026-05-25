import ActivityLog from "../models/ActivityLog.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const demoPassword = "Taskflow@123";

export const seedDemoData = async ({ reset = false } = {}) => {
  const existingAdmin = await User.findOne({ email: "admin@taskflow.ai" });
  if (existingAdmin && !reset) {
    return {
      skipped: true,
      message: "Demo data already exists"
    };
  }

  if (reset) {
    await Promise.all([
      ActivityLog.deleteMany({}),
      Task.deleteMany({}),
      Project.deleteMany({}),
      User.deleteMany({})
    ]);
  }

  const users = await User.create([
    {
      name: "Aarav Kapoor",
      email: "admin@taskflow.ai",
      password: demoPassword,
      role: "admin",
      jobTitle: "Founder & Product Lead",
      department: "Product",
      skills: ["Roadmaps", "Research", "Execution"],
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=aarav"
    },
    {
      name: "Maya Chen",
      email: "maya@taskflow.ai",
      password: demoPassword,
      role: "member",
      jobTitle: "Senior Designer",
      department: "Design",
      skills: ["UX", "Design Systems", "Motion"],
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=maya"
    },
    {
      name: "Noah Williams",
      email: "noah@taskflow.ai",
      password: demoPassword,
      role: "member",
      jobTitle: "Full-Stack Engineer",
      department: "Engineering",
      skills: ["React", "Node", "MongoDB"],
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=noah"
    },
    {
      name: "Sophia Rivera",
      email: "sophia@taskflow.ai",
      password: demoPassword,
      role: "member",
      jobTitle: "Growth Strategist",
      department: "Marketing",
      skills: ["Launches", "Analytics", "Messaging"],
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=sophia"
    }
  ]);

  const [admin, maya, noah, sophia] = users;

  const projects = await Project.create([
    {
      name: "Aurora Product Launch",
      description:
        "Coordinate launch assets, pricing validation, beta onboarding, and release readiness for the next TaskFlow AI tier.",
      owner: admin._id,
      members: [
        { user: admin._id, role: "owner" },
        { user: maya._id, role: "contributor" },
        { user: noah._id, role: "contributor" },
        { user: sophia._id, role: "contributor" }
      ],
      status: "active",
      priority: "urgent",
      dueDate: addDays(21),
      tags: ["launch", "growth", "beta"],
      color: "#22d3ee",
      progress: 42
    },
    {
      name: "Mobile Collaboration Suite",
      description:
        "Build a responsive collaboration experience with quick task capture, focus queues, and mobile-first team updates.",
      owner: admin._id,
      members: [
        { user: admin._id, role: "owner" },
        { user: maya._id, role: "contributor" },
        { user: noah._id, role: "contributor" }
      ],
      status: "planning",
      priority: "high",
      dueDate: addDays(45),
      tags: ["mobile", "collaboration"],
      color: "#34d399",
      progress: 18
    },
    {
      name: "Insights Automation",
      description:
        "Create executive-ready analytics surfaces for workload risk, overdue tasks, sprint momentum, and team capacity.",
      owner: admin._id,
      members: [
        { user: admin._id, role: "owner" },
        { user: noah._id, role: "contributor" },
        { user: sophia._id, role: "contributor" }
      ],
      status: "active",
      priority: "medium",
      dueDate: addDays(30),
      tags: ["analytics", "ai", "reporting"],
      color: "#f59e0b",
      progress: 64
    }
  ]);

  const [launch, mobile, insights] = projects;

  const tasks = await Task.create([
    {
      title: "Finalize launch narrative",
      description: "Lock the homepage story, primary CTA, and positioning pillars.",
      project: launch._id,
      assignee: sophia._id,
      createdBy: admin._id,
      status: "completed",
      priority: "high",
      dueDate: addDays(-2),
      completedAt: addDays(-3),
      labels: ["copy", "gtm"],
      subtasks: [
        { title: "Homepage headline", done: true },
        { title: "Pricing proof points", done: true }
      ],
      position: 1
    },
    {
      title: "Design animated onboarding",
      description: "Create the first-run flow for teams joining a fresh workspace.",
      project: launch._id,
      assignee: maya._id,
      createdBy: admin._id,
      status: "in-progress",
      priority: "urgent",
      dueDate: addDays(5),
      labels: ["design", "onboarding"],
      subtasks: [
        { title: "Welcome state", done: true },
        { title: "Invite teammates screen", done: false },
        { title: "Project template picker", done: false }
      ],
      position: 2
    },
    {
      title: "Harden JWT session handling",
      description: "Review token expiry, route guards, and API error states before launch.",
      project: launch._id,
      assignee: noah._id,
      createdBy: admin._id,
      status: "todo",
      priority: "high",
      dueDate: addDays(3),
      labels: ["security", "backend"],
      position: 3
    },
    {
      title: "Create mobile quick-add drawer",
      description: "Prototype quick task capture with assignee, due date, and priority controls.",
      project: mobile._id,
      assignee: noah._id,
      createdBy: admin._id,
      status: "in-progress",
      priority: "medium",
      dueDate: addDays(12),
      labels: ["mobile", "react"],
      position: 1
    },
    {
      title: "Map responsive navigation states",
      description: "Define tablet and mobile navigation behavior for focus work.",
      project: mobile._id,
      assignee: maya._id,
      createdBy: admin._id,
      status: "todo",
      priority: "medium",
      dueDate: addDays(9),
      labels: ["ux", "navigation"],
      position: 2
    },
    {
      title: "Ship overdue risk widget",
      description: "Surface overdue, due-soon, and blocked work in one executive card.",
      project: insights._id,
      assignee: noah._id,
      createdBy: admin._id,
      status: "completed",
      priority: "high",
      dueDate: addDays(-1),
      completedAt: addDays(-1),
      labels: ["analytics", "dashboard"],
      position: 1
    },
    {
      title: "Prepare stakeholder weekly report",
      description: "Build an activity digest with project movement and individual ownership.",
      project: insights._id,
      assignee: sophia._id,
      createdBy: admin._id,
      status: "todo",
      priority: "low",
      dueDate: addDays(-4),
      labels: ["reporting"],
      position: 2
    }
  ]);

  await Project.bulkWrite(
    projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.project.toString() === project._id.toString());
      const complete = projectTasks.filter((task) => task.status === "completed").length;
      const progress = projectTasks.length ? Math.round((complete / projectTasks.length) * 100) : 0;

      return {
        updateOne: {
          filter: { _id: project._id },
          update: { progress }
        }
      };
    })
  );

  await ActivityLog.create([
    {
      actor: admin._id,
      action: "created Aurora Product Launch",
      entityType: "project",
      entityId: launch._id,
      project: launch._id
    },
    {
      actor: maya._id,
      action: "moved Design animated onboarding to in progress",
      entityType: "task",
      entityId: tasks[1]._id,
      project: launch._id,
      task: tasks[1]._id
    },
    {
      actor: noah._id,
      action: "completed Ship overdue risk widget",
      entityType: "task",
      entityId: tasks[5]._id,
      project: insights._id,
      task: tasks[5]._id
    },
    {
      actor: sophia._id,
      action: "joined stakeholder reporting workflow",
      entityType: "task",
      entityId: tasks[6]._id,
      project: insights._id,
      task: tasks[6]._id
    }
  ]);

  return {
    skipped: false,
    users: users.length,
    projects: projects.length,
    tasks: tasks.length
  };
};
