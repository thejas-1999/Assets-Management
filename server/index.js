import dotenv from "dotenv";
dotenv.config();

import cors from 'cors';
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import userRoutes from "./routers/userRoutes.js";
import assetRoutes from "./routers/assetRoutes.js";
import assetLogRoutes from "./routers/assetLogRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true,              
}));





// Routes
app.use("/api/users", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/asset-logs", assetLogRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

