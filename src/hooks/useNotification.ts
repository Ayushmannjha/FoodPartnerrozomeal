import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return no-op functions if used outside provider (for compatibility)
    return {
      notifications: [],
      activeNotification: null,
      showNotification: () => {},
      dismissNotification: () => {},
      acceptOrderFromNotification: async () => {},
      isAccepting: false,
      acceptError: null
    };
  }
  return context;
};
