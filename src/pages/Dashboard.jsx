import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuickStats from '../components/dashboard/QuickStats';
import PendingOrdersSummary from '../components/dashboard/PendingOrdersSummary';
import StatusBadge from '../components/common/StatusBadge';
import { getOrdersByStatus, getTodayStats } from '../services/orders/orderService';
import { getTodayExpenseTotal } from '../services/expenses/expenseService';
// import { formatPrice } from '../utils/priceHelpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_sales: 0,
    total_expenses: 0,
    profit: 0,
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's statistics
      const todayStats = await getTodayStats();
      const todayExpenses = await getTodayExpenseTotal();
      
      // Get pending and preparing orders
      const pending = await getOrdersByStatus('pending');
      const preparing = await getOrdersByStatus('preparing');
      
      setStats({
        ...todayStats,
        total_expenses: todayExpenses,
        profit: todayStats.total_sales - todayExpenses
      });
      
      setPendingOrders(pending.slice(0, 5));
      setPreparingOrders(preparing.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Header title="Matchica Family Lugawan" />
      <PageContainer>
        <div className="p-4 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🍜</span>
              <div>
                <h2 className="text-2xl font-bold font-display">Good day!</h2>
                <p className="text-primary-100 text-sm">Let's make today great</p>
              </div>
            </div>
          </div>

          {/* Today's Stats - Using QuickStats Component */}
          <QuickStats stats={stats} loading={loading} />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/order/new')}
              className="flex flex-col items-center gap-2 h-24"
            >
              <span className="text-2xl">➕</span>
              <span>New Order</span>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/expense/add')}
              className="flex flex-col items-center gap-2 h-24"
            >
              <span className="text-2xl">💵</span>
              <span>Add Expense</span>
            </Button>
          </div>

          {/* Management Tools */}
          <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-3">Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                hover 
                onClick={() => navigate('/menu')}
                className="cursor-pointer"
              >
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🍜</div>
                  <div className="font-semibold text-neutral-800">Menu Items</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    Edit prices & availability
                  </div>
                </div>
              </Card>

              <Card 
                hover 
                onClick={() => navigate('/settings')}
                className="cursor-pointer"
              >
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">⚙️</div>
                  <div className="font-semibold text-neutral-800">Settings</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    App preferences
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Pending Orders - Using PendingOrdersSummary Component */}
          <PendingOrdersSummary orders={pendingOrders} />

          {/* Preparing Orders */}
          {preparingOrders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-neutral-800">Now Preparing</h3>
                <button
                  onClick={() => navigate('/orders?status=preparing')}
                  className="text-sm text-primary-600 font-semibold"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {preparingOrders.map((order) => (
                  <Card
                    key={order.id}
                    hover
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="border-l-4 border-blue-500"
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
                      </div>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pendingOrders.length === 0 && preparingOrders.length === 0 && (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-lg font-bold text-neutral-700 mb-2">All caught up!</h3>
              <p className="text-neutral-500 mb-6">No pending orders at the moment</p>
              <Button onClick={() => navigate('/order/new')}>
                Create New Order
              </Button>
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;