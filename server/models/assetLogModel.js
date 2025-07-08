import mongoose from "mongoose";

const assetLogSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    action: {
      type: String,
      enum: ['assigned', 'returned', 'created', 'updated', 'deleted'],
      required: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for assignment
    note: { type: String },
    date: { type: Date, default: Date.now },
  }
);

const AssetLog = mongoose.model("AssetLog", assetLogSchema);
export default AssetLog;
