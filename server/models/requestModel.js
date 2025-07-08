import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assetType: { type: String, required: true }, // e.g., Laptop, Phone
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reason: { type: String }, // optional reason for request
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin
    responseNote: { type: String },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
