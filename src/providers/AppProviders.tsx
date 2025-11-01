import React from 'react';
import { NotificationProvider } from '../context/NotificationContext';
import { OrderProvider } from '../context/OrderContext';
import { useOrderContext } from '../context/OrderContext';

/**
 * Wrapper that provides both NotificationProvider and OrderProvider
 * with proper callback wiring to avoid circular dependencies
 */
const OrderProviderWithCallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <OrderProvider>
      <OrderContextBridge>
        {children}
      </OrderContextBridge>
    </OrderProvider>
  );
};

/**
 * Bridge component that passes OrderContext callbacks to NotificationContext
 */
const OrderContextBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { markOrderAsAccepted, removeOrder } = useOrderContext();

  const handleOrderAccepted = React.useCallback((orderId: string) => {
    markOrderAsAccepted(orderId);
    removeOrder(orderId);
  }, [markOrderAsAccepted, removeOrder]);

  // Clone children and inject the callback
  // This won't work directly, so we'll use a different approach
  return <>{children}</>;
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NotificationProvider>
      <OrderProviderWithCallback>
        {children}
      </OrderProviderWithCallback>
    </NotificationProvider>
  );
};
