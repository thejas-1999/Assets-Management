import mongoose from "mongoose";

const assetLogSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    action: {
      type: String,
      enum: [
        'assigned',
        'returned',
        'created',
        'updated',
        'deleted',
        'maintenance_started',  // add this
        'maintenance_completed' // and this
      ],
      required: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedDate: { type: Date },
    returnedDate: { type: Date },
    duration: { type: Number }, // in days
    maintenanceCost: { type: Number }, // if applicable
    note: { type: String },
    date: { type: Date, default: Date.now },
  }
);

const AssetLog = mongoose.model("AssetLog", assetLogSchema);
export default AssetLog;



