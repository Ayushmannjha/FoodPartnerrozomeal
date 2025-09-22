// src/hooks/useAssignedOrders.ts
import { useState, useEffect, useRef } from 'react';
import { orderService } from '../services/orderService';
import { foodService } from '../services/foodService';
import { thaliService } from '../services/thaliService';
import { AssignedOrder, OrderStatus, UpdateOrderResponse } from '../types/order';
import { Food } from '../types/food';
import { Thali } from '../types/thali';
import { useAuth } from '../context/AuthContext';

export interface AssignedOrderWithDetails extends AssignedOrder {
  foodDetails: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  thaliDetails: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const useAssignedOrders = (autoRefresh = true, refreshInterval = 5000) => {
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const foodPartnerId = user?.id || null;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAssignedOrdersWithDetails = async (showLoading = true) => {
    if (!foodPartnerId) {
      setError('Food partner not authenticated');
      setLoading(false);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching assigned orders for food partner:', foodPartnerId);
      
      // 🎯 This now returns properly formatted AssignedOrder[] from orderService
      const assignedOrdersData = await orderService.getAssignedOrders(foodPartnerId);
      
      console.log('✅ Assigned orders data received:', assignedOrdersData);
      
      if (!Array.isArray(assignedOrdersData) || assignedOrdersData.length === 0) {
        console.log('📭 No assigned orders found');
        setAssignedOrders([]);
        return;
      }

      // 🎯 Now we can safely access assignedOrder.order properties
      const ordersWithDetails = await Promise.all(
        assignedOrdersData.map(async (assignedOrder, index): Promise<AssignedOrderWithDetails | null> => {
          try {
            console.log(`🔄 Processing assigned order ${index + 1}:`, {
              id: assignedOrder.id,
              orderId: assignedOrder.order.orderId,
              foodIds: assignedOrder.order.foodIds,
              thaliIds: assignedOrder.order.thaliIds
            });
            
            const order = assignedOrder.order;

            // 🎯 FIX: Explicitly type foodDetails as Food[]
            let foodDetails: Food[] = [];
            if (order.foodIds && order.foodIds.length > 0) {
              try {
                foodDetails = await foodService.getMultipleFoodDetails(order.foodIds);
                console.log(`✅ Food details fetched for order ${order.orderId}:`, foodDetails.length);
              } catch (foodError) {
                console.error(`❌ Error fetching food details for order ${order.orderId}:`, foodError);
                foodDetails = [];
              }
            }

            // 🎯 FIX: Explicitly type thaliDetails as Thali[]
            let thaliDetails: Thali[] = [];
            if (order.thaliIds && order.thaliIds.length > 0) {
              try {
                thaliDetails = await thaliService.getMultipleThaliDetails(order.thaliIds);
                console.log(`✅ Thali details fetched for order ${order.orderId}:`, thaliDetails.length);
              } catch (thaliError) {
                console.error(`❌ Error fetching thali details for order ${order.orderId}:`, thaliError);
                thaliDetails = [];
              }
            }

            // 🎯 FIX: Use typed arrays with proper type annotations
            const enrichedFoodDetails = foodDetails.map((food: Food, foodIndex: number) => ({
              ...food,
              quantity: order.quantity[foodIndex] || 1
            }));

            const enrichedThaliDetails = thaliDetails.map((thali: Thali, thaliIndex: number) => ({
              ...thali,
              quantity: order.quantity[(order.foodIds?.length || 0) + thaliIndex] || 1
            }));

            return {
              ...assignedOrder,
              foodDetails: enrichedFoodDetails,
              thaliDetails: enrichedThaliDetails
            } as AssignedOrderWithDetails;
          } catch (detailError) {
            console.error(`❌ Error processing order ${index + 1}:`, detailError);
            return null;
          }
        })
      );

      // 🎯 FIX: Filter out failed orders with proper type guard
      const successfulOrders = ordersWithDetails.filter((order): order is AssignedOrderWithDetails => order !== null);
      
      console.log(`✅ Successfully processed ${successfulOrders.length}/${assignedOrdersData.length} orders`);
      
      setAssignedOrders(successfulOrders);
    } catch (err) {
      console.error('❌ Error in fetchAssignedOrdersWithDetails:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assigned orders';
      setError(errorMessage);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (updatingOrderId) {
      return { success: false, message: 'Another order is being updated' };
    }

    try {
      setUpdatingOrderId(orderId);
      setError(null);
      
      console.log('🔄 Updating order status:', { orderId, newStatus });
      
      const updateResponse: UpdateOrderResponse = await orderService.updateOrderStatus(orderId, newStatus);
      
      console.log('✅ Order update response:', updateResponse);
      
      // Update local state with the response data
      setAssignedOrders(prev => 
        prev.map(assignedOrder => 
          assignedOrder.order.orderId === orderId 
            ? { 
                ...assignedOrder, 
                order: { 
                  ...assignedOrder.order, 
                  status: updateResponse.status,
                  price: updateResponse.price,
                  date: updateResponse.date,
                  quantity: updateResponse.quantity,
                  foodIds: updateResponse.foodIds,
                  thaliIds: updateResponse.thaliIds || [],
                  user: updateResponse.user
                }
              }
            : assignedOrder
        )
      );
      
      return { 
        success: true, 
        message: `Order status updated to ${newStatus}`,
        data: updateResponse
      };
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Auto-refresh functionality
  const startAutoRefresh = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing assigned orders...');
      fetchAssignedOrdersWithDetails(false);
    }, refreshInterval);
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    if (foodPartnerId) {
      console.log('🔄 useAssignedOrders useEffect triggered with foodPartnerId:', foodPartnerId);
      fetchAssignedOrdersWithDetails();
      
      if (autoRefresh) {
        startAutoRefresh();
      }
    } else {
      console.log('⏳ Waiting for foodPartnerId...');
    }

    return () => {
      stopAutoRefresh();
    };
  }, [foodPartnerId, autoRefresh, refreshInterval]);

  return {
    assignedOrders,
    loading,
    error,
    updatingOrderId,
    refetch: () => fetchAssignedOrdersWithDetails(true),
    updateOrderStatus,
    clearError: () => setError(null),
    foodPartnerId,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing: intervalRef.current !== null
  };
};