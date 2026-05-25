import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["owner", "manager", "contributor", "viewer"],
      default: "contributor"
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: ""
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed"],
      default: "planning"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: {
      type: [memberSchema],
      default: []
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, "Project due date is required"]
    },
    tags: {
      type: [String],
      default: []
    },
    color: {
      type: String,
      default: "#22d3ee"
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    archived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

projectSchema.index({ name: "text", description: "text", tags: "text" });
projectSchema.index({ owner: 1, dueDate: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
