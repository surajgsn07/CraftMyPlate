import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../axiosConfig/axiosConfig';
import { login} from "../store/authSlice"

const MenuPage = () => {
    const user = useSelector(state => state.auth.user);
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'Main Course', price: '', availability: true });
    const [isAdding, setIsAdding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemCount, setItemCount] = useState(1);
    const dispatch = useDispatch()

    const fetchMenuItems = async () => {
        try {
            const res = await axiosInstance.get('/menu');
            if (res.data) {
                console.log("Menu items: ", res.data.data);
                setMenuItems(res.data.data);
            }
        } catch (error) {
            console.log("Error fetching menu items: ", error);
        }
    };

    const handleAddItem = () => {
        if (user?.role === 'owner') {
            setIsAdding(true);
        }
    };

    const handleSubmitNewItem = async () => {
        if (newItem.name && newItem.price) {
            try {
                const res = await axiosInstance.post('/menu', newItem);
                if (res.data) {
                    setMenuItems([...menuItems, res.data.data]); // Assuming response returns the created item
                    setNewItem({ name: '', category: 'Main Course', price: '', availability: true });
                    setIsAdding(false);
                }
            } catch (error) {
                console.log("Error adding item: ", error);
            }
        } else {
            alert('Please fill out all fields');
        }
    };

    const handleCancel = () => {
        setNewItem({ name: '', category: 'Main Course', price: '', availability: true });
        setIsAdding(false);
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemCount(1);
    };

    const handleAddToCart = async() => {
        try {
            const res = await axiosInstance.post('/user/cart/add', {
                itemId: selectedItem._id,
                quantity: itemCount
            });

            if(res.data){
                console.log("Item added to cart: ", res.data.data);
                const obj = {
                    user: res.data.data
                }
                dispatch(login(obj))
                


                const updatedMenuItems = menuItems.filter((item) => {    
                    return item._id !== selectedItem._id;});
                setMenuItems(updatedMenuItems);
            }

        } catch (error) {
            console.log("error : " , error)
            
        }finally{
            closeModal();
            setSelectedItem(null)
        }
        
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <div className="container mx-auto p-6">
            {/* Add Menu Item Button (Only visible if user is an owner) */}
            {user?.role === 'owner' && (
                <div className="mt-8">
                    {!isAdding ? (
                        <button
                            className="bg-green-500 text-white px-6 py-3 rounded-md w-full hover:bg-green-600"
                            onClick={handleAddItem}
                        >
                            Add Menu Item
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Item Name"
                                className="w-full p-3 border rounded-md"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <select
                                className="w-full p-3 border rounded-md"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option value="Appetizers">Appetizers</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Price"
                                className="w-full p-3 border rounded-md"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                                    onClick={handleSubmitNewItem}
                                >
                                    Submit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <h2 className="text-4xl font-bold text-center mb-8">Menu</h2>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div key={item._id} className="bg-white border rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-gray-600">{item.category}</p>
                        <p className="text-gray-600">{item.availability ? 'Available' : 'Out of Stock'}</p>
                        <p className="text-lg font-bold mt-2">${item.price}</p>
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={() => openModal(item)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for adding to cart */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-2xl font-semibold mb-4">{selectedItem.name}</h3>
                        <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                        <p className="text-lg font-bold">${selectedItem.price}</p>

                        {/* Item Counter */}
                        <div className="mt-4 flex items-center space-x-4">
                            <button
                                className="bg-gray-300 text-black p-2 rounded-md"
                                onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                            >
                                -
                            </button>
                            <span className="text-xl">{itemCount}</span>
                            <button
                                className="bg-gray-300 text-black p-2 rounded-md"
                                onClick={() => setItemCount(itemCount + 1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
