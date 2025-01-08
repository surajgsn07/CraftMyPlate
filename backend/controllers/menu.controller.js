import Menu from "../models/Menu.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


// Fetch all menu items
export const getAllMenuItems = asyncHandler(async (req, res, next) => {
  const menuItems = await Menu.find();
  res.status(200).json(new ApiResponse(200, menuItems, "Menu items fetched successfully"));
});

// Add a new menu item
export const addMenuItem = asyncHandler(async (req, res, next) => {
  const { name, category, price, availability } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "Name and price are required");
  }

  const menuItem = await Menu.create({ name, category, price, availability });
  res.status(201).json(new ApiResponse(201, menuItem, "Menu item added successfully"));
});

// Update a menu item
export const updateMenuItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, availability } = req.body;

  const menuItem = await Menu.findByIdAndUpdate(
    id,
    { name, category, price, availability },
    { new: true, runValidators: true }
  );

  if (!menuItem) {
    throw new ApiError(404, "Menu item not found");
  }

  res.status(200).json(new ApiResponse(200, menuItem, "Menu item updated successfully"));
});

// Delete a menu item
export const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const menuItem = await Menu.findByIdAndDelete(id);
  if (!menuItem) {
    throw new ApiError(404, "Menu item not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Menu item deleted successfully"));
});
