import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import type { AssignedOrder } from '../types/order';
import { useAuth } from '../context/AuthContext';

interface UseHistoryOrdersReturn {
  orders: AssignedOrder[];
  filteredOrders: AssignedOrder[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setDateRange: (range: DateRange) => void;
  setSortBy: (sort: SortOption) => void;
  stats: HistoryStats;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

interface HistoryStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export function useHistoryOrders(): UseHistoryOrdersReturn {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Fetch history orders
  const fetchHistoryOrders = useCallback(async () => {
    if (!user?.id) {
      console.log('⏭️ No user ID available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('📜 Fetching order history...');
      const data = await orderService.getHistoryOrders(user.id);

      console.log('✅ Order history received:', data.length, 'orders');
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error('❌ Error fetching order history:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order history';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchHistoryOrders();
  }, [fetchHistoryOrders]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (assignedOrder) =>
          assignedOrder.order.orderId.toLowerCase().includes(term) ||
          assignedOrder.order.user.name.toLowerCase().includes(term) ||
          assignedOrder.order.user.phone.includes(term)
      );
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      result = result.filter((assignedOrder) => {
        const orderDate = new Date(assignedOrder.order.date);
        return (
          orderDate >= dateRange.startDate! &&
          orderDate <= dateRange.endDate!
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.order.date).getTime() - new Date(a.order.date).getTime();
        case 'date-asc':
          return new Date(a.order.date).getTime() - new Date(b.order.date).getTime();
        case 'amount-desc':
          return b.order.price - a.order.price;
        case 'amount-asc':
          return a.order.price - b.order.price;
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, dateRange, sortBy]);

  // Calculate statistics
  const stats: HistoryStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, assignedOrder) => sum + assignedOrder.order.price, 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, assignedOrder) => sum + assignedOrder.order.price, 0) / orders.length 
      : 0,
    thisWeekOrders: orders.filter((assignedOrder) => {
      const orderDate = new Date(assignedOrder.order.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    }).length,
    thisMonthOrders: orders.filter((assignedOrder) => {
      const orderDate = new Date(assignedOrder.order.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return orderDate >= monthAgo;
    }).length,
  };

  return {
    orders,
    filteredOrders,
    loading,
    error,
    refresh: fetchHistoryOrders,
    setSearchTerm,
    setDateRange,
    setSortBy,
    stats,
  };
}
