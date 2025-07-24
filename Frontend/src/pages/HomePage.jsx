import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCarousel from '../components/products/ProductCarousel';
import { FiStar, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import { FaCarrot, FaFish, FaDrumstickBite, FaCookieBite, FaAppleAlt ,FaCheese} from 'react-icons/fa';
import Basket from '../assets/images/Basket.jpg'; 
import axiosInstance from '../api/axiosConfig';

// --- Sub-Components for HomePage ---

const HeroSection = ({ scrollToRef }) => {
  const handleShopNowClick = () => {
    // Smoothly scroll to the element referenced by the ref
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return(
  <section className="bg-white dark:bg-gray-700">
    <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 items-center gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          From Your Neighborhood to Your Home
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Connecting local farmers and neighborhood stores with fresh produce. See what's new in your area.
        </p>
        <button 
          onClick={handleShopNowClick}
          className="mt-8 px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-colors">
          Shop Now
        </button>
        <div className="mt-10 flex justify-center md:justify-start space-x-8 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">200+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Local Farmers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">2,000+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">High Quality Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">30,000+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Happy Customers</p>
          </div>
        </div>
      </div>
      <div>
        <img src={Basket} alt="Basket of fresh vegetables" className="w-full h-auto rounded-lg"/>
      </div>
    </div>
  </section>
  )
};

const CategoryBar = () => {
    const categories = ['Vegetables', 'Fruits', 'Meat & Poultry', 'Snacks', 'Dairy', 'Fish'];
    return (
        <section className="bg-green-600">
            <div className="container mx-auto px-4">
                <div className="flex justify-around py-4">
                    {categories.map(cat => (
                        <Link key={cat} to={`/category/${cat}`} className="text-white font-semibold hover:text-green-200 transition-colors">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

const categories = [
  { label: 'Vegetables', icon: <FaCarrot className="text-orange-500" /> },
  { label: 'Meat & Poultry', icon: <FaDrumstickBite className="text-red-600" /> },
  { label: 'Fish', icon: <FaFish className="text-blue-500" /> },
  { label: 'Snacks', icon: <FaCookieBite className="text-yellow-600" /> },
  { label: 'Fruits', icon: <FaAppleAlt className="text-red-500" /> },
  { label: 'Dairy', icon: <FaCheese className="text-yellow-500" /> }
];

const BrowseByCategory = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Browse By Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {categories.map(({ label, icon }) => (
            <Link
              to={`/category/${label.toLowerCase()}`}
              key={label}
              className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-64 h-40"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-semibold">{label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomerTestimonials = ({ testimonials }) => (
  <section className="py-12 bg-gray-50 dark:bg-gray-700 transition-colors">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Happy Customers</h2>
        <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"><FiChevronLeft /></button>
            <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"><FiChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(review => (
          <div key={review._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(review.rating)].map((_, i) => <FiStar key={i} className="fill-current" />)}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">"{review.comment}"</p>
            {/* Accessing populated user name */}
            <p className="font-semibold text-gray-800 dark:text-gray-100">{review.user_id.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// --- Main HomePage Component ---

const HomePage = () => {
  const [homepageData, setHomepageData] = useState({
    mustBuy: [],
    bestSellers: [],
    topRated: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        // Use Promise.all to fetch all data concurrently for better performance
        const [productsRes, reviewsRes, topRatedRes] = await Promise.all([
          axiosInstance.get('/products/homepage'),
          axiosInstance.get('products/homepage/reviews'),
          axiosInstance.get('/products/top'), // Fetching top-rated products
        ]);
        
        setHomepageData({
          mustBuy: productsRes.data.mustBuy,
          bestSellers: productsRes.data.bestSellers,
          testimonials: reviewsRes.data,
          topRated: topRatedRes.data,
        });

      } catch (err) {
        setError('Could not fetch homepage data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []); // Empty dependency array ensures this runs only once

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div>
      <HeroSection scrollToRef={productSectionRef}/>
      <CategoryBar />
      
      <div ref={productSectionRef}>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <FiLoader className="animate-spin text-5xl text-green-600" />
        </div>
      ) : (
        <>
          <ProductCarousel title="Must Buy" products={homepageData.mustBuy} onViewAll={() => navigate('/products?isMustBuy=true')}/>
          <ProductCarousel title="Best Sellers" products={homepageData.bestSellers} onViewAll={() => navigate('/products?isBestSeller=true')}/>
          <BrowseByCategory />
          <CustomerTestimonials testimonials={homepageData.testimonials} />
          <ProductCarousel title="Top Rated Products" products={homepageData.topRated} />
        </>
      )}
      </div>
    </div>
  );
};

export default HomePage;
