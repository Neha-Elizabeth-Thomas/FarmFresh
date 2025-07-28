import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { FiUsers, FiDollarSign, FiAlertTriangle, FiCheckCircle, FiLoader, FiShoppingCart, FiUserPlus } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Sub-Components for the Dashboard ---

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4`}>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const SalesChart = ({ data }) => {
    // FIX: Update the component to use the new data structure from the backend
    const chartData = data.map(item => ({
        // Format the date for display on the X-axis
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        // Use the totalSales value
        Sales: item.totalSales,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-80">
            <h3 className="font-semibold mb-4">Sales Analytics (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="Sales" fill="#48BB78" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


const ActivityFeed = ({ activity }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-3">
            {activity.orders.map(order => (
                <li key={order._id} className="flex items-center gap-3 text-sm">
                    <FiShoppingCart className="text-blue-500" />
                    <span>
                    New order <span className="font-semibold">#{order._id.slice(-6)}</span> by {order?.user_id?.name || 'Unknown User'}
                    </span>
                </li>
            ))}
            {activity.users.map(user => (
                 <li key={user._id} className="flex items-center gap-3 text-sm">
                    <FiUserPlus className="text-purple-500" />
                    <span>New {user.role} <span className="font-semibold">{user.name}</span> registered</span>
                </li>
            ))}
        </ul>
    </div>
);

// Helper function to safely access nested properties from an object
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part] ?? null, obj);
};


const TopProductsList = ({ products }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">Top Selling Products</h3>
        <ul className="space-y-4">
            {products.map(item => (
                <li key={item._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <img 
                            src={item.productDetails.product_image[0] || 'https://placehold.co/50x50'} 
                            alt={item.productDetails.product_name}
                            className="w-10 h-10 rounded-md object-cover"
                        />
                        <span className="truncate pr-4">{item.productDetails.product_name}</span>
                    </div>
                    <span className="font-bold whitespace-nowrap">{item.totalSold} units sold</span>
                </li>
            ))}
        </ul>
    </div>
);

const TopSellersList = ({ sellers }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">Top Performing Sellers</h3>
        <ul className="space-y-4">
            {sellers.map(item => (
                <li key={item._id} className="flex items-center justify-between text-sm">
                    <div>
                        <p className="font-semibold truncate">{item.sellerDetails.sellerProfile.storeName}</p>
                        <p className="text-xs text-gray-500">{item.sellerDetails.name}</p>
                    </div>
                    <span className="font-bold whitespace-nowrap">
                        ₹{parseFloat(item.totalRevenue.toString()).toLocaleString()}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, detailsRes] = await Promise.all([
                    axiosInstance.get('/admin/stats'),
                    axiosInstance.get('/admin/dashboard-details')
                ]);
                setStats(statsRes.data);
                setDetails(detailsRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full"><FiLoader className="animate-spin text-4xl text-green-500" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Revenue" value={`₹${parseFloat(stats?.totalRevenue || 0).toLocaleString()}`} icon={<FiDollarSign />} color="bg-green-100 text-green-600" />
                <StatCard title="Total Sellers" value={stats?.totalSellers || 0} icon={<FiUsers />} color="bg-blue-100 text-blue-600" />
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<FiUsers />} color="bg-indigo-100 text-indigo-600" />
                <StatCard title="Pending Approvals" value={stats?.pendingSellers || 0} icon={<FiAlertTriangle />} color="bg-yellow-100 text-yellow-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={details?.salesByDay || []} />
                </div>
                <div>
                    <ActivityFeed activity={details?.recentActivity || { orders: [], users: [] }} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <TopProductsList products={details?.topPerformers.products || []} />
                <TopSellersList sellers={details?.topPerformers.sellers || []} />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
