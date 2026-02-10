import Dexie from 'dexie';

export const db = new Dexie('LugawanDB');

// Database schema
db.version(2).stores({
  orders: '++id, customer_name, status, created_at, completed_at, total_price',
  menu_items: '++id, category, name, price, is_available',
  expenses: '++id, category, date, amount',
  daily_summaries: 'date, total_sales, total_expenses, profit',
  app_settings: 'key'
});

// Define table classes for TypeScript-like structure
db.orders.mapToClass(class Order {
  constructor() {
    this.id = null;
    this.customer_name = '';
    this.items = []; // Array of { item_id, item_name, price }
    this.drinks = null; // { type, price } or null
    this.is_spicy = false;
    this.total_price = 0;
    this.status = 'pending'; // pending, preparing, ready, served, completed
    this.created_at = new Date();
    this.completed_at = null;
  }
});

db.menu_items.mapToClass(class MenuItem {
  constructor() {
    this.id = null;
    this.name = '';
    this.category = 'lugaw'; // lugaw, drinks
    this.price = 0;
    this.is_available = true;
  }
});

db.expenses.mapToClass(class Expense {
  constructor() {
    this.id = null;
    this.category = '';
    this.description = '';
    this.amount = 0;
    this.date = new Date();
  }
});

db.daily_summaries.mapToClass(class DailySummary {
  constructor() {
    this.date = ''; // YYYY-MM-DD
    this.total_sales = 0;
    this.total_expenses = 0;
    this.profit = 0;
    this.orders_count = 0;
  }
});

export default db;