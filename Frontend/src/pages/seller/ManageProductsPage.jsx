import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { FiEdit, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';

// --- Edit Product Modal Component ---
const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData._id, formData);
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="number" name="quantity" placeholder="Stock" value={formData.quantity} onChange={handleChange} className="w-full p-3 border rounded" required />
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">
              {loading ? <FiLoader className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/seller/products');
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      await axiosInstance.put(`/products/${productId}`, updatedData);
      handleCloseEditModal();
      fetchProducts(); // Refetch to show updated data
    } catch (err) {
      alert('Failed to update product.');
      console.error(err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-green-500" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Your Products</h1>
          <Link to="/seller/add-product" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-green-700">
            <FiPlus /> Add New Product
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.product_name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button onClick={() => handleOpenEditModal(product)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          onSave={handleUpdateProduct} 
        />
      )}
    </>
  );
};

export default ManageProductsPage;
