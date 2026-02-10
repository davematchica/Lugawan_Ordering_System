import db from '../db';
import { getTodayStart, getTodayEnd, formatDateKey } from '../../utils/dateHelpers';
import { startOfMonth, endOfMonth } from 'date-fns';

// Create new expense
export const createExpense = async (expenseData) => {
  try {
    const expense = {
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date || new Date()
    };

    const id = await db.expenses.add(expense);
    return { ...expense, id };
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

// Get expense by ID
export const getExpenseById = async (id) => {
  try {
    return await db.expenses.get(id);
  } catch (error) {
    console.error('Error getting expense:', error);
    throw error;
  }
};

// Get all expenses
export const getAllExpenses = async () => {
  try {
    return await db.expenses.orderBy('date').reverse().toArray();
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

// Get today's expenses
export const getTodayExpenses = async () => {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    
    return await db.expenses
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray();
  } catch (error) {
    console.error('Error getting today expenses:', error);
    throw error;
  }
};

// Get expenses by date range
export const getExpensesByDateRange = async (startDate, endDate) => {
  try {
    return await db.expenses
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  } catch (error) {
    console.error('Error getting expenses by date range:', error);
    throw error;
  }
};

// Get expenses by category
export const getExpensesByCategory = async (category) => {
  try {
    return await db.expenses
      .where('category')
      .equals(category)
      .toArray();
  } catch (error) {
    console.error('Error getting expenses by category:', error);
    throw error;
  }
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  try {
    await db.expenses.update(id, expenseData);
    return await getExpenseById(id);
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await db.expenses.delete(id);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Get expense summary
export const getExpenseSummary = async (startDate, endDate) => {
  try {
    const expenses = await getExpensesByDateRange(startDate, endDate);
    
    const summary = {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      count: expenses.length,
      by_category: {}
    };
    
    expenses.forEach(expense => {
      if (!summary.by_category[expense.category]) {
        summary.by_category[expense.category] = {
          total: 0,
          count: 0
        };
      }
      summary.by_category[expense.category].total += expense.amount;
      summary.by_category[expense.category].count += 1;
    });
    
    return summary;
  } catch (error) {
    console.error('Error getting expense summary:', error);
    throw error;
  }
};

// Get today's expense total
export const getTodayExpenseTotal = async () => {
  try {
    const expenses = await getTodayExpenses();
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  } catch (error) {
    console.error('Error getting today expense total:', error);
    throw error;
  }
};

// Get this month's expenses
export const getThisMonthExpenses = async () => {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return await getExpensesByDateRange(monthStart, monthEnd);
  } catch (error) {
    console.error('Error getting this month expenses:', error);
    throw error;
  }
};

// Get monthly expense summary
export const getMonthlyExpenseSummary = async () => {
  try {
    const expenses = await getThisMonthExpenses();
    return getExpenseSummary(startOfMonth(new Date()), endOfMonth(new Date()));
  } catch (error) {
    console.error('Error getting monthly expense summary:', error);
    throw error;
  }
};

export default {
  createExpense,
  getExpenseById,
  getAllExpenses,
  getTodayExpenses,
  getExpensesByDateRange,
  getExpensesByCategory,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getTodayExpenseTotal,
  getThisMonthExpenses,
  getMonthlyExpenseSummary
};