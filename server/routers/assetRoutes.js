import express from "express";
import {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAssetById,
  deleteAssetById,
  assignAsset,
  returnAsset,
  getAssetsByUser,
  requestAsset,
  getAllRequests,
  updateRequestStatus,
  getMyRequests,
  startMaintenance,
  completeMaintenance,
  downloadAssetsExcel,
  downloadAssetsPDF,
  downloadAssetLogsExcel,
  downloadAssetLogsPDF
} from "../controllers/assetController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin/SuperAdmin - Create Asset
router.post("/create", protect, admin, createAsset);
router.put('/:id/start-maintenance',protect, admin,  startMaintenance);
router.put('/:id/complete-maintenance',protect, admin,  completeMaintenance);

// Admin/SuperAdmin - Get All Assets
router.get("/getallassets", protect, admin, getAllAssets);


router.get('/download/excel',protect, admin, downloadAssetsExcel);
router.get('/download/pdf', protect, admin, downloadAssetsPDF);

router.get('/:id/logs/download/excel',protect, admin, downloadAssetLogsExcel);
router.get('/:id/logs/download/pdf', protect, admin, downloadAssetLogsPDF);

// Admin/SuperAdmin/User - Get Assets by User ID
router.get("/user/:userId", protect, getAssetsByUser);

// Employees - Submit Request
router.post("/request", protect, requestAsset);

// Admin/SuperAdmin - Get All Requests
router.get("/requests", protect, admin, getAllRequests);

// Admin/SuperAdmin - Update Request Status
router.put("/requests/:id", protect, admin, updateRequestStatus);

// Logged-in user - Get own requests
router.get("/myrequests", protect, getMyRequests);

// Admin/SuperAdmin - Assign Asset to User
router.put("/:id/assign", protect, admin, assignAsset);

// Admin/SuperAdmin - Mark Asset as Returned
router.put("/:id/return", protect, admin, returnAsset);

// Admin/SuperAdmin - Update Asset
router.put("/:id", protect, admin, updateAssetById);

// Admin/SuperAdmin - Delete Asset
router.delete("/:id", protect, admin, deleteAssetById);

// Admin/SuperAdmin - Get Asset by ID (MUST COME LAST)
router.get("/:id", protect, admin, getAssetById);

export default router;
