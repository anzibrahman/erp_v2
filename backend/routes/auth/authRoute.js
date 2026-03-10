import express from "express";
import { Login, registerUser } from "../../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post('/Login', Login);
export default router;
