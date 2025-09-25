import { useState, useEffect, useRef, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { foodService } from '../services/foodService';
import { thaliService } from '../services/thaliService';
import type { OrderWithDetails } from '../types/order';
import { useAuth } from '../context/AuthContext';
import { dataCache, CACHE_KEYS, CACHE_TTL } from '../utils/dataCache';

export const useOrders = (autoRefresh = true, refreshInterval = 3000) => { // Increased interval to 30s
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const foodPartnerId = user?.id || null;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Batch fetch food and thali details
  const batchFetchDetails = useCallback(async (orders: any[]) => {
    const allFoodIds = new Set<string>();
    const allThaliIds = new Set<string>();

    // Collect all unique IDs
    orders.forEach(order => {
      order.foodIds?.forEach((id: string) => allFoodIds.add(id));
      order.thaliIds?.forEach((id: string) => allThaliIds.add(id));
    });

    // Batch fetch with caching
    const [foodDetailsMap, thaliDetailsMap] = await Promise.all([
      fetchFoodDetailsWithCache(Array.from(allFoodIds)),
      fetchThaliDetailsWithCache(Array.from(allThaliIds))
    ]);

    return { foodDetailsMap, thaliDetailsMap };
  }, []);

  // Cached food details fetching
  const fetchFoodDetailsWithCache = useCallback(async (foodIds: string[]) => {
    if (foodIds.length === 0) return new Map();

    const cacheKey = CACHE_KEYS.FOOD_DETAILS(foodIds);
    const cached = dataCache.get<Map<string, any>>(cacheKey);
    
    if (cached) {
      console.log('🎯 Using cached food details');
      return cached;
    }

    try {
      const foodDetails = await foodService.getMultipleFoodDetails(foodIds);
      const foodMap = new Map(foodDetails.map(food => [food.id, food]));
      
      // Cache for 15 minutes (food details don't change often)
      dataCache.set(cacheKey, foodMap, CACHE_TTL.LONG);
      
      return foodMap;
    } catch (error) {
      console.error('Error fetching food details:', error);
      return new Map();
    }
  }, []);

  // Cached thali details fetching
  const fetchThaliDetailsWithCache = useCallback(async (thaliIds: string[]) => {
    if (thaliIds.length === 0) return new Map();

    const cacheKey = CACHE_KEYS.THALI_DETAILS(thaliIds);
    const cached = dataCache.get<Map<string, any>>(cacheKey);
    
    if (cached) {
      console.log('🎯 Using cached thali details');
      return cached;
    }

    try {
      const thaliDetails = await thaliService.getMultipleThaliDetails(thaliIds);
      const thaliMap = new Map(thaliDetails.map(thali => [thali.id, thali]));
      
      // Cache for 15 minutes
      dataCache.set(cacheKey, thaliMap, CACHE_TTL.LONG);
      
      return thaliMap;
    } catch (error) {
      console.error('Error fetching thali details:', error);
      return new Map();
    }
  }, []);

  const fetchOrdersWithDetails = useCallback(async (showLoading = true, forceRefresh = false) => {
    if (!foodPartnerId) {
      setError('Food partner not authenticated');
      setLoading(false);
      return;
    }

    // Check cache first (unless force refresh)
    const cacheKey = CACHE_KEYS.ORDERS(foodPartnerId);
    if (!forceRefresh) {
      const cachedOrders = dataCache.get<OrderWithDetails[]>(cacheKey);
      if (cachedOrders) {
        console.log('🎯 Using cached orders data');
        setOrders(cachedOrders);
        setLoading(false);
        return;
      }
    }

    try {
      if (showLoading) setLoading(true);
      setError(null);

      console.log('🔍 Fetching fresh orders for food partner:', foodPartnerId);

      // Fetch orders
      const ordersData = await orderService.getAllOrders(foodPartnerId);
      console.log('✅ Orders data received:', ordersData);

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        dataCache.set(cacheKey, [], CACHE_TTL.SHORT);
        return;
      }

      // Batch fetch all details
      const { foodDetailsMap, thaliDetailsMap } = await batchFetchDetails(ordersData);

      // Combine orders with details
      const ordersWithDetails = ordersData.map(order => {
        const foodDetails = order.foodIds?.map(id => foodDetailsMap.get(id)).filter(Boolean) || [];
        const thaliDetails = order.thaliIds?.map(id => thaliDetailsMap.get(id)).filter(Boolean) || [];

        return {
          ...order,
          foodDetails,
          thaliDetails
        };
      });

      setOrders(ordersWithDetails);
      
      // Cache the results for 2 minutes (orders change frequently)
      dataCache.set(cacheKey, ordersWithDetails, CACHE_TTL.SHORT);
      
      console.log('✅ Orders with details processed:', ordersWithDetails.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('❌ Error in fetchOrdersWithDetails:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [foodPartnerId, batchFetchDetails]);

  const acceptOrder = useCallback(async (orderId: string, foodPartnerId: string) => {
    if (!foodPartnerId) {
      const errorMessage = 'Food partner not authenticated';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }

    try {
      console.log('🎯 Accepting order:', orderId, 'for food partner:', foodPartnerId);
      
      const response = await orderService.acceptOrder(orderId, foodPartnerId);
      console.log('✅ Order acceptance response:', response);
      
      // Remove accepted order from the list and invalidate cache
      setOrders(prev => prev.filter(order => order.orderId !== orderId));
      dataCache.delete(CACHE_KEYS.ORDERS(foodPartnerId));
      dataCache.delete(CACHE_KEYS.ASSIGNED_ORDERS(foodPartnerId));
      
      return { success: true, message: 'Order accepted successfully', data: response };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      setError(errorMessage);
      console.error('❌ Error accepting order:', err);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Optimized auto-refresh with smart caching
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing orders...');
      // Use cache if available, force refresh every 5th time
      const shouldForceRefresh = Math.random() < 0.2; // 20% chance to force refresh
      fetchOrdersWithDetails(false, shouldForceRefresh);
    }, refreshInterval);
  }, [fetchOrdersWithDetails, refreshInterval]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    if (foodPartnerId) {
      console.log('🔄 useOrders useEffect triggered with foodPartnerId:', foodPartnerId);
      fetchOrdersWithDetails();
      
      if (autoRefresh) {
        startAutoRefresh();
      }
    } else {
      console.log('⏳ Waiting for foodPartnerId...');
    }

    return () => {
      stopAutoRefresh();
    };
  }, [foodPartnerId, autoRefresh, fetchOrdersWithDetails, startAutoRefresh, stopAutoRefresh]);

  return {
    orders,
    loading,
    error,
    refetch: useCallback(() => fetchOrdersWithDetails(true, true), [fetchOrdersWithDetails]),
    acceptOrder,
    clearError: useCallback(() => setError(null), []),
    foodPartnerId,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing: intervalRef.current !== null
  };
};