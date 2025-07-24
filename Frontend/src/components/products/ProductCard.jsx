import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext'; // Assuming you are using the CartContext

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    // Prevent the Link's navigation from firing when the button is clicked
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Use optional chaining (?.) to prevent errors if a field is missing
  const rating = product?.rating || 0;
  const reviewsCount = product?.reviewsCount || 0;

  return (
    // The entire card is wrapped in a Link, making it navigable
    <Link to={`/product/${product._id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group block">
      <div className="relative">
        <img 
          src={product.product_image[0]} 
          alt={product.product_name} 
          className="w-full h-48 object-cover"
        />
        {/* You can add discount logic here if it exists in your product data */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{product.product_name}</h3>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(rating) ? 'fill-current' : ''} />
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">({reviewsCount} reviews)</span>
        </div>
        <div className="flex items-baseline justify-between mt-4">
          <p className="text-xl font-bold text-green-600">₹{product.price}</p>
          <button 
            onClick={handleAddToCart}
            className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-sm font-semibold rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors z-10 relative"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
