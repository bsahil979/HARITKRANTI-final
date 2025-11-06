import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic product info
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // Alias for name (for compatibility)
    description: { type: String, default: "" },
    
    // Pricing - support both price and pricePerKg
    price: { type: Number, min: 0 },
    pricePerKg: { type: Number, min: 0 },
    
    // Quantity - support both quantity and quantityKg
    quantity: { type: Number, min: 0 },
    quantityKg: { type: Number, min: 0 },
    quantityAvailable: { type: Number, min: 0 }, // Available quantity
    
    // Unit
    unit: { type: String, default: "kg" },
    
    // Category
    category: { 
      type: String, 
      enum: [
        "grains", "vegetables", "fruits", "pulses", "spices", "oilseeds", "other"
      ],
      default: "other",
      index: true,
      required: true,
      trim: true 
    },
    
    // Images - support both single imageUrl and multiple images
    imageUrl: { type: String }, // Single image (for backward compatibility)
    images: { type: [String], default: [] }, // Multiple images
    
    // Farmer reference
    farmerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    farmer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // Alias for farmerId (for compatibility)
    
    // Location (from Listing model)
    location: {
      district: { type: String, trim: true, index: true },
      state: { type: String, trim: true, index: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },
    
    // Status
    status: { 
      type: String, 
      enum: ["available", "reserved", "sold", "out_of_stock"], 
      default: "available",
      index: true 
    },
  },
  { timestamps: true }
);

// Text search on name/title + description
productSchema.index({ name: "text", title: "text", description: "text" });

// Virtual to get the effective price
productSchema.virtual("effectivePrice").get(function() {
  return this.pricePerKg || this.price || 0;
});

// Virtual to get the effective quantity
productSchema.virtual("effectiveQuantity").get(function() {
  return this.quantityAvailable || this.quantityKg || this.quantity || 0;
});

// Virtual to get the first image
productSchema.virtual("firstImage").get(function() {
  if (this.images && this.images.length > 0) return this.images[0];
  return this.imageUrl || "";
});

// Ensure virtuals are included in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Pre-save middleware to sync fields
productSchema.pre("save", function(next) {
  // Sync name and title
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;
  
  // Sync farmerId and farmer
  if (this.farmerId && !this.farmer) this.farmer = this.farmerId;
  if (this.farmer && !this.farmerId) this.farmerId = this.farmer;
  
  // Sync price and pricePerKg
  if (this.price && !this.pricePerKg) this.pricePerKg = this.price;
  if (this.pricePerKg && !this.price) this.price = this.pricePerKg;
  
  // Sync quantity fields
  if (this.quantity && !this.quantityKg) this.quantityKg = this.quantity;
  if (this.quantityKg && !this.quantity) this.quantity = this.quantityKg;
  if (!this.quantityAvailable) {
    this.quantityAvailable = this.quantityKg || this.quantity || 0;
  }
  
  // Sync images
  if (this.imageUrl && (!this.images || this.images.length === 0)) {
    this.images = [this.imageUrl];
  }
  if (this.images && this.images.length > 0 && !this.imageUrl) {
    this.imageUrl = this.images[0];
  }
  
  next();
});

export default mongoose.model("Product", productSchema);



