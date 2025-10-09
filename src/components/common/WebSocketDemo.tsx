// Example component showing WebSocket connection status
// ✅ WebSocket is used ONLY for receiving orders in real-time
// ❌ Accept order and update status are handled via HTTP (orderService)
import { useEffect } from 'react';
import { useOrderWebSocket } from '../../context/OrderContext';
import { useOrderAccept } from '../../hooks/useOrderAccept';
import { useAuth } from '../../context/AuthContext';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { orderService } from '../../services/orderService';

export function WebSocketDemo() {
  const { user } = useAuth();
  const {
    wsConnected,
    wsError,
    reconnectAttempts,
    refreshWebSocket
  } = useOrderWebSocket();
  
  const { acceptOrder: acceptOrderHttp } = useOrderAccept();

  // Show connection status
  useEffect(() => {
    if (wsConnected) {
      console.log('✅ WebSocket connected successfully');
    } else {
      console.log('❌ WebSocket disconnected');
    }
  }, [wsConnected]);

  // Handle WebSocket errors
  useEffect(() => {
    if (wsError) {
      console.error('🚨 WebSocket error:', wsError);
    }
  }, [wsError]);

  const handleAcceptOrder = async (orderId: string) => {
    if (user?.id) {
      // ✅ Use HTTP to accept order
      const result = await acceptOrderHttp(orderId, user.id);
      if (result.success) {
        console.log('✅ Order accepted via HTTP:', result.message);
      } else {
        console.error('❌ Failed to accept order:', result.message);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: number) => {
    // ✅ Use HTTP to update order status
    try {
      const result = await orderService.updateOrderStatus(orderId, status);
      console.log('✅ Status updated via HTTP:', result);
    } catch (error) {
      console.error('❌ Failed to update status:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">WebSocket Connection Status</h2>
      
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {wsConnected ? (
          <>
            <Wifi className="h-5 w-5 text-green-500" />
            <Badge variant="outline" className="text-green-600 border-green-200">
              Connected
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5 text-red-500" />
            <Badge variant="destructive">
              Disconnected
            </Badge>
          </>
        )}
        
        {reconnectAttempts > 0 && (
          <Badge variant="secondary">
            Reconnect attempts: {reconnectAttempts}
          </Badge>
        )}
      </div>

      {/* Error Display */}
      {wsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            WebSocket Error: {wsError}
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Refresh */}
      <Button
        onClick={refreshWebSocket}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh Connection
      </Button>

      {/* User Info */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
        <p><strong>Pincode:</strong> {user?.pincode || 'Not set'}</p>
        <p><strong>WebSocket URL:</strong> {import.meta.env.VITE_WS_URL || 'Default URL'}</p>
      </div>

      {/* Action Buttons for Testing */}
      <div className="space-y-2">
        <h3 className="font-semibold">Test HTTP Actions (not WebSocket):</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => handleAcceptOrder('test-order-123')}
            disabled={!user?.id}
            size="sm"
          >
            Accept Test Order (HTTP)
          </Button>
          <Button
            onClick={() => handleUpdateStatus('test-order-123', 1)}
            disabled={!user?.id}
            size="sm"
            variant="secondary"
          >
            Update Status (HTTP)
          </Button>
        </div>
      </div>
    </div>
  );
}
