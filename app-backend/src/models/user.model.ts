import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "first_name_required"],
      unique: true,
    },
    password: { type: String, required: [true, "password_required"] },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("users", userSchema);
