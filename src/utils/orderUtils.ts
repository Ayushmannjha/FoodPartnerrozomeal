export const getOrderStatusText = (status: number): string => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Accepted';
    case 2: return 'In Progress';
    case 3: return 'Completed';
    case 4: return 'Cancelled';
    default: return 'Unknown';
  }
};

export const getOrderStatusColor = (status: number): string => {
  switch (status) {
    case 0: return 'bg-yellow-500 text-yellow-900';
    case 1: return 'bg-blue-500 text-blue-900';
    case 2: return 'bg-orange-500 text-orange-900';
    case 3: return 'bg-green-500 text-green-900';
    case 4: return 'bg-red-500 text-red-900';
    default: return 'bg-gray-500 text-gray-900';
  }
};

export const getTotalQuantity = (quantities: number[]): number => {
  return quantities.reduce((total, qty) => total + qty, 0);
};

export const formatOrderId = (orderId: string): string => {
  return `#${orderId.slice(0, 8).toUpperCase()}`;
};

export const canAcceptOrder = (status: number): boolean => {
  return status === 0; // Only pending orders can be accepted
};