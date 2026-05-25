import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    preferences: {
      theme: { type: String, default: "light" },
      notifications: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

