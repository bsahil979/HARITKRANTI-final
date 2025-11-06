import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";

dotenv.config();

const defaultCategories = [
  { name: "Grains", description: "Rice, Wheat, and other grains", icon: "🌾" },
  { name: "Vegetables", description: "Fresh vegetables", icon: "🥬" },
  { name: "Fruits", description: "Fresh fruits", icon: "🍎" },
  { name: "Pulses", description: "Lentils, Beans, and other pulses", icon: "🫘" },
  { name: "Spices", description: "Turmeric, Pepper, and other spices", icon: "🌶️" },
  { name: "Oilseeds", description: "Mustard, Sunflower, and other oilseeds", icon: "🌻" },
  { name: "Other", description: "Miscellaneous products", icon: "📦" },
];

async function seedCategories() {
  try {
    const rawUri = process.env.MONGODB_URI || "mongodb+srv://sahilbelchada_db_user:HaritKranti%401234@haritkranticluster.dvdqyxo.mongodb.net/?retryWrites=true&w=majority&appName=HaritKrantiCluster";
    
    function sanitizeMongoUri(uri) {
      try {
        if (!uri || typeof uri !== "string") return uri;
        if (!uri.startsWith("mongodb+srv://")) return uri;
        const prefix = "mongodb+srv://";
        const rest = uri.slice(prefix.length);
        const atIndex = rest.lastIndexOf("@");
        if (atIndex === -1) return uri;
        const credentialsPart = rest.slice(0, atIndex);
        const hostAndParams = rest.slice(atIndex + 1);
        const colonIndex = credentialsPart.indexOf(":");
        if (colonIndex === -1) return uri;
        const username = credentialsPart.slice(0, colonIndex);
        const password = credentialsPart.slice(colonIndex + 1);
        const encodedPassword = /%[0-9A-Fa-f]{2}/.test(password)
          ? password
          : encodeURIComponent(password);
        return `${prefix}${username}:${encodedPassword}@${hostAndParams}`;
      } catch (_e) {
        return uri;
      }
    }

    const URI = sanitizeMongoUri(rawUri);

    await mongoose.connect(URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing categories (optional - remove if you want to keep existing)
    // await Category.deleteMany({});
    // console.log("Cleared existing categories");

    // Insert default categories
    const inserted = [];
    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        const category = await Category.create(cat);
        inserted.push(category);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${cat.name}`);
      }
    }

    console.log(`\n✅ Seeding complete! ${inserted.length} new categories created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();

