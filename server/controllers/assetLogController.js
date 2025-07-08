import AssetLog from "../models/assetLogModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all asset logs
// @route   GET /api/asset-logs
// @access  Admin or SuperAdmin
const getAllAssetLogs = asyncHandler(async (req, res) => {
  const logs = await AssetLog.find()
    .populate('asset', 'name serialNumber')
    .populate('performedBy', 'name email')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 });

  res.json(logs);
});

export { getAllAssetLogs };
