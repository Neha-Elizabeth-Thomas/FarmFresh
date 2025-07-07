import React, { useState, useEffect } from 'react';

const BuyerProfilePage = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryAddress: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        deliveryAddress: user.deliveryAddress || [],
      });
    }
  }, [user]);

  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      const updatedAddress = [...formData.deliveryAddress];
      updatedAddress[index][field] = e.target.value;
      setFormData({ ...formData, deliveryAddress: updatedAddress });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Buyer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Delivery Address</h3>
          {formData.deliveryAddress.map((addr, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="House"
                value={addr.house}
                onChange={(e) => handleChange(e, index, 'house')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Street"
                value={addr.street}
                onChange={(e) => handleChange(e, index, 'street')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="City"
                value={addr.city}
                onChange={(e) => handleChange(e, index, 'city')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Post Office"
                value={addr.postOffice}
                onChange={(e) => handleChange(e, index, 'postOffice')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="District"
                value={addr.district}
                onChange={(e) => handleChange(e, index, 'district')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Landmark"
                value={addr.landmark}
                onChange={(e) => handleChange(e, index, 'landmark')}
                className="rounded-md bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default BuyerProfilePage;
