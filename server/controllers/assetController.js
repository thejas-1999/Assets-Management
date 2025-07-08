import Asset from "../models/assetModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Admin or SuperAdmin
const createAsset = asyncHandler(async (req, res) => {
  const { name, type, serialNumber, specifications } = req.body;

  const assetExists = await Asset.findOne({ serialNumber });
  if (assetExists) {
    res.status(400);
    throw new Error("Asset with this serial number already exists");
  }

  const asset = await Asset.create({
    name,
    type,
    serialNumber,
    specifications,
  });

  res.status(201).json(asset);
});

// @desc    Get all assets
// @route   GET /api/assets
// @access  Admin or SuperAdmin
const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({}).populate("assignedTo", "name email");
  res.json(assets);
});

// @desc    Get single asset by ID
// @route   GET /api/assets/:id
// @access  Admin or SuperAdmin
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
  const { name, type, serialNumber, specifications, status } = req.body;

  const asset = await Asset.findById(req.params.id);

  if (asset) {
    asset.name = name || asset.name;
    asset.type = type || asset.type;
    asset.serialNumber = serialNumber || asset.serialNumber;
    asset.specifications = specifications || asset.specifications;
    asset.status = status || asset.status;

    const updated = await asset.save();
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
    await asset.remove();
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

  asset.status = "available";
  asset.returnedDate = new Date();
  asset.assignedTo = null;
  asset.assignedBy = null;
  asset.assignedDate = null;

  const updated = await asset.save();
  res.json(updated);
});

// @desc    Get all assets assigned to a user
// @route   GET /api/assets/user/:userId
// @access  Admin or SuperAdmin or the user himself
const getAssetsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.role === 'user' && req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error("Not authorized to view other users' assets");
  }

  const assets = await Asset.find({ assignedTo: userId });
  res.json(assets);
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
};
