import React from 'react';
import Card from '../common/Card';
import { formatPrice } from '../../utils/priceHelpers';

const QuickStats = ({ stats, loading }) => {
  const statCards = [
    {
      icon: '💰',
      label: 'Sales Today',
      value: formatPrice(stats.total_sales || 0),
      color: 'text-primary-600'
    },
    {
      icon: '📊',
      label: 'Total Orders',
      value: stats.total_orders || 0,
      color: 'text-neutral-700'
    },
    {
      icon: '💸',
      label: 'Expenses',
      value: formatPrice(stats.total_expenses || 0),
      color: 'text-neutral-700'
    },
    {
      icon: stats.profit >= 0 ? '📈' : '📉',
      label: 'Profit/Loss',
      value: formatPrice(stats.profit || 0),
      color: stats.profit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.profit >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className={`text-center ${stat.bgColor || ''}`}>
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold font-display ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-neutral-600">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;