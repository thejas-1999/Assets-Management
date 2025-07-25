import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect route: Valid JWT required
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Try getting token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // If not, try from cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // If no token found
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Token failed");
  }
});

// Allow access to Admin or SuperAdmin
const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "superadmin")
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
};

// Only SuperAdmin can access
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as superadmin");
  }
};

export { protect, admin, superAdmin };
