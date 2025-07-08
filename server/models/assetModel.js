import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Dell XPS 15
    type: { type: String, required: true }, // e.g., Laptop, Phone
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
    specifications: { type: String }, // optional details like RAM, storage
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
