import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
    color: { type: String, default: "#3b82f6" }
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);

