import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { createProduct, listProducts } from "../controllers/product.controller.js";

const router = Router();

router.get("/", listProducts);
router.post("/", protect, authorize("farmer"), upload.single("image"), createProduct);

export default router;



