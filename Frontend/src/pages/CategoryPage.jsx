import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/common/Pagination';

// --- Mock Data ---
const mockProducts = [
  { id: 1, name: 'Mango Pickle', price: 145, rating: 4.5, reviews: 90, image: 'https://placehold.co/300x300/f0f0f0/333?text=Pickle' },
  { id: 2, name: 'Home made chocolates', price: 180, rating: 4.8, reviews: 150, image: 'https://placehold.co/300x300/f0f0f0/333?text=Chocolate' },
  { id: 3, name: 'Achappam', price: 120, originalPrice: 150, discount: 20, rating: 5, reviews: 200, image: 'https://placehold.co/300x300/f0f0f0/333?text=Achappam' },
  { id: 4, name: 'Rice murukku', price: 240, originalPrice: 260, discount: 8, rating: 4.2, reviews: 70, image: 'https://placehold.co/300x300/f0f0f0/333?text=Murukku' },
  { id: 5, name: 'Lime pickle', price: 180, rating: 4.6, reviews: 110, image: 'https://placehold.co/300x300/f0f0f0/333?text=Lime+Pickle' },
  { id: 6, name: 'Kuzhalappam', price: 130, originalPrice: 160, discount: 19, rating: 4.9, reviews: 180, image: 'https://placehold.co/300x300/f0f0f0/333?text=Kuzhalappam' },
  { id: 7, name: 'Fish Pickle', price: 212, originalPrice: 232, discount: 9, rating: 5, reviews: 250, image: 'https://placehold.co/300x300/f0f0f0/333?text=Fish+Pickle' },
  { id: 8, name: 'Fish Pickle', price: 145, rating: 4.8, reviews: 130, image: 'https://placehold.co/300x300/f0f0f0/333?text=Fish+Pickle' },
  { id: 9, name: 'Fish Pickle', price: 80, rating: 4.5, reviews: 95, image: 'https://placehold.co/300x300/f0f0f0/333?text=Fish+Pickle' },
];

const CategoryPage = () => {
  const { categoryName } = useParams(); // e.g., 'snacks'
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('latest');
  const [filters, setFilters] = useState({});

  // Effect to fetch data when page, sort, or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      // In a real app, you would make an API call here
      // const response = await api.get(`/products?category=${categoryName}&page=${page}&sort=${sortOption}&...filters`);
      console.log(`Fetching for: ${categoryName}, page: ${page}, sort: ${sortOption}, filters:`, filters);
      
      // Simulate API call
      setProducts(mockProducts);
      setTotalProducts(100); // from API response
      setTotalPages(10); // from API response
    };

    fetchProducts();
  }, [categoryName, page, sortOption, filters]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
