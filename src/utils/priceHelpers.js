export const formatPrice = (amount) => {
  if (amount == null || isNaN(amount)) return '₱0.00';
  return `₱${Number(amount).toFixed(2)}`;
};

export const formatPriceShort = (amount) => {
  if (amount == null || isNaN(amount)) return '₱0';
  const num = Number(amount);
  if (num % 1 === 0) return `₱${num}`;
  return `₱${num.toFixed(2)}`;
};

export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const cleaned = String(priceString).replace(/[₱,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

export default {
  formatPrice,
  formatPriceShort,
  parsePrice,
  calculateTotal
};