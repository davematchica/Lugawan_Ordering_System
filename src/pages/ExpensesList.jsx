import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  getAllExpenses, 
  getExpensesByDateRange, 
  deleteExpense 
} from '../services/expenses/expenseService';
import { formatPrice } from '../utils/priceHelpers';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const EXPENSE_CATEGORIES = {
  ingredients: { name: 'Ingredients', icon: '🥬', color: 'green' },
  utilities: { name: 'Utilities', icon: '💡', color: 'yellow' },
  supplies: { name: 'Supplies', icon: '📦', color: 'blue' },
  transportation: { name: 'Transportation', icon: '🚗', color: 'purple' },
  miscellaneous: { name: 'Miscellaneous', icon: '📝', color: 'gray' }
};

const ExpensesList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filter, categoryFilter]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    // Apply date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filter === 'today') {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= today;
      });
    } else if (filter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= weekAgo;
      });
    } else if (filter === 'month') {
      const monthStart = startOfMonth(now);
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart;
      });
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredExpenses(filtered);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        loadExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const calculateTotal = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const groupExpensesByDate = () => {
    const groups = {};
    
    filteredExpenses.forEach(expense => {
      const date = format(new Date(expense.date), 'MMMM dd, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
    });

    return groups;
  };

  const groupedExpenses = groupExpensesByDate();

  return (
    <>
      <Header title="Expenses" showBack />
      <PageContainer>
        <div className="p-4 space-y-6 pb-32">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Total Expenses</div>
              <div className="text-3xl font-bold mb-2">
                {formatPrice(calculateTotal())}
              </div>
              <div className="text-sm opacity-90">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
              </div>
            </div>
          </Card>

          {/* Filters */}
          <div className="space-y-3">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Time Period
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['all', 'today', 'week', 'month'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-semibold transition-all
                      ${filter === f
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

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Category
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                    ${categoryFilter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  All
                </button>
                {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
                      ${categoryFilter === key
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }
                    `}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expenses List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">⏳</div>
              <p className="text-neutral-600">Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">📝</div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">No Expenses Found</h3>
              <p className="text-neutral-600 mb-6">
                {categoryFilter !== 'all' || filter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start tracking your expenses'}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/expense/add')}
              >
                ➕ Add Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedExpenses).map(([date, dateExpenses]) => (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-neutral-700">{date}</h3>
                    <div className="text-sm font-semibold text-primary-600">
                      {formatPrice(dateExpenses.reduce((sum, e) => sum + e.amount, 0))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dateExpenses.map((expense) => {
                      const category = EXPENSE_CATEGORIES[expense.category];
                      return (
                        <Card key={expense.id} className="hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-3xl">{category.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-neutral-800">
                                  {expense.description}
                                </div>
                                <div className="text-sm text-neutral-600 mt-1">
                                  {category.name} • {format(new Date(expense.date), 'h:mm a')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="font-bold text-primary-600 text-lg">
                                {formatPrice(expense.amount)}
                              </div>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
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
            onClick={() => navigate('/expense/add')}
            className="w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
          >
            +
          </button>
        </div>
      </PageContainer>
    </>
  );
};

export default ExpensesList;