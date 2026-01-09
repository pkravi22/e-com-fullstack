import express from "express";
import {
  getUserProfile,
  login,
  logout,
  refreshToken,
  register,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/logout", logout);
//login
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/getme", protectRoute, getUserProfile);

export default router;
