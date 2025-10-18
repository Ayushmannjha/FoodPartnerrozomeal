import { useState, useEffect, useCallback } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/webSocket';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { isValidPincode } from '../utils/pincodeUtils';

interface UseWebSocketOptions {
  onNewOrder?: (order: Order) => void;
}

export const useWebSocket = (options?: UseWebSocketOptions) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const { user } = useAuth();
  const pincode = user?.pincode;
  const isPincodeValid = isValidPincode(pincode);

  // 🆕 Initial HTTP load - Load ALL pending orders
  useEffect(() => {
    // Guard: Don't run if user or pincode is not available
    if (!user?.id || !isPincodeValid) {
      console.log('⏭️ Skipping initial load - user or valid pincode not available');
      console.log('   - User ID:', user?.id);
      console.log('   - Pincode:', pincode);
      console.log('   - Pincode valid:', isPincodeValid);
      
      // Only mark as complete if we're sure it's an invalid state, not a loading state
      if (user !== undefined && pincode !== undefined) {
        setIsInitialLoadComplete(true);
      }
      return;
    }

    let isMounted = true;

    const loadInitialOrders = async () => {
      console.log('🚀 Starting initial HTTP load for ALL pending orders...');
      console.log('👤 User ID:', user.id);
      console.log('📍 Pincode:', pincode);
      
      try {
        const pendingOrders = await orderService.getPendingOrders(user.id, pincode!);

        // Only update state if component is still mounted
        if (!isMounted) {
          console.log('⚠️ Component unmounted, skipping state update');
          return;
        }

        if (pendingOrders.length > 0) {
          console.log(`✅ Initial load: Found ${pendingOrders.length} pending orders`);
          console.log('📋 Orders summary:', pendingOrders.map(o => ({
            orderId: o.orderId,
            date: o.date,
            price: o.price,
            status: o.status
          })));
          setOrders(pendingOrders);
        } else {
          console.log('ℹ️ Initial load: No pending orders found');
          setOrders([]);
        }
      } catch (error) {
        console.error('❌ Initial load failed:', error);
        if (isMounted) {
          setOrders([]); // Set empty array on error
        }
      } finally {
        if (isMounted) {
          setIsInitialLoadComplete(true);
          console.log('✅ Initial load complete - ready for WebSocket');
        }
      }
    };

    loadInitialOrders();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user?.id, pincode, isPincodeValid]);

  // WebSocket connection (only after initial load)
  useEffect(() => {
    // Guard: Check all required conditions
    if (!user?.id || !isPincodeValid || !isInitialLoadComplete) {
      console.log('⏳ Waiting - Conditions not met for WebSocket connection');
      console.log('   - User ID:', user?.id);
      console.log('   - Pincode:', pincode);
      console.log('   - Pincode valid:', isPincodeValid);
      console.log('   - Initial load complete:', isInitialLoadComplete);
      return;
    }

    // Additional safety check: ensure pincode is valid before parseInt
    if (!pincode) {
      console.log('⚠️ Pincode is undefined, cannot connect WebSocket');
      return;
    }

    console.log('🔌 Initial load complete. Connecting WebSocket for real-time updates...');
    console.log('   - Connecting with pincode:', pincode);

    const cleanup = connectWebSocket(parseInt(String(pincode)), {
      onConnect: () => {
        console.log('✅ WebSocket connected - ready for real-time orders');
        setWsConnected(true);
      },
      
      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        setWsConnected(false);
      },
      
      onOrderReceived: (newOrders: Order[]) => {
        console.log(`📦 Real-time orders received via WebSocket: ${newOrders.length} order(s)`);
        console.log('📋 New orders:', newOrders.map(o => ({ orderId: o.orderId, date: o.date })));
        
        setOrders(prevOrders => {
          const mergedOrders = [...prevOrders];
          let addedCount = 0;

          newOrders.forEach(newOrder => {
            const exists = mergedOrders.some(
              existingOrder => existingOrder.orderId === newOrder.orderId
            );

            if (!exists) {
              console.log(`✅ Adding new real-time order: ${newOrder.orderId}`);
              mergedOrders.unshift(newOrder); // Add to front (newest first)
              addedCount++;
              
              // 🔔 Trigger notification callback for each NEW order
              if (options?.onNewOrder) {
                console.log('🔔 Triggering notification for order:', newOrder.orderId);
                options.onNewOrder(newOrder);
              }
            } else {
              console.log(`⚠️ Duplicate order ignored: ${newOrder.orderId}`);
            }
          });

          console.log(`📊 Total orders after merge: ${mergedOrders.length} (${addedCount} new)`);
          return mergedOrders;
        });
      },
      
      onError: (error: string) => {
        console.error('❌ WebSocket error:', error);
      }
    });

    return cleanup;
  }, [user?.id, pincode, isPincodeValid, isInitialLoadComplete, options]);

  // Remove order after acceptance
  const removeOrder = useCallback((orderId: string) => {
    console.log(`🗑️ Removing order from list: ${orderId}`);
    setOrders(prevOrders => {
      const filtered = prevOrders.filter(order => order.orderId !== orderId);
      console.log(`📊 Orders remaining: ${filtered.length}`);
      return filtered;
    });
  }, []);

  // Manual refresh: Re-fetch ALL pending orders + reconnect WebSocket
  const refreshWebSocket = useCallback(async () => {
    if (!isPincodeValid || !user?.id) {
      console.log('⚠️ Cannot refresh - invalid pincode or user ID missing');
      console.log('   - Pincode:', pincode);
      console.log('   - Pincode valid:', isPincodeValid);
      console.log('   - User ID:', user?.id);
      return;
    }

    console.log('🔄 Manual refresh triggered...');
    
    // 1. Disconnect WebSocket
    disconnectWebSocket();
    setWsConnected(false);
    console.log('❌ WebSocket disconnected for refresh');

    // 2. Re-fetch ALL pending orders via HTTP
    try {
      console.log('🔄 Re-fetching all pending orders...');
      const pendingOrders = await orderService.getPendingOrders(user.id, pincode!);
      console.log(`✅ Refresh: Loaded ${pendingOrders.length} pending orders`);
      setOrders(pendingOrders);
    } catch (error) {
      console.error('❌ Refresh HTTP load failed:', error);
      setOrders([]); // Clear on error
    }

    // 3. Reconnect WebSocket after 1 second
    setTimeout(() => {
      console.log('🔌 Reconnecting WebSocket...');
      connectWebSocket(parseInt(pincode!), {
        onConnect: () => {
          console.log('✅ WebSocket reconnected successfully');
          setWsConnected(true);
        },
        onDisconnect: () => {
          console.log('❌ WebSocket disconnected after reconnection');
          setWsConnected(false);
        },
        onOrderReceived: (newOrders: Order[]) => {
          console.log(`📦 New orders after reconnection: ${newOrders.length}`);
          setOrders(prevOrders => {
            const mergedOrders = [...prevOrders];
            newOrders.forEach(newOrder => {
              if (!mergedOrders.some(o => o.orderId === newOrder.orderId)) {
                mergedOrders.unshift(newOrder);
                console.log(`✅ Added order after reconnection: ${newOrder.orderId}`);
              }
            });
            return mergedOrders;
          });
        },
        onError: (error: string) => console.error('❌ WebSocket error after reconnection:', error)
      });
    }, 1000);
  }, [pincode, isPincodeValid, user?.id]);

  return {
    orders,
    wsConnected,
    isInitialLoadComplete,
    refreshWebSocket,
    removeOrder
  };
};