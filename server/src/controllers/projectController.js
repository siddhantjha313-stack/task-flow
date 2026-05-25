import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";

const projectPopulation = [
  { path: "owner", select: "name email avatar role jobTitle" },
  { path: "members.user", select: "name email avatar role jobTitle" }
];

const accessibleProjectFilter = (user) => {
  if (user.role === "admin") return { archived: false };

  return {
    archived: false,
    $or: [{ owner: user._id }, { "members.user": user._id }]
  };
};

export const recalculateProjectProgress = async (projectId) => {
  const [total, completed] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: "completed" })
  ]);

  const progress = total ? Math.round((completed / total) * 100) : 0;
  const update = { progress };
  if (progress === 100 && total > 0) update.status = "completed";
  await Project.findByIdAndUpdate(projectId, update);

  return progress;
};

const appendProjectStats = async (project) => {
  const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
    Task.countDocuments({ project: project._id }),
    Task.countDocuments({ project: project._id, status: "completed" }),
    Task.countDocuments({
      project: project._id,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() }
    })
  ]);

  return {
    ...project.toJSON(),
    taskStats: {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      overdue: overdueTasks
    }
  };
};

export const getProjects = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const filter = accessibleProjectFilter(req.user);

  if (status && status !== "all") filter.status = status;
  if (search) filter.$text = { $search: search };

  const projects = await Project.find(filter)
    .populate(projectPopulation)
    .sort({ updatedAt: -1 });

  const enriched = await Promise.all(projects.map(appendProjectStats));
  sendResponse(res, 200, { projects: enriched }, "Projects loaded");
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    ...accessibleProjectFilter(req.user)
  }).populate(projectPopulation);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const taskFilter =
    req.user.role === "admin"
      ? { project: project._id }
      : { project: project._id, assignee: req.user._id };

  const tasks = await Task.find(taskFilter)
    .populate("assignee", "name email avatar role jobTitle")
    .populate("createdBy", "name email avatar")
    .sort({ status: 1, position: 1, dueDate: 1 });

  sendResponse(
    res,
    200,
    {
      project: await appendProjectStats(project),
      tasks
    },
    "Project loaded"
  );
});

export const createProject = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const uniqueMembers = [...new Set([req.user.id, ...(payload.members || [])])];
  const members = uniqueMembers.map((userId) => ({
    user: userId,
    role: userId === req.user.id ? "owner" : "contributor"
  }));

  const project = await Project.create({
    ...payload,
    owner: req.user._id,
    members
  });

  await logActivity({
    actor: req.user._id,
    action: `created project ${project.name}`,
    entityType: "project",
    entityId: project._id,
    project: project._id
  });

  const populated = await Project.findById(project._id).populate(projectPopulation);
  sendResponse(res, 201, { project: await appendProjectStats(populated) }, "Project created");
});

export const updateProject = asyncHandler(async (req, res) => {
  const payload = { ...req.validated.body };

  if (payload.members) {
    const uniqueMembers = [...new Set([req.user.id, ...payload.members])];
    payload.members = uniqueMembers.map((userId) => ({
      user: userId,
      role: userId === req.user.id ? "owner" : "contributor"
    }));
  }

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, archived: false },
    payload,
    { new: true, runValidators: true }
  ).populate(projectPopulation);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await logActivity({
    actor: req.user._id,
    action: `updated project ${project.name}`,
    entityType: "project",
    entityId: project._id,
    project: project._id
  });

  sendResponse(res, 200, { project: await appendProjectStats(project) }, "Project updated");
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, archived: false },
    { archived: true },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await logActivity({
    actor: req.user._id,
    action: `archived project ${project.name}`,
    entityType: "project",
    entityId: project._id,
    project: project._id
  });

  sendResponse(res, 200, { project }, "Project archived");
});

export const getDashboard = asyncHandler(async (req, res) => {
  const projectFilter = accessibleProjectFilter(req.user);
  const projects = await Project.find(projectFilter).select("_id name progress dueDate status color");
  const projectIds = projects.map((project) => project._id);
  const taskFilter =
    req.user.role === "admin"
      ? { project: { $in: projectIds } }
      : { assignee: req.user._id, project: { $in: projectIds } };

  const today = new Date();
  const [totalTasks, completedTasks, overdueTasks, recentTasks, team] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "completed" }),
    Task.countDocuments({ ...taskFilter, status: { $ne: "completed" }, dueDate: { $lt: today } }),
    Task.find(taskFilter)
      .populate("assignee", "name avatar email")
      .populate("project", "name color")
      .sort({ updatedAt: -1 })
      .limit(8),
    User.find({ status: "active" }).select("name email avatar role jobTitle lastActiveAt")
  ]);

  const now = new Date();
  const productivity = await Promise.all(
    Array.from({ length: 7 }).map(async (_item, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const completed = await Task.countDocuments({
        ...taskFilter,
        status: "completed",
        completedAt: { $gte: date, $lte: end }
      });

      const created = await Task.countDocuments({
        ...taskFilter,
        createdAt: { $gte: date, $lte: end }
      });

      return {
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed,
        created
      };
    })
  );

  const teamProgress = await Promise.all(
    team.slice(0, 8).map(async (user) => {
      const [assigned, completed] = await Promise.all([
        Task.countDocuments({ assignee: user._id, project: { $in: projectIds } }),
        Task.countDocuments({ assignee: user._id, project: { $in: projectIds }, status: "completed" })
      ]);

      return {
        ...user.toJSON(),
        assigned,
        completed,
        progress: assigned ? Math.round((completed / assigned) * 100) : 0
      };
    })
  );

  sendResponse(
    res,
    200,
    {
      metrics: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        overdueTasks,
        completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      productivity,
      projects,
      recentTasks,
      teamProgress
    },
    "Dashboard loaded"
  );
});
