import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Dell XPS 15
    category: {
      type: String,
      enum: ['Laptop', 'Mouse', 'Keyboard', 'Mobile Phone', 'Monitor', 'Tablet', 'Other'],
      required: true,
    },
    serialNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['available', 'assigned', 'in-repair', 'retired'],
      default: 'available',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedDate: { type: Date },
    returnedDate: { type: Date },
    specifications: { type: String },
  },
  {
    timestamps: true,
  }
);


const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
