import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddOrEditProductPage = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return alert('You can only upload up to 5 images');
    setImages(files);
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission will be handled by Redux later
    alert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
    navigate('/seller/products');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      alert('Product deleted successfully!');
      navigate('/seller/products');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-2xl rounded-2xl dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-4">
          <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="Product Name" required className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required rows={4} className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>

          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" required className="w-full p-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="col-span-1 space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Product Images (Max 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full p-2 border-2 border-gray-300 dark:border-gray-700 rounded-xl" />

          <div className="flex flex-wrap gap-4">
            {preview.map((src, i) => (
              <img key={i} src={src} alt="preview" className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600" />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200">
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
            {isEdit && (
              <button type="button" onClick={handleDelete} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200">
                Delete Product
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditProductPage;
