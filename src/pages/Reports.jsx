import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import { getAllOrders } from '../services/orders/orderService';
import { getAllExpenses } from '../services/expenses/expenseService';
import { formatPrice } from '../utils/priceHelpers';
import { 
  format, 
  startOfDay, 
  endOfDay,
  startOfWeek, 
  endOfWeek,
  startOfMonth, 
  endOfMonth,
  isWithinInterval 
} from 'date-fns';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [period, setPeriod] = useState('today'); // 'today', 'week', 'month'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, expensesData] = await Promise.all([
        getAllOrders(),
        getAllExpenses()
      ]);
      setOrders(ordersData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    
    if (period === 'today') {
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    } else if (period === 'week') {
      return {
        start: startOfWeek(now),
        end: endOfWeek(now)
      };
    } else if (period === 'month') {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    }
  };

  const filterByPeriod = (items, dateField = 'created_at') => {
    const range = getDateRange();
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, range);
    });
  };

  const filteredOrders = filterByPeriod(orders);
  const completedOrders = filteredOrders.filter(o => o.status === 'completed');
  const filteredExpenses = filterByPeriod(expenses, 'date');

  // Calculate metrics
  const totalSales = completedOrders.reduce((sum, order) => sum + order.total_price, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalSales - totalExpenses;
  const totalOrders = filteredOrders.length;
  const completedOrdersCount = completedOrders.length;
  const averageOrderValue = completedOrdersCount > 0 ? totalSales / completedOrdersCount : 0;

  // Top selling items
  const getTopSellingItems = () => {
    const itemCounts = {};
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.item_name]) {
          itemCounts[item.item_name].count += 1;
          itemCounts[item.item_name].revenue += item.price;
        } else {
          itemCounts[item.item_name] = {
            name: item.item_name,
            count: 1,
            revenue: item.price
          };
        }
      });
    });

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Expense breakdown by category
  const getExpenseBreakdown = () => {
    const breakdown = {};
    
    filteredExpenses.forEach(expense => {
      if (breakdown[expense.category]) {
        breakdown[expense.category] += expense.amount;
      } else {
        breakdown[expense.category] = expense.amount;
      }
    });

    return breakdown;
  };

  const topSellingItems = getTopSellingItems();
  const expenseBreakdown = getExpenseBreakdown();

  const CATEGORY_INFO = {
    ingredients: { name: 'Ingredients', icon: '🥬' },
    utilities: { name: 'Utilities', icon: '💡' },
    supplies: { name: 'Supplies', icon: '📦' },
    transportation: { name: 'Transportation', icon: '🚗' },
    miscellaneous: { name: 'Miscellaneous', icon: '📝' }
  };

  return (
    <>
      <Header title="Reports" showBack={false} />
      <PageContainer>
        <div className="p-4 space-y-6 pb-24">
          {/* Period Selector */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Time Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['today', 'week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-semibold transition-all
                    ${period === p
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  {p === 'today' && '📅 Today'}
                  {p === 'week' && '📆 This Week'}
                  {p === 'month' && '📊 This Month'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">⏳</div>
              <p className="text-neutral-600">Loading reports...</p>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {/* Sales */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm opacity-90">Sales</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatPrice(totalSales)}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {completedOrdersCount} orders
                    </div>
                  </div>
                </Card>

                {/* Expenses */}
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📝</div>
                    <div className="text-sm opacity-90">Expenses</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatPrice(totalExpenses)}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {filteredExpenses.length} expenses
                    </div>
                  </div>
                </Card>

                {/* Profit/Loss */}
                <Card className={`
                  bg-gradient-to-br text-white col-span-2
                  ${profit >= 0 
                    ? 'from-primary-500 to-primary-600' 
                    : 'from-red-500 to-red-600'
                  }
                `}>
                  <div className="text-center">
                    <div className="text-3xl mb-1">
                      {profit >= 0 ? '📈' : '📉'}
                    </div>
                    <div className="text-sm opacity-90">
                      {profit >= 0 ? 'Profit' : 'Loss'}
                    </div>
                    <div className="text-3xl font-bold mt-1">
                      {formatPrice(Math.abs(profit))}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {profit >= 0 
                        ? '✓ Profitable period' 
                        : '⚠️ Operating at a loss'
                      }
                    </div>
                  </div>
                </Card>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <div className="text-center">
                    <div className="text-neutral-600 text-sm mb-1">Total Orders</div>
                    <div className="text-3xl font-bold text-primary-600">
                      {totalOrders}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <div className="text-neutral-600 text-sm mb-1">Avg Order Value</div>
                    <div className="text-3xl font-bold text-primary-600">
                      {formatPrice(averageOrderValue)}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Selling Items */}
              {topSellingItems.length > 0 && (
                <Card>
                  <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                    <span>🏆</span>
                    <span>Top Selling Items</span>
                  </h3>
                  <div className="space-y-3">
                    {topSellingItems.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                            index === 1 ? 'bg-gray-100 text-gray-700' : 
                            index === 2 ? 'bg-orange-100 text-orange-700' : 
                            'bg-neutral-100 text-neutral-600'}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-neutral-800">
                            {item.name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {item.count} sold • {formatPrice(item.revenue)} revenue
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Expense Breakdown */}
              {Object.keys(expenseBreakdown).length > 0 && (
                <Card>
                  <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                    <span>💸</span>
                    <span>Expense Breakdown</span>
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(expenseBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => {
                        const categoryInfo = CATEGORY_INFO[category];
                        const percentage = (amount / totalExpenses) * 100;
                        
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{categoryInfo.icon}</span>
                                <span className="font-semibold text-neutral-800">
                                  {categoryInfo.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary-600">
                                  {formatPrice(amount)}
                                </div>
                                <div className="text-xs text-neutral-600">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Card>
              )}

              {/* Summary */}
              <Card className="bg-cream-100">
                <h3 className="font-bold text-neutral-800 mb-3">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Period:</span>
                    <span className="font-semibold">
                      {period === 'today' && format(new Date(), 'MMMM dd, yyyy')}
                      {period === 'week' && `${format(getDateRange().start, 'MMM dd')} - ${format(getDateRange().end, 'MMM dd, yyyy')}`}
                      {period === 'month' && format(new Date(), 'MMMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Revenue:</span>
                    <span className="font-semibold text-green-600">
                      +{formatPrice(totalSales)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Expenses:</span>
                    <span className="font-semibold text-red-600">
                      -{formatPrice(totalExpenses)}
                    </span>
                  </div>
                  <div className="pt-2 border-t-2 border-neutral-300 flex justify-between">
                    <span className="font-bold">Net {profit >= 0 ? 'Profit' : 'Loss'}:</span>
                    <span className={`font-bold text-lg ${profit >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                      {formatPrice(Math.abs(profit))}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Insights */}
              {totalOrders === 0 && (
                <Card className="bg-blue-50 border-2 border-blue-200">
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">💡</div>
                    <p className="text-neutral-700 font-semibold mb-1">No Data Yet</p>
                    <p className="text-sm text-neutral-600">
                      Start taking orders to see your reports!
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default Reports;