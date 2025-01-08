import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import axiosInstance from "../axiosConfig/axiosConfig";

const CartPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [cartItems, setCartItems] = useState(user?.cart || []);
  const dispatch = useDispatch()


  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = async(id) => {
    try {
      const item = user.cart.find((item) => item.itemId._id === id);

      const res  = await axiosInstance.post(`/user/cart/remove` , item);
      if(res.data){
        console.log("Item removed from cart: ", res.data.data);
      }
    } catch (error) {
      console.log("error : " ,error)
    }finally{
      setCartItems((prevItems) => prevItems.filter((item) => item.itemId._id !== id));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.itemId.price,
      0
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axiosInstance.post('/order' , {items:cartItems});
      if(res.data){
        console.log("Order placed: ", res.data.data);
        const obj = {...user , cart:[]};
        dispatch(login(obj));
        setCartItems([]);
      }
    } catch (error) {
      console.log("error : " ,error)
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Your Cart</h2>

      {/* Cart Items List */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.itemId._id}
            className="bg-white border rounded-lg shadow-md flex-col sm:flex-row p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div>
                <h3 className="text-xl font-semibold">{item?.itemId?.name}</h3>
                <p className="text-gray-600">Category: {item?.itemId?.category}</p>
                <p className="text-lg font-bold">₹{item?.itemId?.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecreaseQuantity(item?.itemId?._id)}
                  className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                >
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item?.itemId?._id)}
                  className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveItem(item.itemId._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 p-6 bg-white border rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-lg">Total Items:</span>
            <span className="text-lg font-semibold">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg">Total Price:</span>
            <span className="text-lg font-semibold">₹{getTotalPrice()}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

