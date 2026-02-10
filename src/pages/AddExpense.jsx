import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { createExpense } from '../services/expenses/expenseService';
import { formatPrice } from '../utils/priceHelpers';

const EXPENSE_CATEGORIES = [
  { id: 'ingredients', name: 'Ingredients', icon: '🥬', color: 'green' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: 'yellow' },
  { id: 'supplies', name: 'Supplies', icon: '📦', color: 'blue' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'purple' },
  { id: 'miscellaneous', name: 'Miscellaneous', icon: '📝', color: 'gray' }
];

const AddExpense = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialExpenseData = {
    category: '',
    description: '',
    amount: ''
  };

  const [expenseData, setExpenseData] = useState(initialExpenseData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!expenseData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!expenseData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const expensePayload = {
        category: expenseData.category,
        description: expenseData.description.trim(),
        amount: parseFloat(expenseData.amount),
        date: new Date().toISOString()
      };

      await createExpense(expensePayload);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setExpenseData(initialExpenseData);
    setErrors({});
  };

  const handleGoToExpenses = () => {
    navigate('/expenses', { replace: true });
  };

  const getSelectedCategory = () => {
    return EXPENSE_CATEGORIES.find(cat => cat.id === expenseData.category);
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
      green: 'border-green-500 bg-green-50',
      yellow: 'border-yellow-500 bg-yellow-50',
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      gray: 'border-gray-500 bg-gray-50'
    };
    return colorMap[color] || 'border-neutral-300 bg-neutral-50';
  };

  return (
    <>
      <Header title="Add Expense" showBack />
      <PageContainer>
        <div className="p-4 space-y-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💰</div>
            <h2 className="text-2xl font-bold text-neutral-800 font-display">
              Record Expense
            </h2>
            <p className="text-neutral-600 mt-2">Track your business expenses</p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  hover
                  onClick={() => setExpenseData({ ...expenseData, category: category.id })}
                  className={`
                    cursor-pointer text-center py-4 transition-all
                    ${expenseData.category === category.id
                      ? `border-2 ${getCategoryColorClass(category.color)}`
                      : 'border-2 border-neutral-200'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm">{category.name}</div>
                </Card>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Description *
            </label>
            <Input
              type="text"
              placeholder="e.g., Rice 25kg, Electricity bill, Gas refill"
              value={expenseData.description}
              onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 font-semibold">
                ₱
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                className={`pl-8 text-lg ${errors.amount ? 'border-red-500' : ''}`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Preview */}
          {expenseData.category && expenseData.description && expenseData.amount && (
            <Card className="bg-cream-100">
              <h3 className="font-bold text-neutral-800 mb-3">Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Category:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <span>{getSelectedCategory()?.icon}</span>
                    <span>{getSelectedCategory()?.name}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Description:</span>
                  <span className="font-semibold">{expenseData.description}</span>
                </div>
                <div className="pt-2 border-t border-neutral-300 flex justify-between">
                  <span className="font-bold">Amount:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {formatPrice(parseFloat(expenseData.amount) || 0)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              variant="success"
              fullWidth
              onClick={handleSubmit}
            >
              ✓ Add Expense
            </Button>
          </div>
        </div>
      </PageContainer>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoToExpenses}
        size="sm"
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4 animate-bounce-subtle">✅</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Expense Added!</h2>
          <p className="text-neutral-600 mb-2">
            <span className="font-semibold">{getSelectedCategory()?.name}</span>
          </p>
          <p className="text-neutral-600 mb-6">
            <span className="font-bold text-primary-600">
              {formatPrice(parseFloat(expenseData.amount))}
            </span>
          </p>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddAnother}
            >
              ➕ Add Another Expense
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleGoToExpenses}
            >
              View All Expenses
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddExpense;