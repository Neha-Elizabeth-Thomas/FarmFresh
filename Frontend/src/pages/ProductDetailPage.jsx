import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiChevronLeft, FiChevronRight, FiMinus, FiPlus,FiLoader } from 'react-icons/fi';
import ProductCarousel from '../components/products/ProductCarousel'; // Reusing from homepage
import axiosInstance from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

// --- Sub-Components ---

const ProductImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${mainImage === img ? 'border-green-600' : 'border-transparent'}`}
          />
        ))}
      </div>
      <div className="flex-1">
        <img src={mainImage} alt="Main product" className="w-full h-auto object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart(); // Get the addToCart function from context

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        // Create a product object with the quantity to add to the cart
        const productToAdd = { ...product, quantity };
        addToCart(productToAdd);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.product_name}</h1>
            <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(product.rating || 0) ? 'fill-current' : ''} />)}</div>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{product.rating || 0} ({product.reviewsCount || 0} reviews)</span>
            </div>
            <div className="flex items-baseline space-x-2 mt-4">
                <p className="text-3xl font-bold text-green-600">₹{product.price}/kg</p>
                {/* Add logic for originalPrice and discount if available in your model */}
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
            
            {/* FIX: Removed the 'Select packet size' dropdown as 'sizes' does not exist on the product model */}

            <div className="mt-6">
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total price for the selected qty</p>
                 <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{(product.price * quantity).toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-4 mt-6">
                <div className="flex items-center border border-gray-300 rounded-md"><button onClick={decrement} className="p-3"><FiMinus /></button><span className="px-4 font-semibold">{quantity}</span><button onClick={increment} className="p-3"><FiPlus /></button></div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const ProductTabs = ({ product }) => {
    const [activeTab, setActiveTab] = useState('reviews');

    const tabStyles = "py-2 px-4 font-semibold cursor-pointer border-b-2 transition-colors";
    const activeTabStyles = "border-green-600 text-green-600";
    const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200";

    return (
        <div className="mt-12">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('details')} className={`${tabStyles} ${activeTab === 'details' ? activeTabStyles : inactiveTabStyles}`}>Product Details</button>
                    <button onClick={() => setActiveTab('reviews')} className={`${tabStyles} ${activeTab === 'reviews' ? activeTabStyles : inactiveTabStyles}`}>Rating & Reviews</button>
                    <button onClick={() => setActiveTab('faq')} className={`${tabStyles} ${activeTab === 'faq' ? activeTabStyles : inactiveTabStyles}`}>FAQs</button>
                </nav>
            </div>
            <div className="mt-8">
                {activeTab === 'details' && <div><p>{product.description}</p></div>}
                {activeTab === 'reviews' && <ReviewSection reviews={product.reviews} />}
                {activeTab === 'faq' && <div><p>Frequently Asked Questions content goes here.</p></div>}
            </div>
        </div>
    );
};

const ReviewSection = ({ reviews }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2"><button className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">Latest</button></div>
            <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Write a Review</button>
        </div>
        <div className="space-y-6">
            {reviews && reviews.length > 0 ? reviews.map(review => (
                <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex text-yellow-400 mb-2">{[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} />)}</div>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.user_id.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Posted on {new Date(review.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
            )) : <p>No reviews yet. Be the first to write one!</p>}
        </div>
    </div>
);



// --- Main ProductDetailPage Component ---

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Fetch both main product and related products concurrently
        const [productRes,reviewsRes, relatedRes] = await Promise.all([
          axiosInstance.get(`/products/${productId}`),
          axiosInstance.get(`/products/${productId}/reviews`), 
          axiosInstance.get(`/products/${productId}/related`)
        ]);
        
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        setRelatedProducts(relatedRes.data);

      } catch (err) {
        setError('Failed to fetch product details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Refetch if the productId in the URL changes

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-5xl text-green-600" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${product.category}`} className="hover:text-green-600 capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{product.product_name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Assuming product_image is a single URL, we wrap it in an array */}
        <ProductImageGallery images={product.product_image} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs Section */}
      <ProductTabs product={product} reviews={reviews} />

      {/* Recommended Products Section */}
      <div className="mt-16">
        <ProductCarousel title="You might also like" products={relatedProducts} />
      </div>
    </div>
  );
};


export default ProductDetailPage;
