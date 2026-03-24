import express from "express";

import { protect } from "../../middleware/authMiddleware.js";
import { getSeriesByVoucher } from "../../controllers/voucherSerieController.js";

const router = express.Router();

router.get("/getSeriesByVoucher/:cmp_id", protect,getSeriesByVoucher);

export default router;