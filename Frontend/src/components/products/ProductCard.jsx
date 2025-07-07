import React from 'react';
import { FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{product.name}</h3>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < product.rating ? 'fill-current' : ''} />
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-baseline justify-between mt-4">
          <div className="flex items-baseline space-x-2">
            <p className="text-xl font-bold text-green-600">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">₹{product.originalPrice}</p>
            )}
          </div>
          <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-sm font-semibold rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
