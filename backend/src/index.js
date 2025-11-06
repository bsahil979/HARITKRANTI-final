import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import listingRouter from "./routes/listing.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import orderRouter from "./routes/order.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import imageRouter from "./routes/image.routes.js";
import cropRecommendationRouter from "./routes/cropRecommendation.routes.js";
import categoryRouter from "./routes/category.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/products", productRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/images", imageRouter);
app.use("/api/crop-recommendation", cropRecommendationRouter);
app.use("/api/categories", categoryRouter);

app.use(notFound);
app.use(errorHandler);


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
    if (colonIndex === -1) return uri; // no password present
    const username = credentialsPart.slice(0, colonIndex);
    const password = credentialsPart.slice(colonIndex + 1);
    // If password already appears encoded, keep it; otherwise encode it
    const encodedPassword = /%[0-9A-Fa-f]{2}/.test(password)
      ? password
      : encodeURIComponent(password);
    return `${prefix}${username}:${encodedPassword}@${hostAndParams}`;
  } catch (_e) {
    return uri;
  }
}

const URI = sanitizeMongoUri(rawUri);

console.log("Environment check:");
console.log("PORT:", PORT);
console.log("MONGODB_URI:", URI ? (URI.includes("@") ? "Set (credentials present)" : "Set") : "Not set");

connectDB(URI)
.then(() => app.listen(PORT, () => console.log(`🚀 API running http://localhost:${PORT}`)))
.catch((err) => {
console.error("Mongo connection error:", err);
process.exit(1);

});

