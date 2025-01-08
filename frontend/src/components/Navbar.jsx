import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Assuming you're using React Router for navigation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle for mobile menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-200">CraftMyPlate</Link>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/menu" className="hover:text-gray-200">Menu</Link>
          <Link to="/cart" className="hover:text-gray-200">Cart</Link>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-2 hover:text-gray-200">
              <Link to={"/profile"} >Profile</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg hidden group-hover:block">
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
              <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Order History</Link>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-600 text-white p-4 space-y-4">
          <Link to="/" className="block">Home</Link>
          <Link to="/cart" className="block">Cart</Link>
          <Link to="/profile" className="block">My Profile</Link>
          <Link to="/orders" className="block">Order History</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
