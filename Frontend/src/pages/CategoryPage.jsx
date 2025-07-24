import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/common/Pagination';
import axiosInstance from '../api/axiosConfig';
import { FiLoader } from 'react-icons/fi';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation(); // To read query params like ?filter=mustBuy

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('latest');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch data whenever page, sort, or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construct query parameters for the API call
        const params = new URLSearchParams(location.search);
        params.append('page', page);
        params.append('sort', sortOption);
        
        // Add category from URL path if it's not a generic 'all' page
        if (categoryName !== 'all') {
            params.append('category', categoryName);
        }

        // Add filters from the sidebar state
        Object.keys(filters).forEach(key => {
            if (filters[key]) { // Ensure we don't send empty filter values
                params.append(key, filters[key]);
            }
        });

        // Make the API call
        const { data } = await axiosInstance.get('/products', { params });
        
        // Update state with the response from the backend
        setProducts(data.products);
        setTotalProducts(data.total);
        setTotalPages(data.pages);

      } catch (err) {
        setError('Could not fetch products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, page, sortOption, filters, location.search]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{categoryName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <main className="w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white capitalize mb-4 md:mb-0">{categoryName}</h1>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Showing {products.length} of {totalProducts} Products
              </p>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="latest">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-5xl text-green-600" /></div>
          ) : error ? (
            <p className="col-span-full text-center text-red-500">{error}</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="col-span-full text-center text-gray-500 py-16">No products found matching your criteria.</p>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
