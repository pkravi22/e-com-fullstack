import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { redis } from "../config/redis.js";

/* ===========================
   GET CART PRODUCTS
=========================== */
export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Fetching cart for user:", userId);

    const cachedCart = await redis.get(`cart:${userId}`);
    if (cachedCart) {
      console.log("Cart from redis");
      return res.json(JSON.parse(cachedCart));
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    console.log("Cart from DB:", cart);

    const response = cart || {
      items: [],
      totalItems: 0,
      totalAmount: 0,
    };

    await redis.set(`cart:${userId}`, JSON.stringify(response), "EX", 300);

    res.json(response);
  } catch (error) {
    console.error("GET CART ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ADD TO CART
=========================== */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price, // snapshot
      });
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();

    // clear cache
    await redis.del(`cart:${userId}`);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   UPDATE QUANTITY
=========================== */
export const updateQuantity = async (req, res) => {
  try {
    const { productId, action } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (action === "inc") {
      cartItem.quantity += 1;
    } else if (action === "dec") {
      cartItem.quantity -= 1;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // remove item if quantity <= 0
    if (cartItem.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();
    await redis.del(`cart:${userId}`);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   REMOVE ALL OF ONE PRODUCT
=========================== */
export const removeAllItems = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const exists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!exists) {
      return res.json({
        message: "Product not in cart",
        cart,
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();
    await redis.del(`cart:${userId}`);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
