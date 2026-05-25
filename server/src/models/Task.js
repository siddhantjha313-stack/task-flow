import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 2,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    dueDate: {
      type: Date,
      required: [true, "Task due date is required"]
    },
    completedAt: {
      type: Date
    },
    labels: {
      type: [String],
      default: []
    },
    subtasks: {
      type: [subtaskSchema],
      default: []
    },
    comments: {
      type: [commentSchema],
      default: []
    },
    position: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

taskSchema.index({ title: "text", description: "text", labels: "text" });
taskSchema.index({ project: 1, status: 1, position: 1 });
taskSchema.index({ assignee: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
