import { useState, useEffect, useCallback } from 'react';
import { assignedFoodService } from '../services/assignedFoodService';
import type { FlattenedAssignedFood } from '../types/assignedFood';
import { useAuth } from '../context/AuthContext';
import { dataCache, CACHE_KEYS, CACHE_TTL } from '../utils/dataCache';

export const useAssignedFood = () => {
  const [assignedFoods, setAssignedFoods] = useState<FlattenedAssignedFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const foodPartnerId = user?.id || null;

  const fetchAssignedFood = useCallback(async (forceRefresh = false) => {
    if (!foodPartnerId) {
      setError('Food partner not authenticated');
      setLoading(false);
      return;
    }

    const cacheKey = CACHE_KEYS.ASSIGNED_FOOD(foodPartnerId);
    if (!forceRefresh) {
      const cachedData = dataCache.get<FlattenedAssignedFood[]>(cacheKey);
      if (cachedData) {
        console.log('🎯 Using cached assigned food data');
        setAssignedFoods(cachedData);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const assignedFoodData = await assignedFoodService.getAssignedFood(foodPartnerId);
      setAssignedFoods(assignedFoodData);
      dataCache.set(cacheKey, assignedFoodData, CACHE_TTL.MEDIUM);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assigned food';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [foodPartnerId]);

  const toggleAvailability = useCallback(async (assignedFoodId: string, isAvailable: boolean) => {
    try {
      await assignedFoodService.toggleFoodAvailability(assignedFoodId, isAvailable);
      
      setAssignedFoods(prev => 
        prev.map(food => 
          food.id === assignedFoodId 
            ? { ...food, isAvailable } 
            : food
        )
      );
      
      if (foodPartnerId) {
        dataCache.delete(CACHE_KEYS.ASSIGNED_FOOD(foodPartnerId));
      }
      
      return { success: true, message: 'Availability updated successfully' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update availability';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [foodPartnerId]);

  useEffect(() => {
    if (foodPartnerId) {
      fetchAssignedFood();
    }
  }, [foodPartnerId, fetchAssignedFood]);

  return {
    assignedFoods,
    loading,
    error,
    refetch: useCallback(() => fetchAssignedFood(true), [fetchAssignedFood]),
    toggleAvailability,
    clearError: useCallback(() => setError(null), [])
  };
};
