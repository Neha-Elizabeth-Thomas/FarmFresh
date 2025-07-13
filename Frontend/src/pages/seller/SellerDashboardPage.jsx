import React from 'react';
import { FiBox, FiDollarSign, FiShoppingCart, FiMoreVertical, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// --- Mock Data (Consistent with your schemas) ---
const dashboardStats = {
  totalOrders: { value: 400, change: 14 },
  totalSell: { value: 4250000, change: -8 }, // Stored in paise/cents, formatted to Lakhs
  totalProducts: { value: 452, change: 25 },
};

const orderSummaryData = {
  pending: 160,
  shipped: 120,
  delivered: 120,
  total: 400,
};

const recentOrders = [
  { _id: 'SB001', user_id: { name: 'Rohan S.' }, items: [{ product_name: 'Organic Apples', quantity: '500 KG' }], total_amount: 20000, shippingAddress: { city: 'Mumbai' }, created_at: '7 days ago', status: 'pending' },
  { _id: 'SB002', user_id: { name: 'Priya M.' }, items: [{ product_name: 'Fresh Mangoes', quantity: '300 KG' }], total_amount: 15000, shippingAddress: { city: 'Delhi' }, created_at: '5 days ago', status: 'pending' },
  { _id: 'SB003', user_id: { name: 'Amit K.' }, items: [{ product_name: 'Basmati Rice', quantity: '800 KG' }], total_amount: 40000, shippingAddress: { city: 'Bangalore' }, created_at: '3 days ago', status: 'pending' },
];

const yourProducts = [
    { _id: 'PROD001', product_name: 'Organic Apples', category: 'Fruits', quantity: 500, price: 20, mfg_date: '2023-06-01', exp_date: '2023-08-01' },
    { _id: 'PROD002', product_name: 'Fresh Mangoes', category: 'Fruits', quantity: 300, price: 20, mfg_date: '2023-07-01', exp_date: '2023-07-20' },
    { _id: 'PROD003', product_name: 'Basmati Rice', category: 'Grains', quantity: 800, price: 20, mfg_date: '2023-01-01', exp_date: '2024-01-01' },
];


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
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <main className="p-6 space-y-6">
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Orders" value={dashboardStats.totalOrders.value} change={dashboardStats.totalOrders.change} icon={<FiShoppingCart size={24}/>} />
                    <StatCard title="Total Sell" value={dashboardStats.totalSell.value} change={dashboardStats.totalSell.change} icon={<FiDollarSign size={24}/>} isCurrency={true} />
                    <StatCard title="Total Products" value={dashboardStats.totalProducts.value} change={dashboardStats.totalProducts.change} icon={<FiBox size={24}/>} />
                </div>
                {/* Mid-level Summaries */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1"><OrderSummaryCard data={orderSummaryData} /></div>
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold">Payment Summary</h3>
                        {/* Placeholder for chart */}
                        <div className="h-48 mt-4 bg-gray-100 dark:bg-gray-700 rounded flex items-end justify-around p-4">
                            <div className="w-12 bg-green-400" style={{height: '80%'}}></div>
                            <div className="w-12 bg-green-400" style={{height: '95%'}}></div>
                            <div className="w-12 bg-green-400" style={{height: '60%'}}></div>
                        </div>
                    </div>
                </div>
                {/* Data Tables */}
                <RecentOrdersTable orders={recentOrders} />
                {/* You would add the "Your Products" table here */}
            </main>
        </div>
    );
};

export default SellerDashboardPage;
