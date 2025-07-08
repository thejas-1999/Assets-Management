import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/login", loginUser);
router.post("/register",  registerUser); 
router.post("/logout", protect, logoutUser);

// Private - User
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/dashboard", protect, getUserDashboard);

// Admin/Superadmin
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);

// Superadmin
router.delete("/:id", protect, superAdmin, deleteUser);

export default router;
