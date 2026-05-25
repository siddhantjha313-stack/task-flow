import crypto from "node:crypto";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";

export const getTeam = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ role: 1, name: 1 });
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const [assigned, completed, overdue] = await Promise.all([
        Task.countDocuments({ assignee: user._id }),
        Task.countDocuments({ assignee: user._id, status: "completed" }),
        Task.countDocuments({
          assignee: user._id,
          status: { $ne: "completed" },
          dueDate: { $lt: new Date() }
        })
      ]);

      return {
        ...user.toJSON(),
        stats: {
          assigned,
          completed,
          overdue,
          completionRate: assigned ? Math.round((completed / assigned) * 100) : 0
        }
      };
    })
  );

  sendResponse(res, 200, { users: usersWithStats }, "Team members loaded");
});

export const inviteUser = asyncHandler(async (req, res) => {
  const { name, email, role, jobTitle, department } = req.validated.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const temporaryPassword = `${crypto.randomBytes(5).toString("hex")}Aa1!`;
  const user = await User.create({
    name,
    email,
    role,
    jobTitle,
    department,
    password: temporaryPassword,
    status: "active",
    invitedBy: req.user._id,
    avatar: `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(email)}`
  });

  await logActivity({
    actor: req.user._id,
    action: `invited ${user.name}`,
    entityType: "user",
    entityId: user._id,
    metadata: { role: user.role }
  });

  sendResponse(res, 201, { user, temporaryPassword }, "Team member invited");
});

export const updateUserRole = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id && req.validated.body.role !== "admin") {
    throw new ApiError(400, "Admins cannot demote themselves");
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.validated.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await logActivity({
    actor: req.user._id,
    action: `updated ${user.name}'s access`,
    entityType: "user",
    entityId: user._id,
    metadata: { role: user.role, status: user.status }
  });

  sendResponse(res, 200, { user }, "User access updated");
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, "You cannot remove your own account");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "inactive" },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await logActivity({
    actor: req.user._id,
    action: `deactivated ${user.name}`,
    entityType: "user",
    entityId: user._id
  });

  sendResponse(res, 200, { user }, "User deactivated");
});
