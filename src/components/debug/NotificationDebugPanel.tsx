import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import { useOrderContext } from '../../context/OrderContext';
import { Button } from '../ui/button';
import { Bell, TestTube } from 'lucide-react';

/**
 * Debug panel to test notification system
 * Add this to any dashboard page to test notifications manually
 */
export const NotificationDebugPanel: React.FC = () => {
  const { activeNotification, notifications, showNotification } = useNotification();
  const { state } = useOrderContext();

  const triggerTestNotification = () => {
    console.log('🧪 TEST: Triggering manual notification');
    
    // Create a mock order
    const mockOrder = {
      orderId: `TEST-${Date.now()}`,
      userId: 'test-user',
      price: 299,
      quantity: [2, 1], // Array of quantities for each item
      date: new Date().toISOString(),
      status: 0,
      user: {
        id: 'test-user',
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9876543210',
        password: '',
        role: 'USER',
        username: 'testuser',
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        authorities: []
      },
      foodIds: ['food1', 'food2'],
      thaliIds: ['thali1'],
      pincode: 123456
    };

    showNotification(mockOrder);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-orange-500 rounded-lg shadow-xl p-4 max-w-sm z-40">
      <div className="flex items-center gap-2 mb-3">
        <TestTube className="w-5 h-5 text-orange-600" />
        <h3 className="font-bold text-gray-900">Notification Debug</h3>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Active Notification:</span>
          <span className={`font-semibold ${activeNotification ? 'text-green-600' : 'text-gray-400'}`}>
            {activeNotification ? '✅ YES' : '❌ NO'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Queue Count:</span>
          <span className="font-semibold text-blue-600">{notifications.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending Orders:</span>
          <span className="font-semibold text-purple-600">{state.orders.length}</span>
        </div>
        {activeNotification && (
          <div className="flex justify-between">
            <span className="text-gray-600">Current Order ID:</span>
            <span className="font-mono text-xs text-green-600">
              {activeNotification.order.orderId.slice(0, 12)}...
            </span>
          </div>
        )}
      </div>

      <Button
        onClick={triggerTestNotification}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Bell className="w-4 h-4 mr-2" />
        Test Notification
      </Button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Click to trigger a test notification
      </p>
    </div>
  );
};
