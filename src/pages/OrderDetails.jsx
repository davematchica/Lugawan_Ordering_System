import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getOrderById, updateOrderStatus, deleteOrder } from '../services/orders/orderService';
import { formatPrice } from '../utils/priceHelpers';
import { format } from 'date-fns';

const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow', icon: '⏳', next: 'preparing' },
  preparing: { label: 'Preparing', color: 'blue', icon: '👨‍🍳', next: 'ready' },
  ready: { label: 'Ready', color: 'green', icon: '✅', next: 'served' },
  served: { label: 'Served', color: 'purple', icon: '🍽️', next: 'completed' },
  completed: { label: 'Completed', color: 'gray', icon: '✓', next: null }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order details.');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteOrder(orderId);
        navigate('/orders', { replace: true });
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const getStatusColorClass = (status) => {
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      gray: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colorMap[ORDER_STATUSES[status]?.color] || 'bg-neutral-100 text-neutral-800';
  };

  if (loading) {
    return (
      <>
        <Header title="Order Details" showBack />
        <PageContainer>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-3">⏳</div>
              <p className="text-neutral-600">Loading order...</p>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header title="Order Details" showBack />
        <PageContainer>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-3">❌</div>
              <p className="text-neutral-600">Order not found</p>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  const statusInfo = ORDER_STATUSES[order.status];
  const nextStatus = statusInfo.next;

  return (
    <>
      <Header title="Order Details" showBack />
      <PageContainer>
        <div className="p-4 space-y-6 pb-24">
          {/* Status Card */}
          <Card className={`border-2 ${getStatusColorClass(order.status)}`}>
            <div className="text-center">
              <div className="text-5xl mb-3">{statusInfo.icon}</div>
              <div className="text-2xl font-bold mb-1">{statusInfo.label}</div>
              <div className="text-sm opacity-75">Current Status</div>
            </div>
          </Card>

          {/* Customer Info */}
          <Card>
            <h3 className="font-bold text-neutral-800 mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Name:</span>
                <span className="font-semibold text-lg">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Order Time:</span>
                <span className="font-semibold">
                  {format(new Date(order.created_at), 'MMM dd, yyyy • h:mm a')}
                </span>
              </div>
              {order.completed_at && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Completed:</span>
                  <span className="font-semibold">
                    {format(new Date(order.completed_at), 'MMM dd, yyyy • h:mm a')}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Lugaw Items */}
          <Card>
            <h3 className="font-bold text-neutral-800 mb-3">🍜 Lugaw Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center pb-3 border-b border-neutral-200 last:border-b-0"
                >
                  <div>
                    <div className="font-semibold text-neutral-800">
                      {item.item_name}
                      {item.is_spicy && <span className="ml-2 text-sm">🌶️ Spicy</span>}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-bold text-primary-600">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Drinks */}
          {order.drinks && order.drinks.length > 0 && (
            <Card>
              <h3 className="font-bold text-neutral-800 mb-3">🥤 Drinks</h3>
              <div className="space-y-3">
                {order.drinks.map((drink, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center pb-3 border-b border-neutral-200 last:border-b-0"
                  >
                    <div>
                      <div className="font-semibold text-neutral-800">
                        {drink.item_name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {formatPrice(drink.price)}
                      </div>
                    </div>
                    <div className="font-bold text-primary-600">
                      {formatPrice(drink.price)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Order Total */}
          <Card className="bg-primary-50 border-2 border-primary-300">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-neutral-600 text-sm">Order Total</div>
                <div className="font-bold text-3xl text-primary-600">
                  {formatPrice(order.total_price)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-neutral-600 text-sm">Total Items</div>
                <div className="font-bold text-2xl text-neutral-800">
                  {order.items.length + (order.drinks?.length || 0)}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {nextStatus && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleStatusChange(nextStatus)}
              >
                {ORDER_STATUSES[nextStatus].icon} Move to {ORDER_STATUSES[nextStatus].label}
              </Button>
            )}

            {order.status !== 'completed' && (
              <Button
                variant="success"
                fullWidth
                onClick={() => handleStatusChange('completed')}
              >
                ✓ Mark as Completed
              </Button>
            )}

            <Button
              variant="outline"
              fullWidth
              onClick={handleDeleteOrder}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              🗑️ Delete Order
            </Button>
          </div>

          {/* Status Timeline */}
          <Card className="bg-neutral-50">
            <h3 className="font-bold text-neutral-800 mb-4">Order Progress</h3>
            <div className="space-y-3">
              {Object.entries(ORDER_STATUSES).map(([key, status], index) => {
                const statusOrder = ['pending', 'preparing', 'ready', 'served', 'completed'];
                const currentIndex = statusOrder.indexOf(order.status);
                const thisIndex = statusOrder.indexOf(key);
                const isActive = thisIndex <= currentIndex;
                
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${isActive 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-neutral-200 text-neutral-400'
                      }
                    `}>
                      {isActive ? '✓' : status.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`
                        font-semibold
                        ${isActive ? 'text-neutral-800' : 'text-neutral-400'}
                      `}>
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default OrderDetails;