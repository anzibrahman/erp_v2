// routes/user/userRoute.js
import express from "express";
import { createStaffUser, listStaffUsers,
  getStaffUserById,
  updateStaffUser,
  deleteStaffUser, } from "../../controllers/userController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();


router.post("/staff", protect, createStaffUser);
router.get("/staff", protect, listStaffUsers);         // list
router.get("/staff/:id", protect, getStaffUserById);   // get one
router.put("/staff/:id", protect, updateStaffUser);    // update
router.delete("/staff/:id", protect, deleteStaffUser); // delete
export default router;

