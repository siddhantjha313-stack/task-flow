import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { logActivity } from "../utils/activity.js";

const authPayload = (user) => ({
  token: signToken(user._id),
  user
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const userCount = await User.countDocuments();
  const user = await User.create({
    name,
    email,
    password,
    role: userCount === 0 ? "admin" : "member",
    avatar: `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(email)}`
  });

  await logActivity({
    actor: user._id,
    action: "joined TaskFlow AI",
    entityType: "auth",
    entityId: user._id
  });

  sendResponse(res, 201, authPayload(user), "Account created");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "This account is not active");
  }

  user.lastActiveAt = new Date();
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id);

  await logActivity({
    actor: user._id,
    action: "signed in",
    entityType: "auth",
    entityId: user._id
  });

  sendResponse(res, 200, authPayload(safeUser), "Welcome back");
});

export const getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, { user: req.user }, "Current user");
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "jobTitle", "department", "avatar", "preferences"];
  const updates = {};

  allowed.forEach((field) => {
    if (req.validated.body[field] !== undefined) updates[field] = req.validated.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  await logActivity({
    actor: req.user._id,
    action: "updated profile settings",
    entityType: "user",
    entityId: req.user._id
  });

  sendResponse(res, 200, { user }, "Profile updated");
});
