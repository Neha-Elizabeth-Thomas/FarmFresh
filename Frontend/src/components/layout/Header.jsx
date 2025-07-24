import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../features/auth/authSlice';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';


const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { itemCount } = useCart();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');
      dispatch(logOut());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${searchKeyword}`);
      setSearchKeyword(''); // Clear input after search
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Nav */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
            FARM FRESH
          </Link>

          {/* 🌐 NAVBAR visible only if user is logged in */}
          {userInfo && (
            <nav className="hidden md:flex items-center space-x-6">
              {/* You can also add role-based routes here */}
              {userInfo.user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600">Admin</Link>
              )}
              {userInfo.user?.role === 'seller' && (
                <>
                <Link to="/seller/products" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Your Products</Link>
                <Link to="/seller/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600">Home</Link>
                <Link to="/seller/add-product" className="text-gray-600 dark:text-gray-300 hover:text-green-600">Add New Product</Link>
                </>
              )}
              {userInfo.user?.role === 'buyer' && (
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600">Dashboard</Link>
              )}
            </nav>
          )}
        </div>

        {/* Search */}
        {userInfo && userInfo.user?.role === 'buyer' && (
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full py-2 pl-4 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>
          )}

        {/* Actions */}
        <div className="flex items-center space-x-5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {/* Cart icon (only if logged in) */}
          {userInfo && userInfo.user?.role === 'buyer' && (
            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              <FiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          )}

          {/* User Info */}
          {userInfo ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-800 dark:text-gray-100 font-medium hidden md:block">
                Hello, {userInfo.user?.name?.split(' ')[0]}
              </span>
              <Link
              to={`/profile/${userInfo.user?.role}`}
              className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition hidden md:inline-block"
            >
              <FiUser size={24} />
            </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

