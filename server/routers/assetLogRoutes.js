import express from "express";
import { getAllAssetLogs, getLogsByAssetId } from "../controllers/assetLogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getAllAssetLogs);
router.get("/:assetId", protect, admin, getLogsByAssetId); 

export default router;
