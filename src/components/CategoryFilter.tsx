import React from 'react';
import { ELECTRONICS_CATEGORIES } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeTab: 'products' | 'services';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  activeTab 
}) => {
  const serviceCategories = ['TV Repair', 'Phone Repair', 'Computer Repair', 'Installation', 'Maintenance'];
  
  const categories = activeTab === 'products' ? ELECTRONICS_CATEGORIES : serviceCategories;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All {activeTab}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};