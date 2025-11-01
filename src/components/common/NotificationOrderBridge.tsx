import React, { useEffect } from 'react';
import { useOrderContext } from '../../context/OrderContext';

/**
 * Bridge component that injects OrderContext callbacks into NotificationContext
 * This component must be rendered inside both NotificationProvider and OrderProvider
 */
export const NotificationOrderBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { markOrderAsAccepted, removeOrder } = useOrderContext();

  useEffect(() => {
    // Store callbacks in window for NotificationContext to access
    // This is a workaround for the circular dependency
    (window as any).__orderContextCallbacks = {
      markOrderAsAccepted,
      removeOrder
    };

    console.log('✅ Bridge: OrderContext callbacks injected into window');

    return () => {
      delete (window as any).__orderContextCallbacks;
    };
  }, [markOrderAsAccepted, removeOrder]);

  return <>{children}</>;
};
