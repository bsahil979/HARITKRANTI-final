import { Router } from "express";
import { getCategories } from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategories); // GET /api/categories

export default router;


