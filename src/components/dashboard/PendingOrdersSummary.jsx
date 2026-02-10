import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { formatTime } from '../../utils/dateHelpers';
import { formatPrice } from '../../utils/priceHelpers';

const PendingOrdersSummary = ({ orders }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-neutral-800">Pending Orders</h3>
        <button
          onClick={() => navigate('/orders?status=pending')}
          className="text-sm text-primary-600 font-semibold"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            hover
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-neutral-800">
                    {order.customer_name}
                  </span>
                  {order.is_spicy && <span className="text-red-500">🌶️</span>}
                </div>
                <div className="text-sm text-neutral-600">
                  {order.items.map(item => item.item_name).join(', ')}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {formatTime(order.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary-600 mb-2">
                  {formatPrice(order.total_price)}
                </div>
                <StatusBadge status={order.status} size="sm" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingOrdersSummary;