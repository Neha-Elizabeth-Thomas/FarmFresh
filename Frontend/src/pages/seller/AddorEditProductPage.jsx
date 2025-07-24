import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { FiUploadCloud, FiLoader, FiX } from 'react-icons/fi';

const AddOrEditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [imageFiles, setImageFiles] = useState([]); // State to hold file objects
  const [imagePreviews, setImagePreviews] = useState([]); // State to hold image preview URLs
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  const categories = ['Vegetables', 'Fruits', 'Meat & Poultry', 'Snacks', 'Dairy', 'Fish'];
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${productId}`);
          setFormData({
            product_name: data.product_name,
            description: data.description,
            category: data.category,
            price: data.price,
            quantity: data.quantity,
          });
          // Assuming the backend sends an array of image URLs
          if (data.product_images && Array.isArray(data.product_images)) {
            setImagePreviews(data.product_images);
          }
        } catch (err) {
          setError('Failed to fetch product data.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }

    const newFiles = files.map(file => ({
        file: file,
        preview: URL.createObjectURL(file)
    }));

    setImageFiles(prev => [...prev, ...newFiles.map(f => f.file)]);
    setImagePreviews(prev => [...prev, ...newFiles.map(f => f.preview)]);
  };

  const removeImage = (indexToRemove) => {
    // Revoke the object URL from the preview to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    
    // Append all selected image files
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        submissionData.append('images', file); // Use 'images' to match backend
      });
    }

    try {
      if (isEditMode) {
        await axiosInstance.put(`/products/${productId}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.post('/products', submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      alert("Product added successfully");
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl" /></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleChange} className="w-full p-3 border rounded" required />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white dark:bg-gray-700"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="number" name="quantity" placeholder="Quantity in Stock" value={formData.quantity} onChange={handleChange} className="w-full p-3 border rounded" required />
        </div>
        
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded h-32" required />

        <div>
          <label className="block mb-2 text-sm font-medium">Product Images (up to 5)</label>
          <div className="flex flex-wrap items-center gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md"/>
                <button 
                  type="button" 
                  onClick={() => removeImage(index)} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none hover:bg-red-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <FiUploadCloud className="text-gray-400 text-3xl"/>
                <span className="text-xs text-gray-500 mt-1">Upload</span>
                <input 
                  type="file" 
                  name="product_images" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                />
              </label>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center">
          {loading ? <FiLoader className="animate-spin" /> : (isEditMode ? 'Update Product' : 'Add Product')}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProductPage;
