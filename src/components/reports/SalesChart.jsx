import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { formatPrice } from '../../utils/priceHelpers';

const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-neutral-500">No sales data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-neutral-800 mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF8C15" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF8C15" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis dataKey="date" stroke="#78716C" style={{ fontSize: '12px' }} />
          <YAxis stroke="#78716C" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E5E4',
              borderRadius: '8px'
            }}
            formatter={(value) => formatPrice(value)}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#FF8C15"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;