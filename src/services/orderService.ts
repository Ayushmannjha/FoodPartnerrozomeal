import { httpClient } from './httpClient';
import { Order, AcceptOrderResponse, AssignedOrder, UpdateOrderResponse } from '../types/order';
import { getStompClient } from "./stompClient";
export const orderService = {
  // Get all orders
async getAllOrders(foodPartnerId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const stompClient = getStompClient();

      if (!stompClient || !stompClient.connected) {
        return reject("❌ STOMP client not connected");
      }

      // Subscribe to topic first
      const subscription = stompClient.subscribe(
        `/topic/food-orders/${foodPartnerId}`,
        (message) => {
          try {
            const orders: Order[] = JSON.parse(message.body);
            console.log("📩 Orders received via WS:", orders);
            resolve(orders);
          } catch (err) {
            console.error("❌ Failed to parse orders:", err);
            reject(err);
          } finally {
            subscription.unsubscribe();
          }
        },
        { id: `getOrders-sub-${foodPartnerId}` }
      );

      // Send request to backend
      stompClient.publish({
        destination: "/app/getOrders",
        body: JSON.stringify(foodPartnerId),
      });
    });
  },

  subscribeToNewOrders(foodPartnerId: string, callback: (order: Order) => void) {
    const stompClient = getStompClient();
    if (!stompClient || !stompClient.connected) {
      console.error("❌ Cannot subscribe, STOMP not connected");
      return;
    }

    return stompClient.subscribe(
      `/topic/food-orders/${foodPartnerId}`,
      (message) => {
        try {
          const order: Order = JSON.parse(message.body);
          console.log("📢 New order received:", order);
          callback(order);
        } catch (err) {
          console.error("❌ Failed to parse new order:", err);
        }
      },
      { id: `food-orders-${foodPartnerId}` }
    );
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

  // 🎯 FIXED: Handle direct order structure from backend with proper TypeScript types
  async getAssignedOrders(foodPartnerId: string): Promise<AssignedOrder[]> {
    try {
      console.log('🔍 Fetching assigned orders for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-assigned-order?id=' + foodPartnerId + '&status=0');
      
      const response = await httpClient.get<any>(`/food-partner/get-assigned-order?id=${foodPartnerId}&status=0`);
      
      console.log('✅ Raw assigned orders response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Is array:', Array.isArray(response));
      
      if (!Array.isArray(response)) {
        console.warn('⚠️ Expected array but received:', typeof response);
        return [];
      }
      
      // 🎯 Transform direct order objects to AssignedOrder format
      const transformedOrders: AssignedOrder[] = response
        .map((directOrder: any, index: number): AssignedOrder | null => {
          console.log(`🔄 Transforming direct order ${index + 1}:`, directOrder);
          
          // Validate that this is a direct order object
          if (!directOrder || !directOrder.orderId) {
            console.error(`❌ Invalid order structure at index ${index}:`, directOrder);
            return null;
          }
          
          // Create AssignedOrder structure from direct order
          const assignedOrder: AssignedOrder = {
            id: index + 1, // Generate an ID since it's not provided
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
        .filter((order): order is AssignedOrder => order !== null); // 🎯 FIX: Type guard to remove nulls
      
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
  }
};