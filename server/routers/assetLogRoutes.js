import express from "express";
import { getAllAssetLogs } from "../controllers/assetLogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getAllAssetLogs);

export default router;
