// controllers/assetLogController.js
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
    .populate('asset', 'name serialNumber category')
    .populate('performedBy', 'name email')
    .populate('targetUser', 'name email')
    .sort({ date: -1 });

  res.json(logs);
});




// @desc    Create an asset log
// @route   POST /api/asset-logs
// @access  Admin or SuperAdmin
const createAssetLog = asyncHandler(async (req, res) => {
  const {
    asset,
    action,
    performedBy,
    targetUser,
    assignedDate,
    returnedDate,
    duration,
    maintenanceCost,
    note,
  } = req.body;

  const log = new AssetLog({
    asset,
    action,
    performedBy,
    targetUser: targetUser || null,
    assignedDate: assignedDate || null,
    returnedDate: returnedDate || null,
    duration: duration || null,
    maintenanceCost: maintenanceCost || null,
    note: note || "",
  });

  const createdLog = await log.save();
  res.status(201).json(createdLog);
});

// @desc    Delete an asset log
// @route   DELETE /api/asset-logs/:id
// @access  Admin or SuperAdmin
const deleteAssetLog = asyncHandler(async (req, res) => {
  const log = await AssetLog.findById(req.params.id);

  if (!log) {
    res.status(404);
    throw new Error("Asset log not found");
  }

  await log.deleteOne();
  res.json({ message: "Asset log removed" });
});

export {
  getAllAssetLogs,
  getLogsByAssetId,
  createAssetLog,
  deleteAssetLog
};
