import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';
import ProductCarousel from '../components/products/ProductCarousel'; // Reusing from homepage

// --- Mock Data ---
const productData = {
  id: 'prod123',
  name: 'Organic Onion',
  images: [
    'https://placehold.co/500x500/f0f0f0/333?text=Onion+1',
    'https://placehold.co/500x500/e0e0e0/333?text=Onion+2',
    'https://placehold.co/500x500/d0d0d0/333?text=Onion+3',
    'https://placehold.co/500x500/c0c0c0/333?text=Onion+4',
  ],
  price: 260,
  originalPrice: 300,
  discount: 13,
  rating: 4.5,
  reviewsCount: 151,
  description: 'Organic Onion straight from the farms. Freshly picked and packed with care to bring you the best quality.',
  sizes: ['500g', '1kg', '2kg'],
  reviews: [
    { id: 1, name: 'Samantha D.', date: 'August 16, 2023', rating: 5, comment: 'Absolutely fresh and amazing quality. Will buy again!' },
    { id: 2, name: 'Alex M.', date: 'August 16, 2023', rating: 5, comment: 'Great value for money. The onions were crisp.' },
    { id: 3, name: 'Ethan R.', date: 'August 16, 2023', rating: 4, comment: 'Good quality, but delivery was a bit late.' },
    { id: 4, name: 'Olivia P.', date: 'August 15, 2023', rating: 5, comment: 'Perfect for my daily cooking. Highly recommended.' },
    { id: 5, name: 'Liam K.', date: 'August 15, 2023', rating: 4, comment: 'They are good, fresh as described.' },
    { id: 6, name: 'Ava H.', date: 'August 15, 2023', rating: 5, comment: 'Best organic onions I have found online.' },
  ],
};

const recommendedProducts = [
    { id: 5, name: 'Organic Potato', price: 180, rating: 4, reviews: 112, image: 'https://placehold.co/300x300/f0f0f0/333?text=Potato' },
    { id: 6, name: 'Organic Tomato', price: 210, rating: 5, reviews: 210, image: 'https://placehold.co/300x300/f0f0f0/333?text=Tomato' },
    { id: 7, name: 'Organic Garlic', price: 350, rating: 5, reviews: 180, image: 'https://placehold.co/300x300/f0f0f0/333?text=Garlic' },
    { id: 8, name: 'Organic Ginger', price: 400, rating: 4, reviews: 95, image: 'https://placehold.co/300x300/f0f0f0/333?text=Ginger' },
];


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

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.name}</h1>
            <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(product.rating) ? 'fill-current' : ''} />)}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{product.rating} ({product.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-baseline space-x-2 mt-4">
                <p className="text-3xl font-bold text-green-600">₹{product.price}/kg</p>
                <p className="text-xl text-gray-400 line-through">₹{product.originalPrice}</p>
                <span className="text-sm font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-md">{product.discount}% OFF</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
            
            <div className="mt-6">
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select the packet size</label>
                <select id="size-select" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {product.sizes.map(size => <option key={size}>{size}</option>)}
                </select>
            </div>

            <div className="mt-6">
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total price for the selected qty</p>
                 <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{(product.price * quantity).toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-4 mt-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                    <button onClick={decrement} className="p-3"><FiMinus /></button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button onClick={increment} className="p-3"><FiPlus /></button>
                </div>
                <button className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
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
            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">Latest</button>
                <button className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">Filter</button>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Write a Review</button>
        </div>
        <div className="space-y-6">
            {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} />)}
                        </div>
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Posted on {review.date}</p>
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
            ))}
        </div>
        <div className="text-center mt-8">
            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">Load More Reviews</button>
        </div>
    </div>
);


// --- Main ProductDetailPage Component ---

const ProductDetailPage = () => {
  const { productId } = useParams();
  // In a real app, you'd fetch product data based on productId
  const product = productData; 

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/category/veggies" className="hover:text-green-600">Veggies</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductImageGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs Section */}
      <ProductTabs product={product} />

      {/* Recommended Products Section */}
      <div className="mt-16">
        <ProductCarousel title="You might also like" products={recommendedProducts} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
