import express from "express";
import {
  getPendingRequests,
  getProcessedRequests,
  createRequest,
  getAvailableDonations,
} from "../controller/requestController.js";

import { protect, protectSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 SCHOOL ROUTES
router.get("/pending/:partyId", protect, protectSchool, getPendingRequests);
router.get("/processed/:partyId", protect, protectSchool, getProcessedRequests);
router.post("/", protect, protectSchool, createRequest);

// (optional)
router.get(
  "/available-donations/:itemType",
  protect,
  protectSchool,
  getAvailableDonations
);


export default router;
