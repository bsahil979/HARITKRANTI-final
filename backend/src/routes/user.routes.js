import { Router } from "express";
import {
getUsers,
getUser,
updateProfile,
deleteUser,
getFarmers,
getFarmerById
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/farmers", getFarmers); // GET /api/users/farmers
router.get("/farmers/:id", getFarmerById); // GET /api/users/farmers/:id

// Protected routes
router.get("/", protect, authorize("admin"), getUsers); // GET /api/users
router.get("/:id", protect, authorize("admin"), getUser); // GET /api/users/:id
router.put("/profile", protect, updateProfile); // PUT /api/users/profile
router.delete("/:id", protect, authorize("admin"), deleteUser); // DELETE /api/users/:id

export default router;


