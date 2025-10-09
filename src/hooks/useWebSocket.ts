import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as WebSocketService from '../services/webSocket';
import type { Order } from '../types/order';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  
  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!user?.pincode) {
      console.warn('⚠️ Cannot connect to WebSocket: No pincode available');
      return;
    }
    
    setReconnectAttempts(prev => prev + 1);
    
    // Convert pincode to number if it's a string
    const pincodeNumber = typeof user.pincode === 'string' ? parseInt(user.pincode, 10) : user.pincode;
    
    WebSocketService.connectWebSocket(pincodeNumber, {
      onConnect: () => {
        setConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onOrderReceived: (newOrders) => {
        console.log('📦 Orders received in hook:', newOrders.length, 'order(s)');
        
        if (Array.isArray(newOrders) && newOrders.length > 0) {
          setOrders(prevOrders => {
            // Merge new orders with existing ones, avoiding duplicates
            const mergedOrders = [...prevOrders];
            let addedCount = 0;
            
            newOrders.forEach(newOrder => {
              const orderExists = mergedOrders.some(order => order.orderId === newOrder.orderId);
              if (!orderExists) {
                mergedOrders.unshift(newOrder); // Add to beginning
                addedCount++;
                console.log('✅ Added new order:', newOrder.orderId);
              } else {
                console.log('ℹ️ Order already exists, skipping:', newOrder.orderId);
              }
            });
            
            console.log(`📊 Total orders in state: ${mergedOrders.length} (added ${addedCount} new)`);
            return mergedOrders;
          });
        } else {
          console.warn('⚠️ Invalid orders received:', newOrders);
        }
      },
      onStatusUpdate: (statusUpdate) => {
        console.log('🔄 Status update received:', statusUpdate);
        // Handle status updates here
      },
      onError: (err) => {
        console.error('❌ WebSocket error in hook:', err);
        setError(err);
        setConnected(false);
      }
    })
    .catch(err => {
      console.error('❌ Failed to connect to WebSocket:', err);
      setError(err.message);
    });
  }, [user?.pincode]);
  
  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (user?.pincode) {
      console.log('🔌 Connecting WebSocket for pincode:', user.pincode);
      initializeWebSocket();
    }
    
    // Cleanup
    return () => {
      WebSocketService.disconnectWebSocket();
    };
  }, [user?.pincode, initializeWebSocket]);
  
  // Manually refresh WebSocket connection
  const refreshWebSocket = useCallback(() => {
    WebSocketService.disconnectWebSocket();
    initializeWebSocket();
  }, [initializeWebSocket]);
  
  // Remove order from WebSocket state (after acceptance)
  const removeOrder = useCallback((orderId: string) => {
    console.log('🗑️ Removing order from WebSocket state:', orderId);
    setOrders(prevOrders => {
      const filteredOrders = prevOrders.filter(order => order.orderId !== orderId);
      console.log(`✅ Order removed. Before: ${prevOrders.length}, After: ${filteredOrders.length}`);
      return filteredOrders;
    });
  }, []);
  
  // ✅ WebSocket is for receiving orders and managing their state
  // ❌ Accept order via orderService.acceptOrder() (HTTP)
  // ❌ Update status via orderService.updateOrderStatus() (HTTP)
  
  return {
    wsConnected: connected,
    wsError: error,
    reconnectAttempts,
    orders,
    refreshWebSocket,
    removeOrder  // ✅ Export removeOrder function
  };
};