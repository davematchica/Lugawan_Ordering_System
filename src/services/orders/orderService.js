import db from '../db';
import { getTodayStart, getTodayEnd, formatDateKey } from '../../utils/dateHelpers';
import { ORDER_STATUSES } from '../../utils/constants';

// Create new order
export const createOrder = async (orderData) => {
  try {
    const order = {
      customer_name: orderData.customer_name,
      items: orderData.items, // [{ item_id, item_name, price }]
      drinks: orderData.drinks, // { type, price } or null
      is_spicy: orderData.is_spicy || false,
      total_price: orderData.total_price,
      status: ORDER_STATUSES.PENDING,
      created_at: new Date(),
      completed_at: null
    };

    const id = await db.orders.add(order);
    return { ...order, id };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    return await db.orders.get(id);
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    return await db.orders.orderBy('created_at').reverse().toArray();
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Get today's orders
export const getTodayOrders = async () => {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    
    return await db.orders
      .where('created_at')
      .between(todayStart, todayEnd, true, true)
      .reverse()
      .toArray();
  } catch (error) {
    console.error('Error getting today orders:', error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (status) => {
  try {
    return await db.orders
      .where('status')
      .equals(status)
      .reverse()
      .toArray();
  } catch (error) {
    console.error('Error getting orders by status:', error);
    throw error;
  }
};

// Get orders by date range
export const getOrdersByDateRange = async (startDate, endDate) => {
  try {
    return await db.orders
      .where('created_at')
      .between(startDate, endDate, true, true)
      .toArray();
  } catch (error) {
    console.error('Error getting orders by date range:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id, newStatus) => {
  try {
    const updates = { status: newStatus };
    
    // If completing order, set completed_at timestamp
    if (newStatus === ORDER_STATUSES.COMPLETED) {
      updates.completed_at = new Date();
    }
    
    await db.orders.update(id, updates);
    return await getOrderById(id);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update entire order
export const updateOrder = async (id, orderData) => {
  try {
    await db.orders.update(id, orderData);
    return await getOrderById(id);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    await db.orders.delete(id);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Get order statistics
export const getOrderStats = async (startDate, endDate) => {
  try {
    const orders = await getOrdersByDateRange(startDate, endDate);
    
    const stats = {
      total_orders: orders.length,
      completed_orders: orders.filter(o => o.status === ORDER_STATUSES.COMPLETED).length,
      total_sales: orders
        .filter(o => o.status === ORDER_STATUSES.COMPLETED)
        .reduce((sum, o) => sum + o.total_price, 0),
      pending_orders: orders.filter(o => o.status === ORDER_STATUSES.PENDING).length,
      preparing_orders: orders.filter(o => o.status === ORDER_STATUSES.PREPARING).length,
      ready_orders: orders.filter(o => o.status === ORDER_STATUSES.READY).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting order stats:', error);
    throw error;
  }
};

// Get today's statistics
export const getTodayStats = async () => {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    return await getOrderStats(todayStart, todayEnd);
  } catch (error) {
    console.error('Error getting today stats:', error);
    throw error;
  }
};

// Get popular items
export const getPopularItems = async (startDate, endDate) => {
  try {
    const orders = await getOrdersByDateRange(startDate, endDate);
    const completedOrders = orders.filter(o => o.status === ORDER_STATUSES.COMPLETED);
    
    const itemCounts = {};
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.item_name]) {
          itemCounts[item.item_name] = {
            name: item.item_name,
            count: 0,
            revenue: 0
          };
        }
        itemCounts[item.item_name].count += 1;
        itemCounts[item.item_name].revenue += item.price;
      });
    });
    
    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting popular items:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderById,
  getAllOrders,
  getTodayOrders,
  getOrdersByStatus,
  getOrdersByDateRange,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
  getTodayStats,
  getPopularItems
};