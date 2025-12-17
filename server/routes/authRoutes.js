import express from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
  logoutUser,
} from "../controller/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register
router.post("/register", registerUser);

router.post("/forgot-password", resetPassword);
router.post("/logout", protect, logoutUser);

export default router;
