import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { DashboardStats } from '../types/dashboad';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching dashboard stats...');
      const data = await orderService.dashboard();
      
      console.log('✅ Dashboard stats received:', data);
      setStats(data);
    } catch (err) {
      console.error('❌ Error fetching dashboard stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh function for manual refresh
  const refresh = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}