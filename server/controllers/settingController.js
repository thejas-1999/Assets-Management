// controllers/settingController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Setting from "../models/settingModel.js";

// Get settings
export const getSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }
  res.json(setting);
});

// Update asset types
export const updateAssetTypes = asyncHandler(async (req, res) => {
  const { assetTypes } = req.body;
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({ assetTypes });
  } else {
    setting.assetTypes = assetTypes;
    await setting.save();
  }
  res.json(setting);
});
