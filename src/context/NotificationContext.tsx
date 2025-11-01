import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderNotification {
  id: string;
  order: Order;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextValue {
  notifications: OrderNotification[];
  activeNotification: OrderNotification | null;
  showNotification: (order: Order) => void;
  dismissNotification: () => void;
  acceptOrderFromNotification: (orderId: string) => Promise<void>;
  isAccepting: boolean;
  acceptError: string | null;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  onNewOrder?: (order: Order) => void;
  onOrderAccepted?: (orderId: string) => void; // Callback to update OrderContext
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  onNewOrder,
  onOrderAccepted
}) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<OrderNotification | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const { user } = useAuth();

  // Show notification (called when new order arrives)
  const showNotification = useCallback((order: Order) => {
    console.log('🔔 New notification triggered for order:', order.orderId);
    
    const notification: OrderNotification = {
      id: order.orderId,
      order,
      timestamp: new Date(),
      read: false
    };

    // Check if notification already exists
    setNotifications(prev => {
      const exists = prev.some(n => n.order.orderId === order.orderId);
      if (exists) {
        console.log('⚠️ Notification already exists for order:', order.orderId);
        return prev; // No change
      }

      console.log('✅ Notification added to queue');
      return [...prev, notification];
    });

    // ✅ CRITICAL FIX: Set as active notification OUTSIDE setState callback
    // This ensures the modal shows immediately
    setActiveNotification(current => {
      if (current) {
        console.log('📋 Another notification is active, this will queue');
        return current; // Keep current active
      }
      console.log('🎯 Setting as active notification');
      return notification; // Set this as active
    });

    // Play notification sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Sound play failed:', err));
    } catch (err) {
      console.log('Sound not available:', err);
    }

    // Call external callback if provided
    if (onNewOrder) {
      onNewOrder(order);
    }
  }, [onNewOrder]);

  // Dismiss active notification
  const dismissNotification = useCallback(() => {
    console.log('❌ Dismissing active notification');
    
    // Remove the active notification from the queue
    setNotifications(prev => {
      if (!activeNotification) return prev;
      return prev.filter(n => n.id !== activeNotification.id);
    });
    
    setActiveNotification(null);
    setAcceptError(null);
  }, [activeNotification]);

  // Accept order from notification
  const acceptOrderFromNotification = useCallback(async (orderId: string) => {
    if (!user?.id) {
      console.error('❌ No user ID available');
      setAcceptError('User not authenticated');
      return;
    }

    console.log('🎯 Accepting order from notification:', orderId);
    setIsAccepting(true);
    setAcceptError(null);

    // ✅ Call OrderContext callbacks (via bridge or prop)
    const orderCallbacks = (window as any).__orderContextCallbacks;
    if (orderCallbacks) {
      console.log('✅ Calling OrderContext callbacks via bridge');
      orderCallbacks.markOrderAsAccepted(orderId);
      orderCallbacks.removeOrder(orderId);
    } else if (onOrderAccepted) {
      console.log('✅ Calling OrderContext callback via prop');
      onOrderAccepted(orderId);
    } else {
      console.warn('⚠️ No OrderContext callbacks available');
    }

    try {
      const response = await orderService.acceptOrder(orderId, user.id);
      console.log('✅ Order accepted successfully:', response);

      // Remove from notifications
      setNotifications(prev => prev.filter(n => n.order.orderId !== orderId));
      setActiveNotification(null);

      // Show success message (you can add toast here)
      console.log('🎉 Order accepted! Notification dismissed.');

    } catch (error) {
      console.error('❌ Error accepting order from notification:', error);
      setAcceptError('Failed to accept order. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  }, [user?.id, onOrderAccepted]);

  // Show next notification in queue when active one is dismissed
  useEffect(() => {
    if (!activeNotification && notifications.length > 0) {
      const nextNotification = notifications[0];
      setActiveNotification(nextNotification);
      console.log('📋 Showing next notification from queue:', nextNotification.order.orderId);
    }
  }, [activeNotification, notifications]);

  const value: NotificationContextValue = {
    notifications,
    activeNotification,
    showNotification,
    dismissNotification,
    acceptOrderFromNotification,
    isAccepting,
    acceptError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
