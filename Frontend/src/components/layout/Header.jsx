import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';


const Header = () => {
    const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Main Nav */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
            FARM FRESH
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Shop</Link>
            <Link to="/on-sale" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">On Sale</Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full py-2 pl-4 pr-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* User Actions */}
        {/* Theme Toggle */}
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
        <div className="flex items-center space-x-5">
          <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>
          <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <FiUser size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
