import express from "express";
import { registerUser, loginUser, addToCart, removeFromCart } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);


router.post("/cart/add", authenticate, addToCart);  // Add item to cart
router.post("/cart/remove", authenticate, removeFromCart);  // Remo

export default router;
