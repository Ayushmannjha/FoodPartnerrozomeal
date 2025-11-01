import { httpClient } from './httpClient';
import type { Order, AcceptOrderResponse, AssignedOrder, UpdateOrderResponse } from '../types/order';
import type { DashboardStats } from '../types/dashboad';
import { JWTUtils } from './jwtUtils';
import { TokenManager } from '../utils/tokenManager';

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
      throw new Error('Failed to fetch orders');
    }
  },

  // Get pending orders for initial load (all previous orders with status=0)
  async getPendingOrders(foodPartnerId: string, pincode: string): Promise<Order[]> {
    try {
      console.log('🔍 Fetching ALL pending orders for initial load:', { foodPartnerId, pincode });
      console.log('🔗 Request URL: /food-partner/get-orders?userId=' + foodPartnerId);
      
      const response = await httpClient.get<Order[]>(`/food-partner/get-orders?userId=${foodPartnerId}`);
      
      // Filter only pending orders (status = 0)
      const pendingOrders = Array.isArray(response) 
        ? response.filter(order => order.status === 0)
        : [];
      
      console.log(`✅ Found ${pendingOrders.length} pending orders out of ${Array.isArray(response) ? response.length : 0} total orders`);
      console.log('📋 Pending orders:', pendingOrders.map(o => ({ orderId: o.orderId, date: o.date })));
      
      return pendingOrders;
    } catch (error) {
      console.error('❌ Error fetching pending orders:', error);
      // Don't throw - return empty array to allow WebSocket to work
      return [];
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

  // Get assigned orders
  async getAssignedOrders(foodPartnerId: string): Promise<AssignedOrder[]> {
    try {
      console.log('🔍 Fetching assigned orders for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-assigned-order?id=' + foodPartnerId + '&status=1');

      const response = await httpClient.get<any>(`/food-partner/get-assigned-order?id=${foodPartnerId}&status=1`);

      console.log('✅ Raw assigned orders response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Is array:', Array.isArray(response));
      
      if (!Array.isArray(response)) {
        console.warn('⚠️ Expected array but received:', typeof response);
        return [];
      }
      
      const transformedOrders: AssignedOrder[] = response
        .map((directOrder: any, index: number): AssignedOrder | null => {
          console.log(`🔄 Transforming direct order ${index + 1}:`, directOrder);
          
          if (!directOrder || !directOrder.orderId) {
            console.error(`❌ Invalid order structure at index ${index}:`, directOrder);
            return null;
          }
          
          const assignedOrder: AssignedOrder = {
            id: index + 1,
            order: {
              orderId: directOrder.orderId,
              user: directOrder.user,
              foodIds: directOrder.foodIds || [],
              thaliIds: directOrder.thaliIds || [],
              quantity: directOrder.quantity || [],
              price: directOrder.price,
              status: directOrder.status,
              date: directOrder.date
            },
            foodPartner: {
              userId: foodPartnerId,
              name: 'Current Partner',
              state: '',
              city: '',
              address: '',
              licenseNumber: '',
              certifications: ''
            }
          };
          
          console.log(`✅ Transformed order ${index + 1}:`, {
            id: assignedOrder.id,
            orderId: assignedOrder.order.orderId,
            foodIds: assignedOrder.order.foodIds,
            thaliIds: assignedOrder.order.thaliIds
          });
          
          return assignedOrder;
        })
        .filter((order): order is AssignedOrder => order !== null);
      
      console.log(`✅ Successfully transformed ${transformedOrders.length}/${response.length} orders`);
      console.log('🔍 Final transformed orders:', transformedOrders);
      
      return transformedOrders;
    } catch (error) {
      console.error('❌ Error fetching assigned orders:', error);
      throw new Error('Failed to fetch assigned orders');
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: number): Promise<UpdateOrderResponse> {
    try {
      console.log('🔄 Updating order status:', { orderId, status });
      console.log('🔗 Request URL: /food-partner/update-order?orderId=' + orderId + '&status=' + status);
      
      const response = await httpClient.put<UpdateOrderResponse>(`/food-partner/update-order?orderId=${orderId}&status=${status}`);
      
      console.log('✅ Order status updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  async updateChartId(foodPartnerId: string, chartId: string): Promise<any> {
    try {
      console.log('🔄 Updating chart ID:', { foodPartnerId, chartId });
      console.log('🔗 Request URL: /food-partner/update-chart-id?fid=' + foodPartnerId + '&chartId=' + chartId);
      const response = await httpClient.post<any>(`/food-partner/save-telegram-data?fid=${foodPartnerId}&chartId=${chartId}`);
      console.log('✅ Chart ID updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating chart ID:', error);
      throw new Error('Failed to update chart ID');
    }
  },

  async dashboard ():Promise<DashboardStats> {
    try {

      const token=TokenManager.getToken();
      if(!token){
        throw new Error('No authentication token found');
      }

      const userId=JWTUtils.getUserId(token);
      if(!userId){
        throw new Error('Invalid token: Unable to extract user ID');
      }

      if(!TokenManager.hasValidToken()){
        throw new Error('Authentication token is invalid or expired');
      }

      //GET DASHBOARD DATA



      console.log('🔍 Fetching dashboard data for food partner:', userId);
      console.log('🔗 Request URL: /food-partner/dashboard?id=' + userId);
      const response= await httpClient.get<DashboardStats>(`/food-partner/dashboard-data?id=${userId}`);
      console.log('✅ Dashboard data received:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }, // ✅ Added missing comma here

  async getHistoryOrders(foodPartnerId: string): Promise<AssignedOrder[]> {
    try {
      console.log('🔍 Fetching assigned orders for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-assigned-order?id=' + foodPartnerId + '&status=3');

      const response = await httpClient.get<any>(`/food-partner/get-assigned-order?id=${foodPartnerId}&status=2`);

      console.log('✅ Raw assigned orders response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Is array:', Array.isArray(response));
      
      if (!Array.isArray(response)) {
        console.warn('⚠️ Expected array but received:', typeof response);
        return [];
      }
      
      const transformedOrders: AssignedOrder[] = response
        .map((directOrder: any, index: number): AssignedOrder | null => {
          console.log(`🔄 Transforming direct order ${index + 1}:`, directOrder);
          
          if (!directOrder || !directOrder.orderId) {
            console.error(`❌ Invalid order structure at index ${index}:`, directOrder);
            return null;
          }
          
          const assignedOrder: AssignedOrder = {
            id: index + 1,
            order: {
              orderId: directOrder.orderId,
              user: directOrder.user,
              foodIds: directOrder.foodIds || [],
              thaliIds: directOrder.thaliIds || [],
              quantity: directOrder.quantity || [],
              price: directOrder.price,
              status: directOrder.status,
              date: directOrder.date
            },
            foodPartner: {
              userId: foodPartnerId,
              name: 'Current Partner',
              state: '',
              city: '',
              address: '',
              licenseNumber: '',
              certifications: ''
            }
          };
          
          console.log(`✅ Transformed order ${index + 1}:`, {
            id: assignedOrder.id,
            orderId: assignedOrder.order.orderId,
            foodIds: assignedOrder.order.foodIds,
            thaliIds: assignedOrder.order.thaliIds
          });
          
          return assignedOrder;
        })
        .filter((order): order is AssignedOrder => order !== null);
      
      console.log(`✅ Successfully transformed ${transformedOrders.length}/${response.length} orders`);
      console.log('🔍 Final transformed orders:', transformedOrders);
      
      return transformedOrders;
    } catch (error) {
      console.error('❌ Error fetching assigned orders:', error);
      throw new Error('Failed to fetch assigned orders');
    }
  },

};