import React from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title, products, onViewAll }) => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Ensure products is an array before mapping */}
          {Array.isArray(products) && products.map((product) => (
            // Use product._id for the key, as it's guaranteed to be unique from MongoDB
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button 
            onClick={onViewAll}
            className="px-6 py-2 border border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-colors"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
