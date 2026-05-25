import Project from "../models/Project.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loadProject = asyncHandler(async (req, _res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.project;
  const project = await Project.findById(projectId);

  if (!project || project.archived) {
    throw new ApiError(404, "Project not found");
  }

  req.project = project;
  next();
});

export const ensureProjectAccess = (adminOnly = false) =>
  asyncHandler(async (req, _res, next) => {
    if (req.user.role === "admin") return next();

    const project = req.project;
    const isMember = project.members.some((member) => member.user.toString() === req.user.id);

    if (!isMember || adminOnly) {
      throw new ApiError(403, "You do not have access to this project");
    }

    next();
  });
