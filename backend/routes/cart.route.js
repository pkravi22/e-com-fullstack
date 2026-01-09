import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllItems,
  updateQuantity,
} from "../controller/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/allitems", protectRoute, getCartProducts);
router.post("/addTocart", protectRoute, addToCart);
router.patch("/updateQuantity", protectRoute, updateQuantity);
router.delete("/removerItem", protectRoute, removeAllItems);

export default router;
