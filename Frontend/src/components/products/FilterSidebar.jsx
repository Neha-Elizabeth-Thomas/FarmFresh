import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories(prev => 
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  // Mock sub-categories for the "Snacks" category from your design
  const subCategories = ['Chocolates', 'Pickles', 'Kerala snacks', 'Spicy', 'Sweet'];

  return (
    <aside className="w-full lg:w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</h3>
        <ul className="space-y-2">
          {subCategories.map(cat => (
            <li key={cat}>
              <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <input 
                  type="checkbox" 
                  value={cat}
                  onChange={handleCategoryChange}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span>{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Price</h3>
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
          <span>₹{priceRange.min}</span>
          <span>₹{priceRange.max}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <button 
        onClick={handleApplyFilters}
        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
      >
        Apply Filter
      </button>
    </aside>
  );
};

export default FilterSidebar;
