import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { recalculateProjectProgress } from "./projectController.js";

const taskPopulation = [
  { path: "assignee", select: "name email avatar role jobTitle" },
  { path: "createdBy", select: "name email avatar" },
  { path: "project", select: "name color status dueDate" },
  { path: "comments.user", select: "name avatar email" }
];

const accessibleTaskFilter = async (req) => {
  const filter = {};

  if (req.query.project) filter.project = req.query.project;
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  if (req.query.assignee && req.query.assignee !== "all") filter.assignee = req.query.assignee;
  if (req.query.search) filter.$text = { $search: req.query.search };

  if (req.user.role === "member") {
    filter.assignee = req.user._id;
  }

  return filter;
};

export const getTasks = asyncHandler(async (req, res) => {
  const filter = await accessibleTaskFilter(req);
  const tasks = await Task.find(filter)
    .populate(taskPopulation)
    .sort({ status: 1, position: 1, dueDate: 1 });

  sendResponse(res, 200, { tasks }, "Tasks loaded");
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(taskPopulation);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role === "member" && task.assignee._id.toString() !== req.user.id) {
    throw new ApiError(403, "You can only view tasks assigned to you");
  }

  sendResponse(res, 200, { task }, "Task loaded");
});

export const createTask = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const project = await Project.findById(payload.project);

  if (!project || project.archived) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.create({
    ...payload,
    createdBy: req.user._id,
    completedAt: payload.status === "completed" ? new Date() : undefined
  });

  await recalculateProjectProgress(task.project);

  await logActivity({
    actor: req.user._id,
    action: `created task ${task.title}`,
    entityType: "task",
    entityId: task._id,
    project: task.project,
    task: task._id,
    metadata: { assignee: task.assignee.toString(), priority: task.priority }
  });

  const populated = await Task.findById(task._id).populate(taskPopulation);
  sendResponse(res, 201, { task: populated }, "Task created");
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role === "member" && task.assignee.toString() !== req.user.id) {
    throw new ApiError(403, "You can only update tasks assigned to you");
  }

  const requested = { ...req.validated.body };

  if (req.user.role === "member") {
    const allowedMemberFields = ["status", "subtasks"];
    Object.keys(requested).forEach((field) => {
      if (!allowedMemberFields.includes(field)) delete requested[field];
    });
  }

  const previousStatus = task.status;
  Object.assign(task, requested);

  if (requested.status === "completed" && previousStatus !== "completed") {
    task.completedAt = new Date();
  }

  if (requested.status && requested.status !== "completed") {
    task.completedAt = undefined;
  }

  await task.save();
  await recalculateProjectProgress(task.project);

  await logActivity({
    actor: req.user._id,
    action:
      previousStatus !== task.status
        ? `moved ${task.title} to ${task.status.replace("-", " ")}`
        : `updated task ${task.title}`,
    entityType: "task",
    entityId: task._id,
    project: task.project,
    task: task._id,
    metadata: { previousStatus, status: task.status }
  });

  const populated = await Task.findById(task._id).populate(taskPopulation);
  sendResponse(res, 200, { task: populated }, "Task updated");
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await recalculateProjectProgress(task.project);

  await logActivity({
    actor: req.user._id,
    action: `deleted task ${task.title}`,
    entityType: "task",
    entityId: task._id,
    project: task.project,
    task: task._id
  });

  sendResponse(res, 200, { task }, "Task deleted");
});

export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role === "member" && task.assignee.toString() !== req.user.id) {
    throw new ApiError(403, "You can only comment on tasks assigned to you");
  }

  task.comments.push({
    user: req.user._id,
    message: req.validated.body.message
  });

  await task.save();

  await logActivity({
    actor: req.user._id,
    action: `commented on ${task.title}`,
    entityType: "comment",
    entityId: task._id,
    project: task.project,
    task: task._id
  });

  const populated = await Task.findById(task._id).populate(taskPopulation);
  sendResponse(res, 201, { task: populated }, "Comment added");
});
