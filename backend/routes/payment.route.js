import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPayment,
  verifyPayment,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/", protectRoute, createPayment);
router.post("/verify-payment", protectRoute, verifyPayment);

export default router;
