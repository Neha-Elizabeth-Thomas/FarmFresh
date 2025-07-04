import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMoon, FiSun } from 'react-icons/fi';

const Header = () => {
    const [darkMode, setDarkMode] = useState(() => {
    // Get initial value from localStorage or default to false
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Main Nav */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            FARM FRESH
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-gray-600 hover:text-green-600">Shop</Link>
            <Link to="/on-sale" className="text-gray-600 hover:text-green-600">On Sale</Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* User Actions */}
        {/* Theme Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
            {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
        </button>
        <div className="flex items-center space-x-5">
          <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>
          <Link to="/login" className="text-gray-600 hover:text-green-600">
            <FiUser size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
