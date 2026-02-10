import db from '../db';
import { initialMenuItems } from '../../data/initialMenu';

// Initialize menu with default items
export const initializeMenu = async () => {
  try {
    const count = await db.menu_items.count();
    
    if (count === 0) {
      await db.menu_items.bulkAdd(initialMenuItems);
      console.log('Menu initialized with default items');
    }
  } catch (error) {
    console.error('Error initializing menu:', error);
    throw error;
  }
};

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    return await db.menu_items.toArray();
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category) => {
  try {
    return await db.menu_items
      .where('category')
      .equals(category)
      .toArray();
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    throw error;
  }
};

// Get available menu items
export const getAvailableMenuItems = async () => {
  try {
    return await db.menu_items
      .where('is_available')
      .equals(1)
      .toArray();
  } catch (error) {
    console.error('Error getting available menu items:', error);
    throw error;
  }
};

// Get menu item by ID
export const getMenuItemById = async (id) => {
  try {
    return await db.menu_items.get(id);
  } catch (error) {
    console.error('Error getting menu item:', error);
    throw error;
  }
};

// Update menu item
export const updateMenuItem = async (id, updates) => {
  try {
    await db.menu_items.update(id, updates);
    return await getMenuItemById(id);
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Toggle item availability
export const toggleItemAvailability = async (id) => {
  try {
    const item = await getMenuItemById(id);
    const newAvailability = !item.is_available;
    
    await db.menu_items.update(id, { is_available: newAvailability });
    return await getMenuItemById(id);
  } catch (error) {
    console.error('Error toggling item availability:', error);
    throw error;
  }
};

// Add new menu item
export const addMenuItem = async (itemData) => {
  try {
    const id = await db.menu_items.add(itemData);
    return await getMenuItemById(id);
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  try {
    await db.menu_items.delete(id);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

export default {
  initializeMenu,
  getAllMenuItems,
  getMenuItemsByCategory,
  getAvailableMenuItems,
  getMenuItemById,
  updateMenuItem,
  toggleItemAvailability,
  addMenuItem,
  deleteMenuItem
};