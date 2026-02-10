import React from 'react';
import Card from '../common/Card';
import { formatTime } from '../../utils/dateHelpers';
import { formatPrice } from '../../utils/priceHelpers';

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-neutral-800 mb-3">Recent Activity</h3>
      
      <Card>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 pb-3 ${
                index < activities.length - 1 ? 'border-b border-neutral-100' : ''
              }`}
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-neutral-800">
                  {activity.title}
                </div>
                <div className="text-sm text-neutral-600">{activity.description}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
              {activity.amount && (
                <div className={`font-bold ${activity.type === 'order' ? 'text-green-600' : 'text-red-600'}`}>
                  {activity.type === 'order' ? '+' : '-'}
                  {formatPrice(activity.amount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RecentActivity;