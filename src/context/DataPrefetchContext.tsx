import { createContext, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { dataCache, CACHE_KEYS } from '../utils/dataCache';
import { orderService } from '../services/orderService';
import { assignedFoodService } from '../services/assignedFoodService';

interface DataPrefetchContextType {
  prefetchDashboardData: () => Promise<void>;
  prefetchOrderData: () => Promise<void>;
  prefetchAssignedFoodData: () => Promise<void>;
}

const DataPrefetchContext = createContext<DataPrefetchContextType | undefined>(undefined);

export const useDataPrefetch = () => {
  const context = useContext(DataPrefetchContext);
  if (!context) {
    throw new Error('useDataPrefetch must be used within a DataPrefetchProvider');
  }
  return context;
};

interface DataPrefetchProviderProps {
  children: React.ReactNode;
}

export const DataPrefetchProvider: React.FC<DataPrefetchProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const foodPartnerId = user?.id;
  const pincode = user?.pincode;

  // Prefetch orders data in background
  const prefetchOrderData = useCallback(async () => {
    if (!foodPartnerId) return;

    const ordersKey = CACHE_KEYS.ORDERS(foodPartnerId);
    const assignedOrdersKey = CACHE_KEYS.ASSIGNED_ORDERS(foodPartnerId);

    // Check if data is already cached
    if (dataCache.has(ordersKey) && dataCache.has(assignedOrdersKey)) {
      console.log('🎯 Order data already cached');
      return;
    }

    try {
      console.log('🚀 Prefetching order data...');
      
      // Prefetch both orders and assigned orders in parallel
      const [orders, assignedOrders] = await Promise.allSettled([
        !dataCache.has(ordersKey) ? orderService.getAllOrders(foodPartnerId) : Promise.resolve([]),
        !dataCache.has(assignedOrdersKey) ? orderService.getAssignedOrders(foodPartnerId) : Promise.resolve([])
      ]);

      if (orders.status === 'fulfilled' && orders.value.length > 0) {
        dataCache.set(ordersKey, orders.value);
        console.log('✅ Orders data prefetched');
      }

      if (assignedOrders.status === 'fulfilled' && assignedOrders.value.length > 0) {
        dataCache.set(assignedOrdersKey, assignedOrders.value);
        console.log('✅ Assigned orders data prefetched');
      }
    } catch (error) {
      console.error('❌ Error prefetching order data:', error);
    }
  }, [foodPartnerId]);

  // Prefetch assigned food data
  const prefetchAssignedFoodData = useCallback(async () => {
    if (!foodPartnerId) return;

    const cacheKey = CACHE_KEYS.ASSIGNED_FOOD(foodPartnerId);
    
    if (dataCache.has(cacheKey)) {
      console.log('🎯 Assigned food data already cached');
      return;
    }

    try {
      console.log('🚀 Prefetching assigned food data...');
      const assignedFoodData = await assignedFoodService.getAssignedFood(foodPartnerId);
      dataCache.set(cacheKey, assignedFoodData);
      console.log('✅ Assigned food data prefetched');
    } catch (error) {
      console.error('❌ Error prefetching assigned food data:', error);
    }
  }, [foodPartnerId]);

  // Prefetch all dashboard data
  const prefetchDashboardData = useCallback(async () => {
    if (!foodPartnerId) return;

    console.log('🚀 Prefetching all dashboard data...');
    
    // Prefetch data in sequence to avoid overwhelming the API
    await prefetchAssignedFoodData();
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await prefetchOrderData();
    
    console.log('✅ All dashboard data prefetched');
  }, [foodPartnerId, prefetchAssignedFoodData, prefetchOrderData]);

  // Auto-prefetch when user logs in or changes
  useEffect(() => {
    if (foodPartnerId) {
      // Use a small delay to let the auth context stabilize
      const timer = setTimeout(() => {
        prefetchDashboardData();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [foodPartnerId, prefetchDashboardData]);

  // Prefetch data when user becomes active (focus events)
  useEffect(() => {
    const handleFocus = () => {
      if (foodPartnerId && document.visibilityState === 'visible') {
        console.log('🔄 Page focused, refreshing cache...');
        // Clear cache and prefetch fresh data
        if (foodPartnerId) {
          dataCache.delete(CACHE_KEYS.ORDERS(foodPartnerId));
          dataCache.delete(CACHE_KEYS.ASSIGNED_ORDERS(foodPartnerId));
          dataCache.delete(CACHE_KEYS.ASSIGNED_FOOD(foodPartnerId));
        }
        prefetchDashboardData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [foodPartnerId, prefetchDashboardData]);

  const value = {
    prefetchDashboardData,
    prefetchOrderData,
    prefetchAssignedFoodData,
  };

  return (
    <DataPrefetchContext.Provider value={value}>
      {children}
    </DataPrefetchContext.Provider>
  );
};
