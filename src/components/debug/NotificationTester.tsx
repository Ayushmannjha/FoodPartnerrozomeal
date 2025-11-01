import { useNotification } from '../../hooks/useNotification';
import { Button } from '../ui/button';
import type { Order } from '../../types/order';

/**
 * Notification Test Component
 * 
 * Usage: Add to any dashboard page to test notifications
 * <NotificationTester />
 */
export function NotificationTester() {
  const { showNotification, activeNotification, notifications } = useNotification();

  const testOrder: Order = {
    orderId: `TEST-${Date.now()}`,
    date: new Date().toISOString(),
    price: 299,
    status: 0,
    user: {
      id: 'test-user',
      name: 'Test Customer',
      phone: '9876543210',
      email: 'test@example.com',
      password: '',
      role: 'USER',
      username: 'testuser',
      authorities: [{ authority: 'ROLE_USER' }],
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true
    },
    foodIds: ['food-1', 'food-2'],
    thaliIds: [],
    quantity: [2, 1]
  };

  const handleTestNotification = () => {
    console.log('🧪 Testing notification with:', testOrder);
    showNotification(testOrder);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🧪 Notification Tester</h3>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Active:</span>
          <span className="font-medium">{activeNotification ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Queue:</span>
          <span className="font-medium">{notifications.length}</span>
        </div>
      </div>

      <Button
        onClick={handleTestNotification}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
        size="sm"
      >
        Test Notification
      </Button>

      <p className="text-xs text-gray-500 mt-2">
        Click to trigger a test notification
      </p>
    </div>
  );
}
