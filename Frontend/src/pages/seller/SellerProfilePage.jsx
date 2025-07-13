import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig'; // Adjust the import if using axiosInstance
import { FiEdit, FiSave, FiLoader,FiXCircle } from 'react-icons/fi';

const SellerProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/user/profile');
        setUser(data);
        setForm(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (section, field, value) => {
    if (section === 'sellerProfile') {
      setForm((prev) => ({
        ...prev,
        sellerProfile: {
          ...prev.sellerProfile,
          [field]: value,
        },
      }));
    } else if (section === 'bankDetails') {
      setForm((prev) => ({
        ...prev,
        sellerProfile: {
          ...prev.sellerProfile,
          bankDetails: {
            ...prev.sellerProfile.bankDetails,
            [field]: value,
          },
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        sellerProfile: {
          storeName: form.sellerProfile.storeName,
          storeDescription: form.sellerProfile.storeDescription,
          address: form.sellerProfile.address,
          deliveryAreas: form.sellerProfile.deliveryAreas,
          gstNumber: form.sellerProfile.gstNumber,
          bankDetails: form.sellerProfile.bankDetails,
        },
      };

      const { data } = await axios.put('/user/profile', payload);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setUser((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Error updating profile');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl" /></div>;

  if (!user) return <div className="text-center text-red-600">Failed to load profile.</div>;

  const { name, email, phone, role, sellerProfile } = form;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        <button onClick={() => (editing ? handleSubmit() : setEditing(true))} className="text-green-600 flex items-center gap-2">
          {editing ? <><FiSave /> Save</> : <><FiEdit /> Edit</>}
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}

      {/* Verification Status */}
      <div className="flex items-center gap-2 text-lg">
        {sellerProfile.isVerified ? (
          <span className="flex items-center text-green-600"><FiCheckCircle /> Verified</span>
        ) : (
          <span className="flex items-center text-yellow-500"><FiXCircle /> Not Verified</span>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-2">
        <label>Name</label>
        <input
          type="text"
          disabled={!editing}
          value={name}
          onChange={(e) => handleChange('basic', 'name', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>Email</label>
        <input
          type="email"
          disabled={!editing}
          value={email}
          onChange={(e) => handleChange('basic', 'email', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>Phone</label>
        <input
          type="tel"
          disabled={!editing}
          value={phone}
          onChange={(e) => handleChange('basic', 'phone', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
      </div>

      {/* Seller Profile */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold mt-6">Store Details</h3>
        <label>Store Name</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.storeName}
          onChange={(e) => handleChange('sellerProfile', 'storeName', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>Store Description</label>
        <textarea
          disabled={!editing}
          value={sellerProfile.storeDescription}
          onChange={(e) => handleChange('sellerProfile', 'storeDescription', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>GST Number</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.gstNumber}
          onChange={(e) => handleChange('sellerProfile', 'gstNumber', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>Delivery Areas (comma separated)</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.deliveryAreas.join(', ')}
          onChange={(e) =>
            handleChange('sellerProfile', 'deliveryAreas', e.target.value.split(',').map(s => s.trim()))
          }
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
      </div>

      {/* Gov ID Proof */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Govt ID Proof</h3>
        {sellerProfile.govIDProofURL ? (
          <a
            href={sellerProfile.govIDProofURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            View Uploaded ID Proof
          </a>
        ) : (
          <p className="text-gray-500">No ID Proof Uploaded</p>
        )}
      </div>

      {/* Bank Details */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold mt-6">Bank Details</h3>
        <label>Account Number</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.bankDetails?.accountNumber || ''}
          onChange={(e) => handleChange('bankDetails', 'accountNumber', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>IFSC Code</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.bankDetails?.ifscCode || ''}
          onChange={(e) => handleChange('bankDetails', 'ifscCode', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />

        <label>UPI ID</label>
        <input
          type="text"
          disabled={!editing}
          value={sellerProfile.bankDetails?.upiId || ''}
          onChange={(e) => handleChange('bankDetails', 'upiId', e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
      </div>
    </div>
  );
};

export default SellerProfilePage;
