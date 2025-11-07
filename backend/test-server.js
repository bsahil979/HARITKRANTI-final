import dotenv from "dotenv";
dotenv.config();

console.log("Testing server imports...");

try {
  console.log("1. Testing express...");
  const express = await import("express");
  console.log("✓ Express imported");
  
  console.log("2. Testing database connection...");
  const { connectDB } = await import("./src/db.js");
  console.log("✓ DB module imported");
  
  console.log("3. Testing routes...");
  const imageRouter = await import("./src/routes/image.routes.js");
  console.log("✓ Image routes imported");
  
  console.log("4. Testing models...");
  const Image = await import("./src/models/Image.js");
  console.log("✓ Image model imported");
  
  console.log("\n✅ All imports successful!");
  console.log("\nStarting server...");
  
  const app = express.default();
  app.use(express.default.json());
  
  app.get("/health", (req, res) => res.json({ ok: true }));
  
  const PORT = process.env.PORT || 5000;
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
  
  connectDB(URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
      process.exit(1);
    });
    
} catch (error) {
  console.error("❌ Import error:", error.message);
  console.error(error.stack);
  process.exit(1);
}


