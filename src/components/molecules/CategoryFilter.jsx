import React from 'react';
import Button from '@/components/atoms/Button';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value || category}
          onClick={() => onSelectCategory(category.value || category)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            ${selectedCategory === (category.value || category)
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.icon && <span className="mr-1">{category.icon}</span>}
          {category.label || category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;