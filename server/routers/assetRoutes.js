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
} from "../controllers/assetController.js";

import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin/SuperAdmin - Create Asset
router.post("/create", protect, admin, createAsset);

// Admin/SuperAdmin - Get All Assets
router.get("/getallassets", protect, admin, getAllAssets);

// Admin/SuperAdmin - Get Asset by ID
router.get("/:id", protect, admin, getAssetById);

// Admin/SuperAdmin - Update Asset
router.put("/:id", protect, admin, updateAssetById);

// Admin/SuperAdmin - Delete Asset
router.delete("/:id", protect, admin, deleteAssetById);

// Admin/SuperAdmin - Assign Asset to User
router.put("/:id/assign", protect, admin, assignAsset);

// Admin/SuperAdmin - Mark Asset as Returned
router.put("/:id/return", protect, admin, returnAsset);

// Admin/SuperAdmin/User - Get Assets by User ID
router.get("/user/:userId", protect, getAssetsByUser);

export default router;
