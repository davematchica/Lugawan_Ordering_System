export const APP_NAME = 'Matchica Family Lugawan';
export const APP_VERSION = '1.0.0';

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed'
};

export const EXPENSE_CATEGORIES = {
  INGREDIENTS: 'ingredients',
  UTILITIES: 'utilities',
  SUPPLIES: 'supplies',
  TRANSPORTATION: 'transportation',
  MISCELLANEOUS: 'miscellaneous'
};

export const MENU_CATEGORIES = {
  LUGAW: 'lugaw',
  DRINKS: 'drinks'
};

export const STORAGE_KEYS = {
  SETTINGS: 'lugawan_settings',
  LAST_BACKUP: 'lugawan_last_backup',
  USER_PREFERENCES: 'lugawan_preferences'
};

export const BACKUP_REMINDER_DAYS = 7;

export const ROUTES = {
  DASHBOARD: '/',
  NEW_ORDER: '/order/new',
  ORDERS_LIST: '/orders',
  ORDER_DETAILS: '/order/:id',
  ADD_EXPENSE: '/expense/new',
  EXPENSES_LIST: '/expenses',
  REPORTS: '/reports',
  MENU: '/menu',
  SETTINGS: '/settings'
};

const constants = {
  APP_NAME,
  APP_VERSION,
  ORDER_STATUSES,
  EXPENSE_CATEGORIES,
  MENU_CATEGORIES,
  STORAGE_KEYS,
  BACKUP_REMINDER_DAYS,
  ROUTES
};

export default constants;