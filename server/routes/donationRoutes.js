import express from "express";
import {
  createDonation,
  getCompanyDonations,
  getPendingSchools,
} from "../controller/donationController.js";
import {
  protect,
  protectCompany,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Company-only routes
router.post("/", protect, protectCompany, createDonation);
router.get(
  "/company/:partyId",
  protect,
  protectCompany,
  getCompanyDonations
);
router.get(
  "/pending-schools/:itemType",
  protect,
  protectCompany,
  getPendingSchools
);

export default router;
