import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name_required"],
    },
    amount: {
      type: Number,
      required: [true, "amount_required"],
    },
    code: {
      type: Number,
      required: [true, "code_required"],
    },
    grid: { type: Number, required: [true, "grid_required"] },
    gridData: {
      type: String,
      required: [true, "gridData_required"],
    },
    version: {
        type: Number,
        default: 1,
    },
    creator: { type: String, required: [true, "creator_required"] },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("payments", paymentSchema);
