import { useState } from 'react';
import { orderService } from '../services/orderService';

export const useOrderAccept = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptOrder = async (orderId: string, foodPartnerId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.acceptOrder(orderId, foodPartnerId);
      
      return {
        success: true,
        data: response,
        message: response.message || 'Order accepted successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      setError(errorMessage);
      
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptOrder,
    loading,
    error,
    clearError: () => setError(null)
  };
};