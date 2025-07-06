import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import loginIllustration from '../assets/images/login_illustration.jpg'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // Default role
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The backend login logic currently only uses email and password.
      // The 'role' field is included here for UI purposes as per the design.
      console.log("Attempting to log in with:", { email, password, role });
      
      const mockUserData = {
        user: { name: 'John Doe', email: email, role: role },
        token: 'mock-jwt-token-12345'
      };

      dispatch(setCredentials(mockUserData));
      navigate('/');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };




  return (
    <div className="min-h-[calc(100vh-150px)] bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex justify-center">
        <div className="rounded-full overflow-hidden shadow-lg">
          <img 
            src={loginIllustration}
            alt="Farm Fresh Illustration"
            className="w-full h-full object-cover"
          />    
        </div>
      </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 transform -skew-y-6 rounded-lg z-0"></div>
            <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg z-10">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
                Hello! Log in to get started
              </h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {/* Role Dropdown */}
                <div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Login
                  </button>
                </div>
              </form>
              <div className="text-center mt-6">
                <Link to="/forgot-password" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Forgot Password?
                </Link>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                New User? <Link to="/register-buyer" className="font-semibold text-green-600 hover:underline">Sign up here</Link>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                New Seller? <Link to="/register-seller" className="font-semibold text-green-600 hover:underline">Sign up here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
