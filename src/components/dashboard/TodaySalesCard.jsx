import React from 'react';
import Card from '../../common/Card';
import { formatPrice } from '../../../utils/priceHelpers';

const TodaySalesCard = ({ totalSales, totalOrders, loading }) => {
  return (
    <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold opacity-90">Today's Sales</h3>
        <span className="text-3xl">💰</span>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          <div className="text-3xl font-bold mb-2">
            {formatPrice(totalSales)}
          </div>
          <div className="text-sm opacity-90">
            {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} completed
          </div>
        </div>
      )}
    </Card>
  );
};

export default TodaySalesCard;