import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiLoader, FiShoppingBag, FiUser, FiMapPin, FiLogOut } from 'react-icons/fi';
import axiosInstance from '../../api/axiosConfig';

// --- Sub-Components with Enhanced Styling ---

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axiosInstance.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><FiLoader className="animate-spin text-2xl text-green-500"/></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">My Orders</h3>
            <div className="space-y-4">
                {orders.length > 0 ? orders.map(order => (
                    <div key={order._id} className="border dark:border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        <div className="border-t dark:border-gray-700 pt-3 mt-3 space-y-3">
                            {order.items.map(item => (
                                <div key={item.product_id._id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={item.product_id.product_image[0] || 'https://placehold.co/50x50'} alt={item.product_id.product_name} className="w-12 h-12 rounded-md object-cover"/>
                                        <span className="text-gray-700 dark:text-gray-300">{item.product_id.product_name} (x{item.quantity})</span>
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-gray-100">₹{parseFloat(item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <p className="font-bold text-lg text-right mt-3 text-gray-800 dark:text-white">Total: ₹{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                    </div>
                )) : <p className="text-gray-500 dark:text-gray-400">You have no past orders.</p>}
            </div>
        </div>
    );
};

const PersonalInfo = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name, phone: user.phone });

    const handleSave = () => {
        onUpdate(form);
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center gap-1">
                    <FiEdit /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Name" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Phone" />
                    <button onClick={handleSave} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Save Changes</button>
                </div>
            ) : (
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
            )}
        </div>
    );
};

const ManageAddresses = ({ addresses, onAdd, onRemove }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Delivery Addresses</h3>
        <div className="space-y-3">
            {addresses?.length > 0 ? (
                addresses.map((addr, index) => (
                    <div key={index} className="border dark:border-gray-700 p-3 rounded-lg flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{addr.house}, {addr.street}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}, {addr.district} - {addr.pincode}</p>
                            {addr.isDefault && <span className="text-xs mt-1 inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Default</span>}
                        </div>
                        <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 transition-colors"><FiTrash2 /></button>
                    </div>
                ))
            ) : <p className="text-gray-500 dark:text-gray-400">No addresses added yet.</p>}
        </div>
        <button onClick={onAdd} className="mt-4 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors">
            <FiPlus /> Add New Address
        </button>
    </div>
);

const AddAddressModal = ({ isOpen, onClose, onSave }) => {
    const [newAddress, setNewAddress] = useState({
        house: '', street: '', city: '', postOffice: '', district: '', landmark: '', isDefault: false,
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(newAddress);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6">Add New Address</h3>
                <form onSubmit={handleSave} className="space-y-3">
                    <input type="text" name="house" placeholder="House/Building No." value={newAddress.house} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
                    <input type="text" name="street" placeholder="Street" value={newAddress.street} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
                    <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
                    <input type="text" name="district" placeholder="District" value={newAddress.district} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
                    <input type="text" name="postOffice" placeholder="Post Office" value={newAddress.postOffice} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
                    <input type="text" name="landmark" placeholder="Landmark (Optional)" value={newAddress.landmark} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" />
                    <label className="flex items-center gap-2"><input type="checkbox" name="isDefault" checked={newAddress.isDefault} onChange={handleChange} /> Set as default</label>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">Save Address</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const BuyerProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/user/profile');
      setUser(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (formData) => {
    try {
      const { data } = await axiosInstance.put('/user/profile', formData);
      setUser(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteAddress = async (addressIndex) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
        // NOTE: This requires a backend endpoint that can handle deletion by index.
        const { data } = await axiosInstance.delete(`/user/address/${addressIndex}`);
        setUser(prev => ({ ...prev, deliveryAddress: data.deliveryAddress }));
    } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddAddress = async (newAddress) => {
    try {
        const { data } = await axiosInstance.put('/user/address', { address: newAddress });
        setUser(prev => ({ ...prev, deliveryAddress: data.deliveryAddress }));
        setIsModalOpen(false); // Close modal on success
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to add address');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-green-500" /></div>
  );

  if (!user) return <div className="text-center p-8 text-red-500">Could not load user profile.</div>;

  const TabButton = ({ name, label, icon }) => (
    <button 
        onClick={() => setActiveTab(name)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${activeTab === name ? 'bg-green-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-2">
                            <TabButton name="profile" label="My Profile" icon={<FiUser />} />
                            <TabButton name="orders" label="My Orders" icon={<FiShoppingBag />} />
                            <TabButton name="addresses" label="Manage Addresses" icon={<FiMapPin />} />
                            <hr className="my-2 dark:border-gray-700" />
                            <TabButton name="logout" label="Logout" icon={<FiLogOut />} />
                        </div>
                    </aside>
                    <main className="lg:col-span-3 space-y-6">
                        {activeTab === 'profile' && <PersonalInfo user={user} onUpdate={handleUpdateProfile} />}
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'addresses' && <ManageAddresses addresses={user.deliveryAddress} onAdd={() => setIsModalOpen(true)} onRemove={handleDeleteAddress} />}
                    </main>
                </div>
            </div>
        </div>
        <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddAddress} />
    </>
  );
};

export default BuyerProfilePage;
