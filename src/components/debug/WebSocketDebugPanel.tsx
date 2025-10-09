import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function WebSocketDebugPanel() {
  const { user } = useAuth();
  const [wsLogs, setWsLogs] = useState<string[]>([]);
  const [restApiResponse, setRestApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setWsLogs(prev => [...prev.slice(-50), `[LOG] ${new Date().toLocaleTimeString()} - ${message}`]);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setWsLogs(prev => [...prev.slice(-50), `[ERROR] ${new Date().toLocaleTimeString()} - ${message}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const testRestAPI = async () => {
    if (!user?.id) {
      alert('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.rozomeal.com'}/food-partner/get-orders?userId=${user.id}`;
      
      console.log('🧪 Testing REST API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('🧪 REST API Response:', data);
      setRestApiResponse(data);
    } catch (error) {
      console.error('🧪 REST API Error:', error);
      setRestApiResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Debug Panel</CardTitle>
          <CardDescription>
            Monitor WebSocket communication between client and server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Current User Info:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
              <div><strong>Pincode:</strong> {user?.pincode || 'N/A'}</div>
              <div><strong>Name:</strong> {user?.name || 'N/A'}</div>
              <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
            </div>
          </div>

          {/* Connection Details */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">WebSocket Configuration:</h3>
            <div className="text-sm space-y-1">
              <div><strong>WS URL:</strong> {import.meta.env.VITE_WS_URL || 'https://api.rozomeal.com'}/ws</div>
              <div><strong>Destination:</strong> /app/getOrders</div>
              <div><strong>Subscribe:</strong> /foodPartner/queue/orders</div>
              <div><strong>Subscribe:</strong> /foodPartner/queue/status</div>
            </div>
          </div>

          {/* REST API Test */}
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Compare with REST API:</h3>
            <Button onClick={testRestAPI} disabled={loading} className="mb-2">
              {loading ? 'Testing...' : 'Test REST API /food-partner/get-orders'}
            </Button>
            {restApiResponse && (
              <div className="bg-white p-2 rounded border max-h-40 overflow-auto">
                <pre className="text-xs">{JSON.stringify(restApiResponse, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* WebSocket Logs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">WebSocket Logs:</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setWsLogs([])}
              >
                Clear Logs
              </Button>
            </div>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg max-h-96 overflow-auto font-mono text-xs">
              {wsLogs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                wsLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`mb-1 ${log.includes('[ERROR]') ? 'text-red-400' : ''}`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Backend Checklist */}
          <div className="bg-purple-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Backend Verification Checklist:</h3>
            <div className="text-sm space-y-1">
              <div>✓ Check if backend logs show: "Received pincode: 800020"</div>
              <div>✓ Check if @MessageMapping("/getOrders") is called</div>
              <div>✓ Check if orders exist for pincode 800020 in database</div>
              <div>✓ Check if @SendToUser("/queue/orders") sends response</div>
              <div>✓ Check backend WebSocket configuration allows connections</div>
              <div>✓ Check if CORS is properly configured for WebSocket</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
