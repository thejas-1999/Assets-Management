import Asset from "../models/assetModel.js";
import AssetLog from "../models/assetLogModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import Setting from '../models/settingModel.js';
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Create a new asset
 * @route   POST /api/assets
 * @access  Admin or SuperAdmin
 */
const createAsset = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    serialNumbers,
    specifications,
    purchaseDate,
    purchaseValue,
    quantity,
    hasWarranty,
    warrantyStartDate,
    warrantyEndDate
  } = req.body;

  // Validate quantity matches number of serials
  if (!Array.isArray(serialNumbers) || serialNumbers.length !== quantity) {
    res.status(400);
    throw new Error("Quantity must match the number of serial numbers provided");
  }

  // Check duplicates in DB
  const existing = await Asset.findOne({ serialNumbers: { $in: serialNumbers } });
  if (existing) {
    res.status(400);
    throw new Error("One or more serial numbers already exist in another asset");
  }

  // Hardcoded asset categories (temporary)
  const allowedCategories = ["Laptop", "Monitor", "Printer", "Phone"];
  if (!allowedCategories.includes(category)) {
    res.status(400);
    throw new Error(`Invalid category. Allowed: ${allowedCategories.join(", ")}`);
  }

  // Warranty validation
  let warrantyData = { hasWarranty: false };
  if (hasWarranty) {
    if (!warrantyStartDate || !warrantyEndDate) {
      res.status(400);
      throw new Error("Warranty start and end dates are required when warranty exists");
    }
    warrantyData = {
      hasWarranty: true,
      warrantyStartDate,
      warrantyEndDate
    };
  }

  // Create an asset document for each serial number with quantity = 1
  const createdAssets = [];

  for (const serial of serialNumbers) {
    const asset = await Asset.create({
      name,
      category,
      serialNumbers: [serial], // single serial number per asset
      specifications,
      purchaseDate,
      purchaseValue,
      quantity: 1, // quantity always 1 per asset
      ...warrantyData
    });

    // Log asset creation
    await AssetLog.create({
      asset: asset._id,
      action: 'created',
      performedBy: req.user._id,
      note: `Asset created: ${name} with serial ${serial}`
    });

    createdAssets.push(asset);
  }

  res.status(201).json(createdAssets); // return array of created assets
});





/**
 * @desc    Get all assets
 * @route   GET /api/assets
 * @access  Admin or SuperAdmin
 */
const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find().populate("assignedTo", "name email");
  res.json(assets);
});

/**
 * @desc    Get single asset by ID
 * @route   GET /api/assets/:id
 * @access  Admin or SuperAdmin
 */
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("assignedTo", "name email");
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }
  res.json(asset);
});

/**
 * @desc    Update asset by ID
 * @route   PUT /api/assets/:id
 * @access  Admin or SuperAdmin
 */
const updateAssetById = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    serialNumbers,
    specifications,
    status,
    hasWarranty,
    warrantyStartDate,
    warrantyEndDate
  } = req.body;

  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  // If category is updated, validate
  if (category) {
    const settings = await Setting.findOne();
    if (!settings || !settings.assetTypes.includes(category)) {
      res.status(400);
      throw new Error("Invalid category. Please select from available asset types in settings.");
    }
    asset.category = category;
  }

  if (serialNumbers) {
    if (!Array.isArray(serialNumbers) || serialNumbers.length !== asset.quantity) {
      res.status(400);
      throw new Error("Quantity must match number of serial numbers provided");
    }
    const existing = await Asset.findOne({
      _id: { $ne: asset._id },
      serialNumbers: { $in: serialNumbers }
    });
    if (existing) {
      res.status(400);
      throw new Error("One or more serial numbers already exist in another asset");
    }
    asset.serialNumbers = serialNumbers;
  }

  asset.name = name || asset.name;
  asset.specifications = specifications || asset.specifications;
  asset.status = status || asset.status;

  if (hasWarranty !== undefined) {
    asset.hasWarranty = hasWarranty;
    if (hasWarranty) {
      if (!warrantyStartDate || !warrantyEndDate) {
        res.status(400);
        throw new Error("Warranty start and end dates are required when warranty exists");
      }
      asset.warrantyStartDate = warrantyStartDate;
      asset.warrantyEndDate = warrantyEndDate;
    } else {
      asset.warrantyStartDate = null;
      asset.warrantyEndDate = null;
    }
  }

  const updated = await asset.save();

  await AssetLog.create({
    asset: asset._id,
    action: 'updated',
    performedBy: req.user._id,
    note: 'Asset updated'
  });

  res.json(updated);
});

/**
 * @desc    Delete asset by ID
 * @route   DELETE /api/assets/:id
 * @access  Admin or SuperAdmin
 */
const deleteAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  await AssetLog.create({
    asset: asset._id,
    action: 'deleted',
    performedBy: req.user._id,
    note: 'Asset deleted'
  });

  await asset.deleteOne();
  res.json({ message: "Asset deleted" });
});

// @desc    Assign asset to user
// @route   PUT /api/assets/:id/assign
// @access  Admin or SuperAdmin
const assignAsset = asyncHandler(async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    const { userId } = req.body;

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (asset.status === "assigned") {
      return res.status(400).json({ message: "Asset is already assigned" });
    }

    // Prevent assigning if asset is under maintenance
    if (asset.status === "maintenance") {
      return res.status(400).json({ message: "Asset is currently under maintenance and cannot be assigned" });
    }

    const now = new Date();

    asset.assignedTo = userId;
    asset.assignedBy = req.user._id;
    asset.assignedDate = now;
    asset.returnedDate = null;
    asset.status = "assigned";

    // Add usage history entry
    asset.usageHistory.push({
      user: userId,
      assignedDate: now,
      returnedDate: null,
      daysUsed: null
    });

    const updated = await asset.save();

    await AssetLog.create({
      asset: asset._id,
      action: "assigned",
      performedBy: req.user._id,
      targetUser: userId,
      assignedDate: now,
      note: `Asset assigned to ${user.name}`,
    });

    res.json(updated);
  } catch (error) {
    console.error("Asset assignment failed:", error);
    res.status(500).json({ message: error.message });
  }
});




const startMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params; // asset ID
  const { description } = req.body; // optional description of maintenance

  const asset = await Asset.findById(id);
  if (!asset) {
    return res.status(404).json({ message: "Asset not found" });
  }

  if (asset.status === "maintenance") {
    return res.status(400).json({ message: "Asset is already under maintenance" });
  }

  if (asset.status === "assigned") {
    // If assigned, optionally force return or block
    // For now, let's block
    return res.status(400).json({ message: "Cannot start maintenance while asset is assigned" });
  }

  asset.status = "maintenance";
  asset.assignedTo = null;
  asset.assignedBy = null;
  asset.assignedDate = null;
  asset.returnedDate = null;

  // Add a maintenance log entry with start date (today)
  asset.maintenanceLogs.push({
    maintenanceDate: new Date(),
    daysTaken: null,
    cost: null,
    description: description || "Maintenance started"
  });

  await asset.save();

  // Log this action
  await AssetLog.create({
    asset: asset._id,
    action: "maintenance_started",
    performedBy: req.user._id,
    note: `Maintenance started: ${description || "No description"}`
  });

  res.json({ message: "Asset marked as under maintenance", asset });
});


const completeMaintenance = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let { daysTaken, cost, description } = req.body;

    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.status !== "maintenance") {
      return res.status(400).json({ message: "Asset is not currently under maintenance" });
    }

    const lastLog = asset.maintenanceLogs[asset.maintenanceLogs.length - 1];
    if (!lastLog) {
      return res.status(400).json({ message: "No maintenance record found to complete" });
    }

    // Validate daysTaken and cost: must be numbers if provided
    if (daysTaken !== undefined) {
      daysTaken = Number(daysTaken);
      if (isNaN(daysTaken) || daysTaken < 0) {
        return res.status(400).json({ message: "Invalid daysTaken value" });
      }
    }

    if (cost !== undefined) {
      cost = Number(cost);
      if (isNaN(cost) || cost < 0) {
        return res.status(400).json({ message: "Invalid cost value" });
      }
    }

    // Assign new values only if provided
    if (daysTaken !== undefined) lastLog.daysTaken = daysTaken;
    if (cost !== undefined) lastLog.cost = cost;
    if (description) lastLog.description = description;

    asset.status = "available";

    await asset.save();

    // Check req.user presence to avoid errors
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    await AssetLog.create({
      asset: asset._id,
      action: "maintenance_completed",
      performedBy: req.user._id,
      note: `Maintenance completed: ${description || "No description"}. Days taken: ${daysTaken}, Cost: ${cost}`
    });

    res.json({ message: "Maintenance completed and asset is now available", asset });
  } catch (error) {
    console.error("Error in completeMaintenance:", error);
    res.status(500).json({ message: "Server error completing maintenance", error: error.message });
  }
});






// @desc    Mark asset as returned
// @route   PUT /api/assets/:id/return
// @access  Admin or SuperAdmin
const returnAsset = asyncHandler(async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.status !== "assigned") {
      return res.status(400).json({ message: "Asset is not currently assigned" });
    }

    const now = new Date();

    asset.status = "available";
    asset.returnedDate = now;

    // Update the last usageHistory entry with returnedDate and daysUsed
    const lastUsage = asset.usageHistory[asset.usageHistory.length - 1];
    if (lastUsage && !lastUsage.returnedDate) {
      lastUsage.returnedDate = now;
      lastUsage.daysUsed = Math.ceil((now - lastUsage.assignedDate) / (1000 * 60 * 60 * 24)); // days difference
    }

    asset.assignedTo = null;
    asset.assignedBy = null;
    asset.assignedDate = null;

    const updated = await asset.save();

    await AssetLog.create({
      asset: asset._id,
      action: "returned",
      performedBy: req.user._id,
      targetUser: updated.assignedTo,
      returnedDate: now,
      note: `Asset returned`,
    });

    res.json(updated);
  } catch (error) {
    console.error("Asset return failed:", error);
    res.status(500).json({ message: error.message });
  }
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

/**
 * @desc    Request an asset
 * @route   POST /api/assets/request
 * @access  Private
 */
const requestAsset = asyncHandler(async (req, res) => {
  const { assetType, reason, assetId } = req.body;

  if (!assetType) {
    res.status(400);
    throw new Error("Asset type is required");
  }

  // ✅ Validate against dynamic categories in Setting
  const settings = await Setting.findOne();
  if (!settings || !settings.assetTypes.includes(assetType)) {
    res.status(400);
    throw new Error("Invalid asset type. Please choose from available categories.");
  }

  let assetRef = null;
  if (assetId) {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      res.status(404);
      throw new Error("Specified asset not found");
    }
    assetRef = asset._id;
  }

  const newRequest = await Request.create({
    user: req.user._id,
    assetType,
    asset: assetRef,
    reason,
  });

  res.status(201).json({
    message: "Asset request submitted successfully",
    request: newRequest
  });
});

/**
 * @desc    Get all asset requests
 * @route   GET /api/assets/requests
 * @access  Admin or SuperAdmin
 */
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find()
    .populate("user", "name email")
    .populate("handledBy", "name email")
    .populate("asset", "name category serialNumbers")
    .sort({ createdAt: -1 });

  res.json(requests);
});

/**
 * @desc    Update request status (approve/reject)
 * @route   PUT /api/assets/requests/:id
 * @access  Admin or SuperAdmin
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, responseNote } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value. Must be 'approved' or 'rejected'.");
  }

  request.status = status;
  request.responseNote = responseNote || "";
  request.handledBy = req.user._id;
  request.approvedDate = new Date();

  const updated = await request.save();
  res.json({
    message: `Request ${status} successfully`,
    request: updated
  });
});

/**
 * @desc    Get requests by current user
 * @route   GET /api/assets/myrequests
 * @access  Private
 */
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ user: req.user._id })
    .populate("asset", "name category serialNumbers")
    .sort({ createdAt: -1 });

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
  startMaintenance,
  completeMaintenance
};
