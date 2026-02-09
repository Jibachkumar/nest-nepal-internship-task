import mongoose, { Schema } from "mongoose";

const saleSchema = new Schema(
  {
   agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountSold: {
      type: Number,
      required: true,
      min: 1,
    },
    salesCount: {
      type: Number,
      min: 1,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Sale = mongoose.model("Sale", saleSchema );