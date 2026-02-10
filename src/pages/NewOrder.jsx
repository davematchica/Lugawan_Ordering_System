import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { getMenuItemsByCategory } from '../services/menu/menuService';
import { createOrder } from '../services/orders/orderService';
import { formatPrice } from '../utils/priceHelpers';

const NewOrder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lugawItems, setLugawItems] = useState([]);
  const [drinkItems, setDrinkItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showItemBuilder, setShowItemBuilder] = useState(false);

  const initialOrderData = {
    customer_name: '',
    cart: [] // Each cart item: {id: unique, type: 'lugaw'|'drink', menu_item, quantity, is_spicy}
  };
  
  const [orderData, setOrderData] = useState(initialOrderData);

  // Item being built
  const [itemBuilder, setItemBuilder] = useState({
    type: null, // 'lugaw' or 'drink'
    menu_item: null,
    quantity: 1,
    is_spicy: false
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const lugaw = await getMenuItemsByCategory('lugaw');
      const drinks = await getMenuItemsByCategory('drinks');

      setLugawItems(lugaw.filter(item => item.is_available));
      setDrinkItems(drinks.filter(item => item.is_available));
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  // Open item builder
  const openItemBuilder = (type, menuItem) => {
    setItemBuilder({
      type,
      menu_item: menuItem,
      quantity: 1,
      is_spicy: type === 'lugaw' ? false : undefined
    });
    setShowItemBuilder(true);
  };

  // Add item to cart
  const addToCart = () => {
    const cartItem = {
      id: Date.now() + Math.random(), // Unique ID for each cart item
      type: itemBuilder.type,
      menu_item: itemBuilder.menu_item,
      quantity: itemBuilder.quantity,
      is_spicy: itemBuilder.type === 'lugaw' ? itemBuilder.is_spicy : undefined
    };

    setOrderData({
      ...orderData,
      cart: [...orderData.cart, cartItem]
    });

    // Reset builder and close
    setItemBuilder({
      type: null,
      menu_item: null,
      quantity: 1,
      is_spicy: false
    });
    setShowItemBuilder(false);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setOrderData({
      ...orderData,
      cart: orderData.cart.filter(item => item.id !== cartItemId)
    });
  };

  // Update cart item quantity
  const updateCartQuantity = (cartItemId, delta) => {
    setOrderData({
      ...orderData,
      cart: orderData.cart.map(item => {
        if (item.id === cartItemId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    });
  };

  // Calculate total
  const calculateTotal = () => {
    return orderData.cart.reduce((total, item) => {
      return total + (item.menu_item.price * item.quantity);
    }, 0);
  };

  // Get total item count
  const getTotalItemCount = () => {
    return orderData.cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get lugaw items count
  const getLugawCount = () => {
    return orderData.cart
      .filter(item => item.type === 'lugaw')
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get drinks count
  const getDrinksCount = () => {
    return orderData.cart
      .filter(item => item.type === 'drink')
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmit = async () => {
    if (!orderData.customer_name.trim()) {
      alert('Customer name is required.');
      return;
    }

    if (orderData.cart.length === 0) {
      alert('Please add at least one item to the order.');
      return;
    }

    try {
      // Separate lugaw and drinks
      const lugawCartItems = orderData.cart.filter(item => item.type === 'lugaw');
      const drinkCartItems = orderData.cart.filter(item => item.type === 'drink');

      // Format items for backend
      const formattedItems = lugawCartItems.flatMap(item => {
        return Array(item.quantity).fill(null).map(() => ({
          item_id: item.menu_item.id,
          item_name: item.menu_item.name,
          price: item.menu_item.price,
          is_spicy: item.is_spicy
        }));
      });

      // Format drinks for backend
      const formattedDrinks = drinkCartItems.length > 0
        ? drinkCartItems.flatMap(item => {
            return Array(item.quantity).fill(null).map(() => ({
              item_id: item.menu_item.id,
              item_name: item.menu_item.name,
              price: item.menu_item.price
            }));
          })
        : null;

      const orderPayload = {
        customer_name: orderData.customer_name,
        items: formattedItems,
        drinks: formattedDrinks,
        total_price: calculateTotal()
      };

      await createOrder(orderPayload);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setOrderData(initialOrderData);
    setStep(1);
  };

  const handleGoToDashboard = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      <Header title="New Order" showBack />
      <PageContainer>
        <div className="p-4 space-y-6 pb-32">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  font-bold transition-all text-lg
                  ${s <= step 
                    ? 'bg-primary-500 text-white shadow-card' 
                    : 'bg-neutral-200 text-neutral-400'
                  }
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`
                    flex-1 h-1 mx-2 rounded-full transition-all
                    ${s < step ? 'bg-primary-500' : 'bg-neutral-200'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Customer Name */}
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">👤</div>
                <h2 className="text-2xl font-bold text-neutral-800 font-display">
                  Customer Name
                </h2>
                <p className="text-neutral-600 mt-2">Who is this order for?</p>
              </div>

              <Input
                type="text"
                placeholder="Enter customer name"
                value={orderData.customer_name}
                onChange={(e) => setOrderData({ ...orderData, customer_name: e.target.value })}
                autoFocus
                className="text-center text-lg"
              />

              <Button
                variant="primary"
                fullWidth
                onClick={() => setStep(2)}
                disabled={!orderData.customer_name.trim()}
                className="mt-6"
              >
                Next: Build Order →
              </Button>
            </div>
          )}

          {/* Step 2: Build Order */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🛒</div>
                <h2 className="text-2xl font-bold text-neutral-800 font-display">
                  Build Order
                </h2>
                <p className="text-neutral-600 mt-2">
                  For: <span className="font-semibold">{orderData.customer_name}</span>
                </p>
              </div>

              {/* Cart Summary */}
              {orderData.cart.length > 0 && (
                <Card className="bg-green-50 border-2 border-green-300 sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-neutral-800 text-lg">Cart</div>
                      <div className="text-sm text-neutral-600">
                        {getTotalItemCount()} items • {formatPrice(calculateTotal())}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(3)}
                    >
                      Review →
                    </Button>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {orderData.cart.map((cartItem) => (
                      <div key={cartItem.id} className="bg-white p-3 rounded-lg flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {cartItem.menu_item.name}
                            {cartItem.type === 'lugaw' && cartItem.is_spicy && (
                              <span className="ml-1 text-xs">🌶️</span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {formatPrice(cartItem.menu_item.price)} × {cartItem.quantity}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateCartQuantity(cartItem.id, -1)}
                              className="w-6 h-6 rounded bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-sm font-bold"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-bold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(cartItem.id, 1)}
                              className="w-6 h-6 rounded bg-primary-500 hover:bg-primary-600 flex items-center justify-center text-sm font-bold text-white"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(cartItem.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Lugaw Items */}
              <div>
                <h3 className="font-bold text-neutral-800 mb-3 flex items-center gap-2">
                  <span>🍜</span>
                  <span>Lugaw Items</span>
                  {getLugawCount() > 0 && (
                    <span className="text-sm bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {getLugawCount()} in cart
                    </span>
                  )}
                </h3>
                <div className="grid gap-3">
                  {lugawItems.map((item) => (
                    <Card
                      key={item.id}
                      hover
                      onClick={() => openItemBuilder('lugaw', item)}
                      className="cursor-pointer border-2 border-neutral-200 hover:border-primary-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-lg text-neutral-800">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-primary-600 text-lg">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-primary-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Drinks */}
              <div>
                <h3 className="font-bold text-neutral-800 mb-3 flex items-center gap-2">
                  <span>🥤</span>
                  <span>Drinks (Optional)</span>
                  {getDrinksCount() > 0 && (
                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {getDrinksCount()} in cart
                    </span>
                  )}
                </h3>
                <div className="grid gap-3">
                  {drinkItems.map((item) => (
                    <Card
                      key={item.id}
                      hover
                      onClick={() => openItemBuilder('drink', item)}
                      className="cursor-pointer border-2 border-neutral-200 hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-lg text-neutral-800">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-primary-600 text-lg">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-blue-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick action button */}
              {orderData.cart.length > 0 && (
                <div className="pt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setStep(3)}
                  >
                    Review Order ({getTotalItemCount()} items) →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">📋</div>
                <h2 className="text-2xl font-bold text-neutral-800 font-display">
                  Review Order
                </h2>
                <p className="text-neutral-600 mt-2">Check everything before confirming</p>
              </div>

              {/* Customer Info */}
              <Card className="bg-cream-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-600">Customer</div>
                    <div className="font-bold text-xl text-neutral-800">
                      {orderData.customer_name}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    Edit
                  </Button>
                </div>
              </Card>

              {/* Order Items */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-neutral-800">Order Items</h3>
                  <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-3">
                  {orderData.cart.map((cartItem, index) => (
                    <div key={cartItem.id} className="flex justify-between items-start py-3 border-b border-neutral-200 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-800">
                          {cartItem.menu_item.name}
                          {cartItem.type === 'lugaw' && cartItem.is_spicy && (
                            <span className="ml-2">🌶️ Spicy</span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600 mt-1">
                          {formatPrice(cartItem.menu_item.price)} × {cartItem.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-primary-600 text-lg">
                        {formatPrice(cartItem.menu_item.price * cartItem.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Total */}
              <Card className="bg-primary-50 border-2 border-primary-300">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Items:</span>
                    <span className="font-semibold">{getTotalItemCount()} pieces</span>
                  </div>
                  <div className="pt-3 border-t-2 border-primary-200 flex justify-between items-center">
                    <span className="font-bold text-xl">Total Amount:</span>
                    <span className="font-bold text-primary-600 text-3xl">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Confirm Button */}
              <div className="pt-4 space-y-3">
                <Button variant="success" fullWidth onClick={handleSubmit}>
                  ✓ Confirm Order
                </Button>
                <Button variant="outline" fullWidth onClick={() => setStep(2)}>
                  ← Back to Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>

      {/* Item Builder Modal */}
      <Modal
        isOpen={showItemBuilder}
        onClose={() => setShowItemBuilder(false)}
        size="sm"
      >
        {itemBuilder.menu_item && (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {itemBuilder.type === 'lugaw' ? '🍜' : '🥤'}
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">
                {itemBuilder.menu_item.name}
              </h3>
              <p className="text-primary-600 font-bold text-xl mt-1">
                {formatPrice(itemBuilder.menu_item.price)}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setItemBuilder({ ...itemBuilder, quantity: Math.max(1, itemBuilder.quantity - 1) })}
                  className="w-12 h-12 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center font-bold text-xl"
                >
                  −
                </button>
                <span className="text-3xl font-bold w-16 text-center">
                  {itemBuilder.quantity}
                </span>
                <button
                  onClick={() => setItemBuilder({ ...itemBuilder, quantity: itemBuilder.quantity + 1 })}
                  className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center font-bold text-xl text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Spicy Toggle (only for lugaw) */}
            {itemBuilder.type === 'lugaw' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Spice Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    hover
                    onClick={() => setItemBuilder({ ...itemBuilder, is_spicy: false })}
                    className={`
                      cursor-pointer text-center py-4
                      ${!itemBuilder.is_spicy 
                        ? 'border-2 border-primary-500 bg-primary-50' 
                        : 'border-2 border-neutral-200'
                      }
                    `}
                  >
                    <div className="text-3xl mb-1">😊</div>
                    <div className="font-semibold">Not Spicy</div>
                  </Card>
                  <Card
                    hover
                    onClick={() => setItemBuilder({ ...itemBuilder, is_spicy: true })}
                    className={`
                      cursor-pointer text-center py-4
                      ${itemBuilder.is_spicy 
                        ? 'border-2 border-red-500 bg-red-50' 
                        : 'border-2 border-neutral-200'
                      }
                    `}
                  >
                    <div className="text-3xl mb-1">🔥</div>
                    <div className="font-semibold">Spicy!</div>
                  </Card>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="mb-6 p-4 bg-neutral-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-700">Subtotal:</span>
                <span className="font-bold text-primary-600 text-2xl">
                  {formatPrice(itemBuilder.menu_item.price * itemBuilder.quantity)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-2">
              <Button variant="success" fullWidth onClick={addToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" fullWidth onClick={() => setShowItemBuilder(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={handleGoToDashboard} size="sm">
        <div className="text-center py-6">
          <div className="text-6xl mb-4 animate-bounce-subtle">✅</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Order Created!</h2>
          <p className="text-neutral-600 mb-2">
            Order for <span className="font-semibold">{orderData.customer_name}</span>
          </p>
          <p className="text-neutral-600 mb-6">
            <span className="font-bold text-primary-600">{getTotalItemCount()} items</span> •{' '}
            <span className="font-bold text-primary-600">{formatPrice(calculateTotal())}</span>
          </p>

          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={handleAddAnother}>
              ➕ Add Another Order
            </Button>
            <Button variant="secondary" fullWidth onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewOrder;