import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import axiosInstance from "../axiosConfig/axiosConfig";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]); // Local state to store fetched orders
  const [loading, setLoading] = useState(true); // Loading state for orders
  const [error, setError] = useState(null); // Error state for fetching orders

  const fetchOrders = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axiosInstance.get("/order"); // Replace with your API endpoint
      setOrders(response.data.data); // Store orders in local state
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
        <div className="flex-shrink-0">
          <FaUserCircle className="text-gray-500 text-6xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
          <p className="text-lg text-gray-600">{user?.role}</p>
        </div>
      </div>

      {/* User Information Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Information
        </h2>
        <p className="text-lg text-gray-700">
          <strong>Username:</strong> {user?.username}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      {/* Shopping Cart Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Shopping Cart
        </h2>
        {user?.cart && user.cart.length > 0 ? (
          <ul className="space-y-4">
            {user.cart.map((item) => (
              <li
                key={item.itemId._id}
                className="border-b pb-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-bold">{item.itemId.name}</p>
                  <p className="text-sm text-gray-500">
                    Category: {item.itemId.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ₹{item.itemId.price}
                  </p>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  Quantity: {item.quantity}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>
{/* Order History Section */}
<div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
    Order History
  </h2>
  {loading ? (
    <p className="text-gray-500">Loading orders...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : orders.length > 0 ? (
    <ul className="space-y-4">
      {orders.map((order, index) => (
        <li
          key={index}
          className="border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0"
        >
          <div className="flex-1">
            <p className="text-base sm:text-lg text-gray-700">
              <strong>Order ID:</strong> {order?._id}
            </p>
            <div className="mt-1">
              <p className="text-sm text-gray-500">
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          </div>
          <div className="flex-1 mt-2 sm:mt-0">
            <ul className="ml-4 sm:ml-0 space-y-1">
              {order.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-gray-700">
                  - {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No orders found.</p>
  )}
</div>

    </div>
  );
};

export default ProfilePage;
