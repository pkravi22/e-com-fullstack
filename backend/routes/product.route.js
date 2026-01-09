import express from "express";
import {
  addProduct,
  getALLProducts,
  getfeaturedProducts,
} from "../controller/product.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", protectRoute, adminOnly, getALLProducts);
router.get("/featured", protectRoute, adminOnly, getfeaturedProducts);
router.post("/", protectRoute, adminOnly, upload.single("image"), addProduct);

export default router;
