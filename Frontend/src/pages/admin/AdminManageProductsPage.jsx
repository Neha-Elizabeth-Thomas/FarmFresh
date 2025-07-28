import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { FiLoader, FiSearch, FiStar, FiTag } from 'react-icons/fi';

// A custom toggle switch component for a modern UI
const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
    </label>
);

const AdminManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '' });

    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams(filters);
            const { data } = await axiosInstance.get('/products/', { params });
            setProducts(data.products);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => fetchProducts(), 500); // Debounce search
        return () => clearTimeout(handler);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFlagChange = async (productId, flag, value) => {
        try {
            // Optimistically update the UI
            setProducts(prev => prev.map(p => p._id === productId ? { ...p, [flag]: value } : p));
            // Make the API call
            await axiosInstance.put(`/products/${productId}/flags`, { [flag]: value });
        } catch (error) {
            console.error(`Failed to update ${flag}`, error);
            // Revert UI on error if needed
            fetchProducts(); 
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><FiLoader className="animate-spin text-4xl text-green-500" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage All Products</h1>
            
            {/* Filter Section */}
            <div className="mb-6 flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <input type="text" name="search" placeholder="Search by name..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 border rounded dark:bg-gray-700" />
                <input type="text" name="category" placeholder="Filter by category..." value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded dark:bg-gray-700" />
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Seller</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-center">Must Buy</th>
                            <th className="px-6 py-3 text-center">Best Seller</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium">{product.product_name}</td>
                                <td className="px-6 py-4">{product.seller_id?.name || 'N/A'}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4 text-center">
                                    <ToggleSwitch checked={product.isMustBuy} onChange={(e) => handleFlagChange(product._id, 'isMustBuy', e.target.checked)} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <ToggleSwitch checked={product.isBestSeller} onChange={(e) => handleFlagChange(product._id, 'isBestSeller', e.target.checked)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManageProductsPage;
