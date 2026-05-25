import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async ({
  actor,
  action,
  entityType,
  entityId,
  project,
  task,
  metadata = {}
}) => {
  if (!actor) return null;

  return ActivityLog.create({
    actor,
    action,
    entityType,
    entityId,
    project,
    task,
    metadata
  });
};
