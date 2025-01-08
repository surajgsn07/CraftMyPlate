import Order from "../models/Order.model.js";
import Menu from "../models/Menu.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Place an order
export const placeOrder = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  let totalAmount = 0;
  console.log({items})

  for (const item of items) {
    const menuItem = await Menu.findById(item.itemId?._id);
    item.menuItemId = item.itemId?._id;
    if (!menuItem) {
      throw new ApiError(404, `Menu item with ID ${item.itemId._id} not found`);
    }
    totalAmount += menuItem.price * item.quantity;
  }

  const order = await Order.create({
    userId: req.user.id,
    items,
    totalAmount,
  });

  res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

// Fetch all orders of a logged-in user
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).populate("items.menuItemId", "name price");

  res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});
