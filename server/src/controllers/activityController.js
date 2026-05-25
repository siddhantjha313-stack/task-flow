import ActivityLog from "../models/ActivityLog.js";
import Project from "../models/Project.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const filter = {};

  if (req.user.role === "member") {
    const projects = await Project.find({
      archived: false,
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }]
    }).select("_id");

    filter.$or = [
      { actor: req.user._id },
      { project: { $in: projects.map((project) => project._id) } }
    ];
  }

  const activity = await ActivityLog.find(filter)
    .populate("actor", "name avatar email role")
    .populate("project", "name color")
    .populate("task", "title status priority")
    .sort({ createdAt: -1 })
    .limit(limit);

  sendResponse(res, 200, { activity }, "Activity loaded");
});
