import React from 'react';

const EXPENSE_CATEGORIES = {
  all: { name: 'All', icon: '📋', color: 'neutral' },
  ingredients: { name: 'Ingredients', icon: '🥬', color: 'green' },
  utilities: { name: 'Utilities', icon: '💡', color: 'yellow' },
  supplies: { name: 'Supplies', icon: '📦', color: 'blue' },
  transportation: { name: 'Transportation', icon: '🚗', color: 'purple' },
  miscellaneous: { name: 'Miscellaneous', icon: '📝', color: 'gray' }
};

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-2">
        Category
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
              ${selectedCategory === key
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;