import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Account already exists with this email."],
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required() {
        return !this.githubId;
      },
      select: false,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    githubUsername: {
      type: String,
      trim: true,
      default: "",
    },
    githubAvatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    githubAccessToken: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["MANAGER", "EMPLOYEE"],
      default: "MANAGER",
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    work: {
      type: String,
      trim: true,
      default: "",
    },
    employmentStartsAt: {
      type: Date,
      default: null,
    },
    employmentEndsAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.githubAccessToken;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.githubAccessToken;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.index({ employmentEndsAt: 1 }, { expireAfterSeconds: 0 });

const Users = mongoose.model("User", userSchema, "users");

export { Users };
export default Users;
