import Inventory from "../models/Inventory.js";
import AdminProduct from "../models/AdminProduct.js";

// Get all inventory items (admin)
export const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ admin: req.user._id })
      .populate("purchase")
      .populate("sourceFarmer", "name email")
      .sort("-createdAt");
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// Get single inventory item
export const getInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id)
      .populate("purchase")
      .populate("sourceFarmer", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Update inventory item
export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Inventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("purchase")
      .populate("sourceFarmer", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// List product in marketplace (create AdminProduct)
export const listProductInMarketplace = async (req, res, next) => {
  try {
    const { inventoryId, sellingPrice, quantity } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (inventory.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to list this inventory",
      });
    }

    if (quantity > inventory.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient quantity in inventory",
      });
    }

    const adminProduct = await AdminProduct.create({
      admin: req.user._id,
      inventory: inventoryId,
      name: inventory.name,
      description: inventory.description,
      category: inventory.category,
      images: inventory.images,
      price: sellingPrice || inventory.sellingPrice,
      pricePerKg: sellingPrice || inventory.sellingPrice,
      quantity: quantity || inventory.availableQuantity,
      unit: inventory.unit,
      status: "available",
      isAdminProduct: true,
      adminMarkup: sellingPrice - inventory.purchasePrice,
    });

    // Update inventory status
    inventory.status = "listed";
    await inventory.save();

    res.status(201).json({ success: true, data: adminProduct });
  } catch (error) {
    next(error);
  }
};

// Get all admin products (for marketplace)
export const getAllAdminProducts = async (req, res, next) => {
  try {
    const { status = "available" } = req.query;
    const filter = { isAdminProduct: true, status };
    
    const products = await AdminProduct.find(filter)
      .populate("admin", "name")
      .populate("inventory")
      .sort("-createdAt");
    
    // Sync AdminProduct.quantity with inventory.availableQuantity (inventory is source of truth)
    for (const product of products) {
      if (product.inventory && product.quantity !== product.inventory.availableQuantity) {
        product.quantity = product.inventory.availableQuantity;
        if (product.quantity === 0) {
          product.status = "out_of_stock";
        }
        await product.save();
      }
    }
    
    // Re-fetch to get updated quantities
    const updatedProducts = await AdminProduct.find(filter)
      .populate("admin", "name")
      .populate("inventory")
      .sort("-createdAt");
    
    res.json({ success: true, data: updatedProducts });
  } catch (error) {
    next(error);
  }
};

