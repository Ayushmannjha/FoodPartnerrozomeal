import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Order } from '../types/order';

// Fixed: Remove trailing /ws if present in env variable
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'https://api.rozomeal.com';
const WS_URL = WS_BASE_URL.endsWith('/ws') ? WS_BASE_URL : `${WS_BASE_URL}/ws`;

export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onOrderReceived?: (orders: Order[]) => void;
  onStatusUpdate?: (status: any) => void;
  onError?: (error: string) => void;
}

let stompClient: Client | null = null;
let activeCallbacks: WebSocketCallbacks = {};

/**
 * Connect to the WebSocket server
 */
export const connectWebSocket = (pincode: number, callbacks: WebSocketCallbacks): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Store callbacks for later use
      activeCallbacks = callbacks;

      // Create WebSocket connection - no need to append /ws again
      console.log('🔌 Connecting to WebSocket URL:', WS_URL);
      const socket = new SockJS(WS_URL);
      stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('🔌 WebSocket Debug:', str);
        },
        onConnect: () => {
          console.log('✅ Connected to WebSocket for pincode:', pincode);
          
          // FIXED: Changed user prefix to /foodPartner to match backend config
          stompClient?.subscribe(`/topic/food-orders/${pincode}`, (message) => {
            console.log('📨 RAW MESSAGE RECEIVED FROM SERVER:');
            console.log('   Headers:', message.headers);
            console.log('   Body (raw):', message.body);
            console.log('   Body length:', message.body?.length);
            console.log('   Body type:', typeof message.body);
            
            try {
              const orderData = JSON.parse(message.body);
              console.log('📥 PARSED ORDER DATA:', orderData);
              console.log('   Data type:', typeof orderData);
              console.log('   Is Array:', Array.isArray(orderData));
              
              // Normalize: Backend sends single order object, not array
              // Convert single order to array for consistent handling
              let ordersArray: Order[];
              if (Array.isArray(orderData)) {
                ordersArray = orderData;
                console.log('   Order count:', ordersArray.length);
              } else if (orderData && typeof orderData === 'object' && orderData.orderId) {
                // Single order - wrap in array
                ordersArray = [orderData];
                console.log('   Single order received, wrapped in array:', orderData.orderId);
              } else {
                console.warn('⚠️ Invalid order data format:', orderData);
                return;
              }
              
              console.log('✅ Calling onOrderReceived with', ordersArray.length, 'order(s)');
              activeCallbacks.onOrderReceived?.(ordersArray);
            } catch (error) {
              console.error('❌ Error processing order message:', error);
              console.error('   Raw body was:', message.body);
            }
          });
          
          // FIXED: Changed user prefix to /foodPartner for status updates
          stompClient?.subscribe(`/user/queue/orders`, (message) => {
            console.log('📨 STATUS MESSAGE RECEIVED:', message.body);
            try {
              const statusData = JSON.parse(message.body);
              console.log('📥 Received status update:', statusData);
              activeCallbacks.onStatusUpdate?.(statusData);
            } catch (error) {
              console.error('❌ Error processing status message:', error);
            }
          });
          
          // Request initial orders
          requestOrdersByPincode(pincode);
          
          // Signal successful connection
          activeCallbacks.onConnect?.();
          resolve();
        },
        onStompError: (frame) => {
          console.error('❌ STOMP error:', frame);
          activeCallbacks.onError?.(frame.headers.message || 'STOMP connection error');
          reject(new Error(frame.headers.message));
        },
        onDisconnect: () => {
          console.log('🔌 WebSocket disconnected');
          activeCallbacks.onDisconnect?.();
        },
        reconnectDelay: 5000
      });
      
      stompClient.activate();
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      reject(error);
    }
  });
};

/**
 * Request orders for a specific pincode
 */
export const requestOrdersByPincode = (pincode: number): void => {
  if (stompClient?.connected) {
    const payload = JSON.stringify(pincode);
    console.log('📤 ========== SENDING REQUEST TO SERVER ==========');
    console.log('   Destination: /app/getOrders');
    console.log('   Pincode (original):', pincode);
    console.log('   Pincode (type):', typeof pincode);
    console.log('   Payload (stringified):', payload);
    console.log('   Payload length:', payload.length);
    console.log('   Expected on backend: int pin = Integer.parseInt(pincode.replace("\\"", ""))');
    console.log('================================================');
    
    stompClient.publish({
      destination: '/app/getOrders',
      body: payload
    });
    
    // Set a timeout to check if we get a response
    setTimeout(() => {
      console.log('⏰ 5 seconds passed - checking if server responded...');
      console.log('   If no response above, check:');
      console.log('   1. Backend @MessageMapping("/getOrders") is working');
      console.log('   2. Backend @SendToUser("/queue/orders") is configured');
      console.log('   3. Backend has orders for pincode:', pincode);
      console.log('   4. Backend WebSocket security allows this connection');
    }, 5000);
  } else {
    console.warn('⚠️ WebSocket not connected, cannot request orders');
  }
};

// ✅ WebSocket is used ONLY for receiving orders in real-time
// ❌ Accept order and update status are handled via HTTP (orderService)

/**
 * Disconnect from the WebSocket server
 */
export const disconnectWebSocket = (): void => {
  if (stompClient?.connected) {
    stompClient.deactivate();
    console.log('🔌 WebSocket disconnected');
  }
};

/**
 * Check if WebSocket is connected
 */
export const isWebSocketConnected = (): boolean => {
  return stompClient?.connected || false;
};