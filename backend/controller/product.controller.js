import { redis } from "../config/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(req.file.buffer);
    });
    console.log("uploadResult.secure_url", uploadResult.secure_url);

    // 3️⃣ Save product to DB
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: uploadResult.secure_url,
    });
    await redis.del("product_all");
    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getALLProducts = async (req, res) => {
  try {
    const cachedProducts = await redis.get("product_all");

    console.log("Redis value:", cachedProducts);

    if (cachedProducts) {
      console.log("✅ From Redis");
      return res.json(JSON.parse(cachedProducts));
    }

    console.log("⚡ Fetching from MongoDB");

    const products = await Product.find();
    console.log("Mongo products:", products);

    if (!products.length) {
      console.log("❌ Mongo returned empty array");
      return res.status(404).json({ message: "No product found" });
    }

    await redis.set("product_all", JSON.stringify(products), "EX", 300);

    return res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
};

export const getfeaturedProducts = async (req, res) => {
  try {
    let products = await redis.get("featured_product");
    if (products) {
      return res.json(JSON.parse(products));
    }
    products = await Product.find({ isFeatured: true }).lean();

    if (!products) {
      return res.status(404).json({ message: "No feature product found" });
    }
    await redis.set("featured_product", JSON.stringify(products));

    res.json(products);
  } catch (error) {
    console.log("error in getting featured product");
    res.status(500).json({ message: "server error" });
  }
};
