import express from "express";
import { placeOrder, getUserOrders } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Place an order (protected route)
router.post("/", authenticate, placeOrder);

// Fetch all orders of a logged-in user (protected route)
router.get("/", authenticate, getUserOrders);

export default router;
