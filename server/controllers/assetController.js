import Asset from "../models/assetModel.js";
import AssetLog from "../models/assetLogModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Admin or SuperAdmin
const createAsset = asyncHandler(async (req, res) => {
  const { name, category, serialNumber, specifications } = req.body;

  const assetExists = await Asset.findOne({ serialNumber });
  if (assetExists) {
    res.status(400);
    throw new Error("Asset with this serial number already exists");
  }

  const asset = await Asset.create({
    name,
    category,
    serialNumber,
    specifications,
  });

  await AssetLog.create({
    asset: asset._id,
    action: 'created',
    performedBy: req.user._id,
    note: 'Asset created',
  });

  res.status(201).json(asset);
});

// @desc    Get all assets
// @route   GET /api/assets
// @access  Admin or SuperAdmin
const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find().populate("assignedTo", "name email");
  res.json(assets);
});

// @desc    Get single asset by ID
// @route   GET /api/assets/:id
// @access  Admin or SuperSuperAdmin
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("assignedTo", "name email");
  if (asset) {
    res.json(asset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Update asset by ID
// @route   PUT /api/assets/:id
// @access  Admin or SuperAdmin
const updateAssetById = asyncHandler(async (req, res) => {
  const { name, category, serialNumber, specifications, status } = req.body;
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    asset.name = name || asset.name;
    asset.category = category || asset.category;
    asset.serialNumber = serialNumber || asset.serialNumber;
    asset.specifications = specifications || asset.specifications;
    asset.status = status || asset.status;

    const updated = await asset.save();

    await AssetLog.create({
      asset: asset._id,
      action: 'updated',
      performedBy: req.user._id,
      note: 'Asset updated',
    });

    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Delete asset by ID
// @route   DELETE /api/assets/:id
// @access  Admin or SuperAdmin
const deleteAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    await AssetLog.create({
      asset: asset._id,
      action: 'deleted',
      performedBy: req.user._id,
      note: 'Asset deleted',
    });

    await asset.deleteOne();
    res.json({ message: "Asset deleted" });
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Assign asset to user
// @route   PUT /api/assets/:id/assign
// @access  Admin or SuperAdmin
const assignAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  const { userId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }
  if (asset.status === "assigned") {
    res.status(400);
    throw new Error("Asset is already assigned");
  }

  asset.assignedTo = userId;
  asset.assignedBy = req.user._id;
  asset.assignedDate = new Date();
  asset.status = "assigned";

  const updated = await asset.save();

  await AssetLog.create({
    asset: asset._id,
    action: "assigned",
    performedBy: req.user._id,
    targetUser: userId,
    assignedDate: asset.assignedDate,
    note: `Asset assigned to ${user.name}`,
  });

  res.json(updated);
});

// @desc    Mark asset as returned
// @route   PUT /api/assets/:id/return
// @access  Admin or SuperAdmin
const returnAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  const returnDate = new Date();
  const assignedDate = asset.assignedDate || returnDate;
  const msInDay = 1000 * 60 * 60 * 24;
  const duration = Math.round((returnDate - assignedDate) / msInDay);

  await AssetLog.create({
    asset: asset._id,
    action: "returned",
    performedBy: req.user._id,
    targetUser: asset.assignedTo,
    assignedDate,
    returnedDate: returnDate,
    duration,
    note: "Asset returned",
  });

  asset.status = "available";
  asset.returnedDate = returnDate;
  asset.assignedTo = null;
  asset.assignedBy = null;
  asset.assignedDate = null;

  const updated = await asset.save();
  res.json(updated);
});

// @desc    Get all assets assigned to a user
// @route   GET /api/assets/user/:userId
// @access  Admin or the user
const getAssetsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.role === 'user' && req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error("Not authorized to view other users' assets");
  }

  const assets = await Asset.find({ assignedTo: userId });
  res.json(assets);
});

// @desc    Get logs for a specific asset
// @route   GET /api/assets/:id/logs
// @access  Admin or SuperAdmin
const getAssetLogsByAssetId = asyncHandler(async (req, res) => {
  const logs = await AssetLog.find({ asset: req.params.id })
    .populate("performedBy", "name email")
    .populate("targetUser", "name email")
    .sort({ date: -1 });

  res.json(logs);
});

// @desc    Request an asset
// @route   POST /api/assets/request
// @access  Private
const requestAsset = asyncHandler(async (req, res) => {
  const { assetType, reason } = req.body;

  if (!assetType) {
    res.status(400);
    throw new Error("Asset type is required");
  }

  const newRequest = await Request.create({
    user: req.user._id,
    assetType,
    reason,
  });

  res.status(201).json({ message: "Asset request submitted", request: newRequest });
});

// @desc    Get all asset requests
// @route   GET /api/assets/requests
// @access  Admin or SuperAdmin
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find()
    .populate("user", "name email")
    .populate("handledBy", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Update request status (approve/reject)
// @route   PUT /api/assets/requests/:id
// @access  Admin or SuperAdmin
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, responseNote } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  request.status = status;
  request.responseNote = responseNote || "";
  request.handledBy = req.user._id;

  const updated = await request.save();
  res.json(updated);
});

// @desc    Get requests by current user
// @route   GET /api/assets/myrequests
// @access  Private
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
});

export {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAssetById,
  deleteAssetById,
  assignAsset,
  returnAsset,
  getAssetsByUser,
  getAssetLogsByAssetId,
  requestAsset,
  getAllRequests,
  updateRequestStatus,
  getMyRequests,
};
