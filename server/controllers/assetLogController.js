import AssetLog from "../models/assetLogModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all asset logs
// @route   GET /api/asset-logs
// @access  Admin or SuperAdmin
const getAllAssetLogs = asyncHandler(async (req, res) => {
  const logs = await AssetLog.find()
    .populate('asset', 'name serialNumber category')
    .populate('performedBy', 'name email')
    .populate('targetUser', 'name email')
    .sort({ date: -1 });

  res.json(logs);
});

// @desc    Get logs for a specific asset
// @route   GET /api/asset-logs/:assetId
// @access  Admin or SuperAdmin
const getLogsByAssetId = asyncHandler(async (req, res) => {
  const logs = await AssetLog.find({ asset: req.params.assetId })
    .populate('performedBy', 'name email')
    .populate('targetUser', 'name email')
    .sort({ date: -1 });

  res.json(logs);
});

export { getAllAssetLogs, getLogsByAssetId };
