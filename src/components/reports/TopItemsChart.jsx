import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const TopItemsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-2">🏆</div>
        <p className="text-neutral-500">No items data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-neutral-800 mb-4">Top Selling Items</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis type="number" stroke="#78716C" style={{ fontSize: '12px' }} />
          <YAxis dataKey="name" type="category" width={120} stroke="#78716C" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E5E4',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="count" fill="#FF8C15" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopItemsChart;