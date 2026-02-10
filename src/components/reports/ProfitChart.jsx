import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { formatPrice } from '../../utils/priceHelpers';

const ProfitChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-2">📈</div>
        <p className="text-neutral-500">No profit data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-neutral-800 mb-4">Profit Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
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
          <Legend />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProfitChart;