import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member"
    },
    avatar: {
      type: String,
      default: ""
    },
    jobTitle: {
      type: String,
      default: "Product Collaborator"
    },
    department: {
      type: String,
      default: "Operations"
    },
    status: {
      type: String,
      enum: ["active", "invited", "inactive"],
      default: "active"
    },
    skills: {
      type: [String],
      default: []
    },
    preferences: {
      theme: {
        type: String,
        enum: ["dark", "light"],
        default: "dark"
      },
      notifications: {
        type: Boolean,
        default: true
      }
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
