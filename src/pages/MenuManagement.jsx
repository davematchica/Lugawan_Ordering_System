import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import MenuItemList from '../components/menu/MenuItemList';
import PriceEditor from '../components/menu/PriceEditor';
import { 
  getAllMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  toggleItemAvailability 
} from '../services/menu/menuService';
import { formatPrice } from '../utils/priceHelpers';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const initialFormData = {
    name: '',
    price: '',
    category: 'lugaw'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    try {
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        is_available: true
      };

      await addMenuItem(itemData);
      setShowAddModal(false);
      setFormData(initialFormData);
      setErrors({});
      loadMenuItems();
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleEditItem = async () => {
    if (!validateForm()) return;

    try {
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category
      };

      await updateMenuItem(editingItem.id, itemData);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData(initialFormData);
      setErrors({});
      loadMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(itemId);
        loadMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
      }
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await toggleItemAvailability(itemId, !currentStatus);
      loadMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability. Please try again.');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category
    });
    setShowEditModal(true);
  };

  const openAddModal = (category) => {
    setFormData({ ...initialFormData, category });
    setShowAddModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingItem(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const lugawItems = menuItems.filter(item => item.category === 'lugaw');
  const drinkItems = menuItems.filter(item => item.category === 'drinks');

  return (
    <>
      <Header title="Menu Management" showBack />
      <PageContainer>
        <div className="p-4 space-y-6 pb-24">
          {/* Summary */}
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Total Menu Items</div>
              <div className="text-3xl font-bold mb-2">{menuItems.length}</div>
              <div className="text-sm opacity-90">
                {lugawItems.length} Lugaw • {drinkItems.length} Drinks
              </div>
            </div>
          </Card>

          {/* Lugaw Items */}
          <MenuItemList
            title="Lugaw Items"
            icon="🍜"
            items={lugawItems}
            emptyMessage="No lugaw items yet"
            onAdd={() => openAddModal('lugaw')}
            onToggleAvailability={handleToggleAvailability}
            onEdit={openEditModal}
            onDelete={handleDeleteItem}
          />

          {/* Drinks */}
          <MenuItemList
            title="Drinks"
            icon="🥤"
            items={drinkItems}
            emptyMessage="No drinks yet"
            onAdd={() => openAddModal('drinks')}
            onToggleAvailability={handleToggleAvailability}
            onEdit={openEditModal}
            onDelete={handleDeleteItem}
          />
        </div>
      </PageContainer>

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={closeModals} size="sm">
        <div className="py-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Add {formData.category === 'lugaw' ? 'Lugaw' : 'Drink'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Item Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Plain Lugaw, Coke Mismo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <PriceEditor
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" fullWidth onClick={closeModals}>
              Cancel
            </Button>
            <Button variant="success" fullWidth onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={showEditModal} onClose={closeModals} size="sm">
        <div className="py-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Edit Item</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Item Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Plain Lugaw, Coke Mismo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <PriceEditor
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" fullWidth onClick={closeModals}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleEditItem}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuManagement;