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
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  onNewOrder 
}) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<OrderNotification | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const { user } = useAuth();

  // Show notification (called when new order arrives)
  const showNotification = useCallback((order: Order) => {
    console.log('🔔 New notification triggered for order:', order.orderId);
    
    // Check if notification already exists using setState callback
    setNotifications(prev => {
      const exists = prev.some(n => n.order.orderId === order.orderId);
      if (exists) {
        console.log('⚠️ Notification already exists for order:', order.orderId);
        return prev; // No change
      }

      const notification: OrderNotification = {
        id: order.orderId,
        order,
        timestamp: new Date(),
        read: false
      };

      console.log('✅ Notification added to queue');
      
      // Set as active if no active notification
      setActiveNotification(current => current || notification);

      return [...prev, notification];
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
  }, [user?.id]);

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
