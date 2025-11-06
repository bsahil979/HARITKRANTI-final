import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { 
  createProduct, 
  listProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  getFarmerProducts 
} from "../controllers/product.controller.js";

const router = Router();

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected routes
router.get("/farmer/me", protect, authorize("farmer"), getFarmerProducts);
router.post("/", protect, authorize("farmer"), upload.single("image"), createProduct);
router.patch("/:id", protect, authorize("farmer", "admin"), updateProduct);
router.delete("/:id", protect, authorize("farmer", "admin"), deleteProduct);

export default router;



