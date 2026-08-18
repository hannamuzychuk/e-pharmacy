const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["owner", "user"],
      default: "owner",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = model("User", userSchema);

module.exports = User;
