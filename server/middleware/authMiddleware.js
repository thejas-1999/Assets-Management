import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log("Protect Middleware: No token found");
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    console.log("Protect Middleware: User found", req.user);
    next();
  } catch (error) {
    console.log("Protect Middleware: Token failed", error.message);
    res.status(401);
    throw new Error("Token failed");
  }
});

const admin = (req, res, next) => {
  console.log("Admin Middleware: req.user.role =", req.user?.role);
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
