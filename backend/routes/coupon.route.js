import express from "express";
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, getCoupon);
router.post("/validate-coupon", protectRoute, validateCoupon);

export default router;
