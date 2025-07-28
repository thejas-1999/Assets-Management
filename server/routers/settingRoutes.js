// routes/settingRoutes.js
import express from 'express';
import { getSettings, updateAssetTypes } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getSettings);
router.put('/asset-types', protect, admin, updateAssetTypes);

export default router;
