import React from 'react';
import Card from '../../common/Card';
import { formatPrice } from '../../../utils/priceHelpers';
import { format } from 'date-fns';

const EXPENSE_CATEGORIES = {
  ingredients: { name: 'Ingredients', icon: '🥬', color: 'green' },
  utilities: { name: 'Utilities', icon: '💡', color: 'yellow' },
  supplies: { name: 'Supplies', icon: '📦', color: 'blue' },
  transportation: { name: 'Transportation', icon: '🚗', color: 'purple' },
  miscellaneous: { name: 'Miscellaneous', icon: '📝', color: 'gray' }
};

const ExpenseCard = ({ expense, onDelete }) => {
  const category = EXPENSE_CATEGORIES[expense.category];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{category.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-neutral-800">
              {expense.description}
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              {category.name} • {format(new Date(expense.date), 'h:mm a')}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="font-bold text-primary-600 text-lg">
            {formatPrice(expense.amount)}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="Delete expense"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;