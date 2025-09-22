// src/components/order/OrderList.tsx
import { useState, useEffect } from 'react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '../../types/order';
import { OrderCard } from './OrderCard';
import { OrderStats } from './OrderStats';
import { OrderFilters } from './OrderFilters';
import { EmptyOrderState } from './EmptyOrderState';

interface OrderListProps {
  orders: Order[];
  onAccept: (orderId: string) => Promise<{ success: boolean; message: string }>;
  isAccepting: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export function OrderList({ orders, onAccept, isAccepting, onRefresh, isLoading }: OrderListProps) {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleFilterChange = (filters: {
    status: string;
    search: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    let filtered = orders;

    // Filter by status
    if (filters.status !== 'All Status') {
      filtered = filtered.filter(order => {
        const statusLabel = ORDER_STATUS_LABELS[order.status as OrderStatus];
        return statusLabel === filters.status;
      });
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(order => 
        new Date(order.date) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(order => 
        new Date(order.date) <= new Date(filters.dateTo!)
      );
    }

    setFilteredOrders(filtered);
  };

  // Update filtered orders when orders prop changes
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  return (
    <div>
      <OrderStats orders={orders} />
      <OrderFilters onFilterChange={handleFilterChange} />
      
      {filteredOrders.length === 0 ? (
        <EmptyOrderState 
          title="No Orders Found"
          description="No orders match your current filters or there are no orders available."
          actionButton={
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh Orders'}
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onAccept={onAccept}
              isAccepting={isAccepting}
            />
          ))}
        </div>
      )}
    </div>
  );
}