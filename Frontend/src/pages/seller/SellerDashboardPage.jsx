import React, { useEffect, useState } from 'react';
import { FiBox, FiDollarSign, FiShoppingCart, FiMoreVertical, FiArrowUp, FiArrowDown, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

// --- Sub-Components --

const StatCard = ({ title, value, change, icon, isCurrency = false }) => {
    const formattedValue = isCurrency ? `₹${(value / 100000).toFixed(1)}L` : value;
    const isPositive = change >= 0;
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{formattedValue}</p>
                    <div className={`flex items-center text-sm mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <FiArrowUp /> : <FiArrowDown />}
                        <span className="ml-1">{Math.abs(change)}% vs last month</span>
                    </div>
                </div>
                <div className="text-gray-400">{icon}</div>
            </div>
            {/* A placeholder for the mini chart */}
            <div className="h-12 mt-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
    );
};

const OrderSummaryCard = ({ data }) => {
    const pendingPercent = (data.pending / data.total) * 100;
    const shippedPercent = (data.shipped / data.total) * 100;
    const deliveredPercent = (data.delivered / data.total) * 100;
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1"><p>Pending Orders</p><p>{data.pending}/{data.total}</p></div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${pendingPercent}%` }}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1"><p>Shipped Orders</p><p>{data.shipped}/{data.total}</p></div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${shippedPercent}%` }}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1"><p>Delivered Orders</p><p>{data.delivered}/{data.total}</p></div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${deliveredPercent}%` }}></div></div>
                </div>
            </div>
        </div>
    );
};

const RecentOrdersTable = ({ orders }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">Buy Requests (Recent Orders)</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">Quantity</th>
                        <th scope="col" className="px-6 py-3">Total Amount</th>
                        <th scope="col" className="px-6 py-3">Delivery Location</th>
                        <th scope="col" className="px-6 py-3">Timeline</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order._id}</td>
                            <td className="px-6 py-4">{order.items[0].product_name}</td>
                            <td className="px-6 py-4">{order.items[0].quantity}</td>
                            <td className="px-6 py-4">₹{(order.total_amount / 100).toFixed(2)}</td>
                            <td className="px-6 py-4">{order.shippingAddress.city}</td>
                            <td className="px-6 py-4">{order.created_at}</td>
                            <td className="px-6 py-4 flex gap-2">
                                <button className="font-medium text-red-600 hover:underline">Decline</button>
                                <button className="font-medium text-green-600 hover:underline">Accept</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- Main SellerDashboardPage Component ---

const SellerDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/orders/seller');
                setDashboardData(data);
            } catch (err) {
                setError('Failed to load dashboard data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><FiLoader className="animate-spin text-5xl text-green-600" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
            {/* You can add a dedicated DashboardHeader component here */}
            <main className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Orders" value={dashboardData.stats.totalOrders.value} change={dashboardData.stats.totalOrders.change} icon={<FiShoppingCart size={24}/>} />
                    <StatCard title="Total Sell" value={dashboardData.stats.totalSell.value} change={dashboardData.stats.totalSell.change} icon={<FiDollarSign size={24}/>} isCurrency={true} />
                    <StatCard title="Total Products" value={dashboardData.stats.totalProducts.value} change={dashboardData.stats.totalProducts.change} icon={<FiBox size={24}/>} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1"><OrderSummaryCard data={dashboardData.orderSummary} /></div>
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold">Payment Summary</h3>
                        <div className="h-48 mt-4 bg-gray-100 dark:bg-gray-700 rounded flex items-end justify-around p-4">
                            <div className="w-12 bg-green-400" style={{height: '80%'}}></div>
                            <div className="w-12 bg-green-400" style={{height: '95%'}}></div>
                            <div className="w-12 bg-green-400" style={{height: '60%'}}></div>
                        </div>
                    </div>
                </div>
                <RecentOrdersTable orders={dashboardData.recentOrders} />
                {/* Add the "Your Products" table here, passing `dashboardData.yourProducts` */}
            </main>
        </div>
    );
};


export default SellerDashboardPage;
