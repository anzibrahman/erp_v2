import express from "express";
import {
  getCurrentUser,
  Login,
  registerUser,
} from "../../controllers/authController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post('/Login', Login);
router.get("/me", protect, getCurrentUser);
export default router;
