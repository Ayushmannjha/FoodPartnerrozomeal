import { useState, useEffect } from 'react';
import { foodService } from '../services/foodService';
import { Food } from '../types/food';

export const useFoodDetails = (foodId: string | null) => {
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!foodId) {
      setFood(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const foodData = await foodService.getFoodDetail(foodId);
        setFood(foodData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch food details';
        setError(errorMessage);
        setFood(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  return { food, loading, error };
};