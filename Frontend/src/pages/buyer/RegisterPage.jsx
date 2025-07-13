import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/images/login_illustration.jpg'; 
import axiosInstance from '../../api/axiosConfig';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/user/register/buyer', {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      // On successful registration, redirect to login page
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Failed to register:', err);
      setMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const RegisterIllustration = () => (
    <img 
      src={loginIllustration}
      alt="Farm Fresh Registration Illustration"
      className="w-full h-auto"
    />
  );

  return (
    <div className="min-h-[calc(100vh-150px)] bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        <div className="hidden lg:flex justify-center">
          <RegisterIllustration />
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 transform -skew-y-6 rounded-lg z-0"></div>
            <div className="relative bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg z-10">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
                Welcome! Register here
              </h2>
              {message && <p className="text-center text-red-500 mb-4">{message}</p>}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-green-600 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
