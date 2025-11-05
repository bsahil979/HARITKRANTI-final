import Product from "../models/Product.js";
import { uploadBufferToCloudinary } from "../utils/upload.js";

export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, description, price, quantity, category } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });

    const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
    const doc = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      imageUrl: uploaded.secure_url,
      farmerId: userId,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (_req, res, next) => {
  try {
    const items = await Product.find().sort("-createdAt");
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};



