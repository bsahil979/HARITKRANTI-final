import Product from "../models/Product.js";
import { uploadBufferToCloudinary } from "../utils/upload.js";

export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { 
      name, 
      title,
      description, 
      price, 
      pricePerKg,
      quantity, 
      quantityKg,
      category,
      location,
      status,
      images
    } = req.body;
    
    // Handle image upload
    let imageUrl = "";
    let imageArray = images || [];
    
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      imageUrl = uploaded.secure_url;
      if (!imageArray.includes(imageUrl)) {
        imageArray.push(imageUrl);
      }
    }
    
    // If no images provided, require at least one file
    if (imageArray.length === 0 && !req.file) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }
    
    const doc = await Product.create({
      name: name || title,
      title: title || name,
      description,
      price: price || pricePerKg,
      pricePerKg: pricePerKg || price,
      quantity: quantity || quantityKg,
      quantityKg: quantityKg || quantity,
      quantityAvailable: quantityKg || quantity || 0,
      category: category || "other",
      imageUrl: imageUrl || (imageArray.length > 0 ? imageArray[0] : ""),
      images: imageArray,
      farmerId: userId,
      farmer: userId,
      location: location || {},
      status: status || "available",
    });

    await doc.populate("farmerId", "name email phone profileImage profileImageRef address");
    await doc.populate("farmer", "name email phone profileImage profileImageRef address");
    await doc.populate("imageRefs", "url storageType displayUrl");
    
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      state, 
      district, 
      status, 
      farmer,
      sort = "-createdAt" 
    } = req.query;
    
    const filter = {};
    
    // Text search
    if (q) filter.$text = { $search: q };
    
    // Category filter
    if (category) filter.category = category;
    
    // Status filter
    if (status) filter.status = status;
    
    // Farmer filter
    if (farmer) filter.farmerId = farmer;
    
    // Location filters
    if (state) filter["location.state"] = state;
    if (district) filter["location.district"] = district;
    
    // Price filters
    if (minPrice || maxPrice) {
      filter.$or = [
        { pricePerKg: {} },
        { price: {} }
      ];
      if (minPrice) {
        filter.$or[0].pricePerKg.$gte = Number(minPrice);
        filter.$or[1].price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.$or[0].pricePerKg.$lte = Number(maxPrice);
        filter.$or[1].price.$lte = Number(maxPrice);
      }
    }
    
    const skip = (Number(page) - 1) * Number(limit);
        const query = Product.find(filter)
          .populate("farmerId", "name email phone profileImage profileImageRef address")
          .populate("farmer", "name email phone profileImage profileImageRef address")
          .populate("imageRefs", "url storageType displayUrl")
          .sort(sort)
          .skip(skip)
          .limit(Number(limit));
    
    const [data, total] = await Promise.all([
      query,
      Product.countDocuments(filter)
    ]);
    
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
        const doc = await Product.findById(id)
          .populate("farmerId", "name email phone profileImage profileImageRef address")
          .populate("farmer", "name email phone profileImage profileImageRef address")
          .populate("imageRefs", "url storageType displayUrl");
    
    if (!doc) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // Check if user owns the product
    if (product.farmerId.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
          .populate("farmerId", "name email phone profileImage profileImageRef address")
          .populate("farmer", "name email phone profileImage profileImageRef address")
          .populate("imageRefs", "url storageType displayUrl");
    
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // Check if user owns the product or is admin
    if (product.farmerId.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted", id });
  } catch (err) {
    next(err);
  }
};

export const getFarmerProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const filter = { farmerId: req.user._id };
    
    const skip = (Number(page) - 1) * Number(limit);
        const query = Product.find(filter)
          .populate("farmerId", "name email phone profileImage profileImageRef address")
          .populate("imageRefs", "url storageType displayUrl")
          .sort("-createdAt")
          .skip(skip)
          .limit(Number(limit));
    
    const [data, total] = await Promise.all([
      query,
      Product.countDocuments(filter)
    ]);
    
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};



