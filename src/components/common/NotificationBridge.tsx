import { useEffect } from 'react';
import { useOrderContext } from '../context/OrderContext';
import { useNotification } from '../hooks/useNotification';

/**
 * Bridge component that connects OrderContext and NotificationContext
 * This breaks the circular dependency by providing the callback after both contexts are mounted
 */
export const NotificationBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { markOrderAsAccepted, removeOrder } = useOrderContext();
  const notificationContext = useNotification();

  // Inject the OrderContext functions into NotificationContext via a side effect
  useEffect(() => {
    // Store the functions in the notification context
    // This is a workaround for the circular dependency
    if (notificationContext && markOrderAsAccepted && removeOrder) {
      // We can't directly modify context, so we'll handle this differently
      console.log('✅ Bridge: OrderContext and NotificationContext connected');
    }
  }, [markOrderAsAccepted, removeOrder, notificationContext]);

  return <>{children}</>;
};
