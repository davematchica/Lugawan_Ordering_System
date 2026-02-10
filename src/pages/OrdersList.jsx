import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getAllOrders, updateOrderStatus } from '../services/orders/orderService';
import { formatPrice } from '../utils/priceHelpers';
import { format } from 'date-fns';

const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow', icon: '⏳' },
  preparing: { label: 'Preparing', color: 'blue', icon: '👨‍🍳' },
  ready: { label: 'Ready', color: 'green', icon: '✅' },
  served: { label: 'Served', color: 'purple', icon: '🍽️' },
  completed: { label: 'Completed', color: 'gray', icon: '✓' }
};

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'completed', 'all'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    if (statusFilter === 'active') {
      filtered = filtered.filter(order => order.status !== 'completed');
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(order => order.status === 'completed');
    }

    filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setFilteredOrders(filtered);
  }, [orders, statusFilter]);

  useEffect(() => {
  applyFilters();
  }, [applyFilters]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusOrder = ['pending', 'preparing', 'ready', 'served', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
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

  const groupOrdersByDate = () => {
    const groups = {};
    
    filteredOrders.forEach(order => {
      const date = format(new Date(order.created_at), 'MMMM dd, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
    });

    return groups;
  };

  const getTotalSales = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total_price, 0);
  };

  const groupedOrders = groupOrdersByDate();

  return (
    <>
      <Header title="Orders" showBack={false} />
      <PageContainer>
        <div className="p-4 space-y-6 pb-32">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Total Sales</div>
              <div className="text-3xl font-bold mb-2">
                {formatPrice(getTotalSales())}
              </div>
              <div className="text-sm opacity-90">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </div>
            </div>
          </Card>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Filter by Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['active', 'completed', 'all'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-semibold transition-all
                    ${statusFilter === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">⏳</div>
              <p className="text-neutral-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">📋</div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">No Orders Found</h3>
              <p className="text-neutral-600 mb-6">
                {statusFilter !== 'all'
                  ? 'Try changing the filter'
                  : 'Start taking orders'}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/order/new')}
              >
                ➕ New Order
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-neutral-700">{date}</h3>
                    <div className="text-sm font-semibold text-primary-600">
                      {formatPrice(dateOrders.reduce((sum, o) => sum + o.total_price, 0))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dateOrders.map((order) => {
                      const nextStatus = getNextStatus(order.status);
                      const statusInfo = ORDER_STATUSES[order.status];
                      
                      return (
                        <Card 
                          key={order.id} 
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/order/${order.id}`)}
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-lg text-neutral-800">
                                  {order.customer_name}
                                </div>
                                <div className="text-sm text-neutral-600">
                                  {format(new Date(order.created_at), 'h:mm a')}
                                </div>
                              </div>
                              <div className={`
                                px-3 py-1 rounded-full text-xs font-bold border-2
                                ${getStatusColorClass(order.status)}
                              `}>
                                {statusInfo.icon} {statusInfo.label}
                              </div>
                            </div>

                            {/* Items Summary */}
                            <div className="text-sm text-neutral-600">
                              {order.items.length} lugaw item(s)
                              {order.drinks && order.drinks.length > 0 && ` • ${order.drinks.length} drink(s)`}
                            </div>

                            {/* Total & Action */}
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                              <div className="font-bold text-primary-600 text-xl">
                                {formatPrice(order.total_price)}
                              </div>
                              
                              {nextStatus && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(order.id, nextStatus);
                                  }}
                                >
                                  {ORDER_STATUSES[nextStatus].icon} {ORDER_STATUSES[nextStatus].label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Add Button */}
        <div className="fixed bottom-20 right-6">
          <button
            onClick={() => navigate('/order/new')}
            className="w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
          >
            +
          </button>
        </div>
      </PageContainer>
    </>
  );
};

export default OrdersList;