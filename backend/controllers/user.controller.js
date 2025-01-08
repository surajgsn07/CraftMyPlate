import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Menu from "../models/Menu.model.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    throw new ApiError(400, "Username already exists");
  }

  const user = await User.create({ username, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(201).json(new ApiResponse(201, { user, token }, "User registered successfully"));
});

// Login a user and return a JWT token
export const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username }).populate("cart.itemId");
  if (!user) {
    throw new ApiError(400, "Invalid username or password");
  }

  if( !(await user.matchPassword(password))){
    throw new ApiError(400 , "Wrong password")
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res, next) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and `user.id` is in the request

  if (!itemId || !quantity) {
    throw new ApiError(400, "Item ID and quantity are required");
  }

  const menuItem = await Menu.findById(itemId);
  if (!menuItem) {
    throw new ApiError(404, "Menu item not found");
  }

  const user = await User.findById(userId).populate("cart.itemId");

  // Check if the item is already in the cart
  const itemIndex = user.cart.findIndex(item => item.itemId.toString() === itemId);
  if (itemIndex >= 0) {
    // If item is already in cart, update the quantity
    user.cart[itemIndex].quantity += quantity;
  } else {
    // If item is not in cart, add it
    user.cart.push({ itemId, quantity });
  }

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "Item added to cart"));
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and `user.id` is in the request

  if (!itemId) {
    throw new ApiError(400, "Item ID is required");
  }

  const user = await User.findById(userId).populate("cart.itemId");

  // Find the index of the item in the cart
  const itemIndex = user.cart.findIndex(item => item.itemId.toString() === itemId);
  if (itemIndex < 0) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Remove the item from the cart
  user.cart.splice(itemIndex, 1);
  await user.save();

  res.status(200).json(new ApiResponse(200, user.cart, "Item removed from cart"));
});
