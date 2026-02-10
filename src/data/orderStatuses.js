export const orderStatuses = [
  {
    id: 'pending',
    name: 'Pending',
    icon: '⏱️',
    color: 'warning',
    description: 'Order received, not yet started'
  },
  {
    id: 'preparing',
    name: 'Preparing',
    icon: '👨‍🍳',
    color: 'blue',
    description: 'Currently being prepared'
  },
  {
    id: 'ready',
    name: 'Ready',
    icon: '✅',
    color: 'purple',
    description: 'Ready for pickup/serving'
  },
  {
    id: 'served',
    name: 'Served',
    icon: '🍽️',
    color: 'green',
    description: 'Delivered to customer'
  },
  {
    id: 'completed',
    name: 'Completed',
    icon: '✔️',
    color: 'neutral',
    description: 'Order finished and paid'
  }
];

export const getStatusInfo = (statusId) => {
  return orderStatuses.find(s => s.id === statusId) || orderStatuses[0];
};

export default orderStatuses;