import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import axiosInstance from '../../api/axiosConfig';

const BuyerProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [newAddress, setNewAddress] = useState({
    house: '',
    street: '',
    city: '',
    postOffice: '',
    district: '',
    country: 'India',
    landmark: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/user/profile/');
      setUser(data);
      setForm({ name: data.name, phone: data.phone });
    } catch (err) {
      console.error('Fetch failed:', err);
      alert(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const { data } = await axiosInstance.put('/user/profile/', form);
      setUser(data);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const {data}=await axiosInstance.delete(`/user/address/${addressId}`);
      setUser((prev) => ({
        ...prev,
        deliveryAddress: data.addresses,
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Add address
  const handleAddAddress = async () => {
    try {
      const { data } = await axiosInstance.put('/user/address', {
                                                address: newAddress,
                                                isDefault: newAddress.isDefault,
                                              });

      setUser((prev) => ({
        ...prev,
        deliveryAddress: data.addresses,
      }));

      setNewAddress({ house: '', street: '', city: '', postOffice: '',landmark:'',district:'' });
    } catch (err) {
      alert(err.response?.data?.message || 'Add address failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <FiLoader className="animate-spin text-4xl" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Buyer Profile</h2>

      {/* Personal Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Personal Info</h3>
          <button onClick={() => setEditMode(!editMode)} className="text-sm text-blue-600 flex items-center gap-1">
            <FiEdit /> {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Name"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Phone"
            />
            <button onClick={handleUpdateProfile} className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
          </div>
        ) : (
          <div className="text-gray-700 space-y-1">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-3">Delivery Addresses</h3>
        {user.deliveryAddress?.length > 0 ? (
          user.deliveryAddress.map((addr,index) => (
            <div key={index} className="border p-3 rounded mb-3 flex justify-between items-start">
              <div>
                <p><strong>{addr.house}, {addr.street}</strong></p>
                <p>{addr.landmark && `${addr.landmark}, `}{addr.postOffice}, {addr.city}</p>
                <p>{addr.district}, {addr.country}</p>
                {addr.isDefault && <p className="text-green-600 font-medium">Default Address</p>}
              </div>
              <button
                onClick={() => handleDeleteAddress(index)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No addresses added yet.</p>
        )}

        {/* Add New Address */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="House"
            value={newAddress.house}
            onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="District"
            value={newAddress.district}
            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="postOffice"
            value={newAddress.postOffice}
            onChange={(e) => setNewAddress({ ...newAddress, postOffice: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Landmark"
            value={newAddress.landmark}
            onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
            />
            Set as default
          </label>
          <button
            onClick={handleAddAddress}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            <FiPlus /> Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
