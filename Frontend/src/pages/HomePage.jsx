import React from 'react';
import { Link } from 'react-router-dom';
import ProductCarousel from '../components/products/ProductCarousel';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaCarrot, FaFish, FaDrumstickBite, FaCookieBite, FaAppleAlt ,FaCheese} from 'react-icons/fa';
import Basket from '../assets/images/Basket.jpg'; 


// --- Mock Data ---
const mustBuyProducts = [
  { id: 1, name: 'Rice', price: 129, rating: 4, reviews: 88, image: 'https://placehold.co/300x300/f0f0f0/333?text=Rice' },
  { id: 2, name: 'Homemade Lime Pickle', price: 240, originalPrice: 280, discount: 14, rating: 5, reviews: 120, image: 'https://placehold.co/300x300/f0f0f0/333?text=Pickle' },
  { id: 3, name: 'Organic Molasses', price: 180, rating: 4, reviews: 95, image: 'https://placehold.co/300x300/f0f0f0/333?text=Molasses' },
  { id: 4, name: 'Green Chillies', price: 130, originalPrice: 150, discount: 13, rating: 4, reviews: 75, image: 'https://placehold.co/300x300/f0f0f0/333?text=Chillies' },
];

const bestSellerProducts = [
  { id: 5, name: 'Apple', price: 212, originalPrice: 222, discount: 4, rating: 5, reviews: 250, image: 'https://placehold.co/300x300/f0f0f0/333?text=Apple' },
  { id: 6, name: 'Oranges', price: 145, rating: 4, reviews: 180, image: 'https://placehold.co/300x300/f0f0f0/333?text=Oranges' },
  { id: 7, name: 'Egg (Nutri)', price: 80, rating: 5, reviews: 300, image: 'https://placehold.co/300x300/f0f0f0/333?text=Egg' },
  { id: 8, name: 'Tomatoes', price: 210, rating: 4, reviews: 150, image: 'https://placehold.co/300x300/f0f0f0/333?text=Tomatoes' },
];

const testimonials = [
    { id: 1, name: 'Sarah M.', text: 'Amazing quality and fast delivery!', rating: 5 },
    { id: 2, name: 'Alex K.', text: 'My go-to for fresh produce.', rating: 5 },
    { id: 3, name: 'James L.', text: 'The best organic vegetables I have ever had.', rating: 5 },
];


// --- Sub-Components for HomePage ---

const HeroSection = () => (
  <section className="bg-white dark:bg-gray-700">
    <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 items-center gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          From Your Neighborhood to Your Home
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Connecting local farmers and neighborhood stores with fresh produce. See what's new in your area.
        </p>
        <button className="mt-8 px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-colors">
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
);

const CategoryBar = () => {
    const categories = ['Veggies', 'Fruits', 'Poultry', 'Snacks', 'Meat', 'Fish'];
    return (
        <section className="bg-green-600">
            <div className="container mx-auto px-4">
                <div className="flex justify-around py-4">
                    {categories.map(cat => (
                        <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="text-white font-semibold hover:text-green-200 transition-colors">
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
            <div
              key={label}
              className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-64 h-40"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-semibold">{label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomerTestimonials = () => (
  <section className="py-12 bg-gray-50 dark:bg-gray-700 transition-colors">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Happy Customers</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            <FiChevronLeft className="text-gray-700 dark:text-gray-200" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            <FiChevronRight className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="fill-current" />)}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.text}"</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// --- Main HomePage Component ---

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategoryBar />
      <ProductCarousel title="Must Buy" products={mustBuyProducts} />
      <ProductCarousel title="Best Sellers" products={bestSellerProducts} />
      <BrowseByCategory />
      <CustomerTestimonials />
    </div>
  );
};

export default HomePage;
