import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import listingRouter from "./routes/listing.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI || "mongodb+srv://sahilbelchada_db_user:HaritKranti%401234@haritkranticluster.dvdqyxo.mongodb.net/?retryWrites=true&w=majority&appName=HaritKrantiCluster";

console.log("Environment check:");
console.log("PORT:", PORT);
console.log("MONGODB_URI:", URI ? "Set" : "Not set");

connectDB(URI)
.then(() => app.listen(PORT, () => console.log(`🚀 API running http://localhost:${PORT}`)))
.catch((err) => {
console.error("Mongo connection error:", err);
process.exit(1);
});