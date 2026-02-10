import React from 'react';
import Card from '../../common/Card';
import { formatPrice } from '../../../utils/priceHelpers';

const ExpenseSummary = ({ total, count, title = "Total Expenses" }) => {
  return (
    <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
      <div className="text-center">
        <div className="text-sm opacity-90 mb-1">{title}</div>
        <div className="text-3xl font-bold mb-2">
          {formatPrice(total)}
        </div>
        <div className="text-sm opacity-90">
          {count} {count === 1 ? 'expense' : 'expenses'}
        </div>
      </div>
    </Card>
  );
};

export default ExpenseSummary;