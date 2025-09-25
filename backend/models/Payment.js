import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    sessionId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" }, // pending, succeeded, failed
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
