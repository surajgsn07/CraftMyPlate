import express from "express";
import {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Fetch all menu items
router.get("/", getAllMenuItems);

// Add a new menu item (protected route)
router.post("/", authenticate, addMenuItem);

// Update a menu item (protected route)
router.put("/:id", authenticate, updateMenuItem);

// Delete a menu item (protected route)
router.delete("/:id", authenticate, deleteMenuItem);

export default router;
