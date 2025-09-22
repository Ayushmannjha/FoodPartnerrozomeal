import { httpClient } from './httpClient';
import { Food } from '../types/food';
import { Order, AcceptOrderResponse, AssignedOrder, UpdateOrderResponse } from '../types/order';

export const foodService = {
  // Get food details by ID
  async getFoodDetail(foodId: string): Promise<Food> {
    try {
      console.log('🔍 Fetching food detail for ID:', foodId);
      const response = await httpClient.get<Food>(`/food-partner/food-detail?foodId=${foodId}`);
      console.log('✅ Food detail received:', response);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching food details for ID ${foodId}:`, error);
      throw new Error(`Failed to fetch food details for ID ${foodId}`);
    }
  },

  // Get multiple food details
  async getMultipleFoodDetails(foodIds: string[]): Promise<Food[]> {
    try {
      console.log('🔍 Fetching multiple food details for IDs:', foodIds);
      
      if (!Array.isArray(foodIds) || foodIds.length === 0) {
        console.log('📭 No food IDs provided');
        return [];
      }
      
      const promises = foodIds.map(id => this.getFoodDetail(id));
      const results = await Promise.all(promises);
      
      console.log('✅ Multiple food details fetched:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Error fetching multiple food details:', error);
      throw new Error('Failed to fetch food details');
    }
  }
};

export const orderService = {
  // Get all orders
  async getAllOrders(foodPartnerId: string): Promise<Order[]> {
    try {
      console.log('🔍 Making API call to get orders for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-orders?userId=' + foodPartnerId);
      
      const response = await httpClient.get<Order[]>(`/food-partner/get-orders?userId=${foodPartnerId}`);
      
      console.log('✅ API Response received:', response);
      console.log('📊 Orders count:', Array.isArray(response) ? response.length : 'Not an array');
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      
      throw new Error('Failed to fetch orders');
    }
  },

  // Accept order
  async acceptOrder(orderId: string, foodPartnerId: string): Promise<AcceptOrderResponse> {
    try {
      console.log('🎯 Accepting order:', { orderId, foodPartnerId });
      console.log('🔗 Request URL: /food-partner/accept?orderId=' + orderId + '&fid=' + foodPartnerId);
      
      const response = await httpClient.post<AcceptOrderResponse>(`/food-partner/accept?orderId=${orderId}&fid=${foodPartnerId}`);
      
      console.log('✅ Order accepted successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error accepting order:', error);
      throw new Error('Failed to accept order');
    }
  },

  // Get assigned orders for food partner
  async getAssignedOrders(foodPartnerId: string): Promise<AssignedOrder[]> {
    try {
      console.log('🔍 Fetching assigned orders for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-assigned-order?id=' + foodPartnerId);
      
      const response = await httpClient.get<AssignedOrder[]>(`/food-partner/get-assigned-order?id=${foodPartnerId}&status=0`);
      
      console.log('✅ Assigned orders received:', response);
      console.log('📊 Assigned orders count:', Array.isArray(response) ? response.length : 'Not an array');
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching assigned orders:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      
      throw new Error('Failed to fetch assigned orders');
    }
  },

  // 🎯 Updated update order status to handle the actual response format
  async updateOrderStatus(orderId: string, status: number): Promise<UpdateOrderResponse> {
    try {
      console.log('🔄 Updating order status:', { orderId, status });
      console.log('🔗 Request URL: /food-partner/update-order?orderId=' + orderId + '&status=' + status);
      
      const response = await httpClient.put<UpdateOrderResponse>(`/food-partner/update-order?orderId=${orderId}&status=${status}`);
      
      console.log('✅ Order status updated successfully:', response);
      console.log('📊 Updated order details:', {
        orderId: response.orderId,
        status: response.status,
        price: response.price,
        pincode: response.pincode,
        assigned: response.assigned
      });
      
      return response;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      
      throw new Error('Failed to update order status');
    }
  }
};