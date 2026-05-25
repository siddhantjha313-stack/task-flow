import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ["project", "task", "user"], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model("ActivityLog", activitySchema);

