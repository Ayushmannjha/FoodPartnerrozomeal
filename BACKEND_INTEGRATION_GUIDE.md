# Backend Integration Summary - Order Operations

## 🎯 Clear Separation of Concerns

This document explains how the frontend interacts with the backend for order operations after the WebSocket cleanup.

---

## 📡 WebSocket (Read-Only - Receiving Data)

### Purpose
**Receive real-time order updates from backend**

### Backend Endpoints
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig {
  // Endpoint: /ws
  // Prefixes: /app (application), /topic (broadcast), /user (user-specific)
}

@MessageMapping("/getOrders")
public void getOrdersByPincode(int pincode, SimpMessageHeaderAccessor headerAccessor) {
  // Sends orders to: /topic/food-orders/{pincode}
}
```

### Frontend Implementation
```typescript
// Service: webSocket.ts
connectWebSocket(pincode, callbacks);
// Subscribes to: /topic/food-orders/{pincode}
// Subscribes to: /user/queue/orders

// Hook: useWebSocket.ts
const { wsConnected, orders, refreshWebSocket } = useWebSocket();

// Context: OrderContext.tsx
// Automatically accumulates received orders
```

### Flow
```
1. User logs in → Frontend connects WebSocket
2. Frontend sends: /app/getOrders with pincode
3. Backend queries database for orders
4. Backend sends orders to: /topic/food-orders/{pincode}
5. Frontend receives and displays orders
```

---

## 🌐 HTTP REST API (Read-Write - User Actions)

### 1. Accept Order

#### Backend
```java
@RestController
@RequestMapping("/food-partner")
public class FoodPartnerController {
  
  @PostMapping("/accept")
  public ResponseEntity<AcceptOrderResponse> acceptOrder(
    @RequestParam String orderId,
    @RequestParam String fid
  ) {
    // Assigns order to food partner
    // Updates order.assigned = true
    // Returns success response
  }
}
```

#### Frontend
```typescript
// Service: orderService.ts
async acceptOrder(orderId: string, foodPartnerId: string): Promise<AcceptOrderResponse> {
  const response = await httpClient.post(
    `/food-partner/accept?orderId=${orderId}&fid=${foodPartnerId}`
  );
  return response;
}

// Hook: useOrderAccept.ts
const { acceptOrder, loading, error } = useOrderAccept();

const handleAccept = async () => {
  const result = await acceptOrder(orderId, foodPartnerId);
  if (result.success) {
    // Order accepted successfully
  }
};
```

#### Usage Example
```tsx
import { useOrderAccept } from '../hooks/useOrderAccept';
import { useAuth } from '../context/AuthContext';

const OrderCard = ({ order }) => {
  const { user } = useAuth();
  const { acceptOrder, loading } = useOrderAccept();
  
  const handleAccept = async () => {
    const result = await acceptOrder(order.orderId, user.id);
    if (result.success) {
      toast.success('Order accepted!');
    } else {
      toast.error(result.message);
    }
  };
  
  return (
    <button onClick={handleAccept} disabled={loading}>
      {loading ? 'Accepting...' : 'Accept Order'}
    </button>
  );
};
```

---

### 2. Update Order Status

#### Backend
```java
@RestController
@RequestMapping("/food-partner")
public class FoodPartnerController {
  
  @PutMapping("/update-order")
  public ResponseEntity<UpdateOrderResponse> updateOrder(
    @RequestParam String orderId,
    @RequestParam int status
  ) {
    // Updates order status
    // Status: 0=pending, 1=preparing, 2=ready, 3=delivered
    // Returns updated order
  }
}
```

#### Frontend
```typescript
// Service: orderService.ts
async updateOrderStatus(orderId: string, status: number): Promise<UpdateOrderResponse> {
  const response = await httpClient.put(
    `/food-partner/update-order?orderId=${orderId}&status=${status}`
  );
  return response;
}

// Hook: useOrders.ts (has updateOrderStatus built-in)
const { updateOrderStatus, loading } = useOrders();

const handleUpdate = async () => {
  const result = await updateOrderStatus(orderId, newStatus);
  if (result.success) {
    // Status updated successfully
  }
};
```

#### Usage Example
```tsx
import { useOrders } from '../hooks/useOrders';

const OrderStatusUpdater = ({ orderId, currentStatus }) => {
  const { updateOrderStatus, loading } = useOrders();
  
  const handleStatusChange = async (newStatus: number) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
    }
  };
  
  return (
    <select 
      value={currentStatus} 
      onChange={(e) => handleStatusChange(parseInt(e.target.value))}
      disabled={loading}
    >
      <option value={0}>Pending</option>
      <option value={1}>Preparing</option>
      <option value={2}>Ready</option>
      <option value={3}>Delivered</option>
    </select>
  );
};
```

---

## 🔄 Complete Order Flow

### 1. New Order Arrives
```
Backend: New order created by customer
    ↓
Backend: Sends via WebSocket to /topic/food-orders/{pincode}
    ↓
Frontend: Receives order via WebSocket
    ↓
Frontend: Displays order in UI
    ↓
User: Sees new order notification
```

### 2. Food Partner Accepts Order
```
User: Clicks "Accept Order" button
    ↓
Frontend: POST /food-partner/accept?orderId=xxx&fid=yyy
    ↓
Backend: Assigns order to food partner
    ↓
Backend: Updates order.assigned = true
    ↓
Backend: Returns success response
    ↓
Frontend: Shows success message
    ↓
Frontend: Removes from available orders list
```

### 3. Food Partner Updates Status
```
User: Changes order status dropdown
    ↓
Frontend: PUT /food-partner/update-order?orderId=xxx&status=1
    ↓
Backend: Updates order.status = 1
    ↓
Backend: Returns updated order
    ↓
Frontend: Updates UI with new status
    ↓
User: Sees status changed to "Preparing"
```

---

## 📊 Data Models

### Order (from WebSocket)
```typescript
interface Order {
  orderId: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  foodIds: string[];
  thaliIds: string[];
  quantity: number[];
  price: number;
  status: number;  // 0=pending, 1=preparing, 2=ready, 3=delivered
  date: string;
  pincode: number;
  assigned: boolean;
  latitude: number;
  longitude: number;
}
```

### AcceptOrderResponse (from HTTP)
```typescript
interface AcceptOrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  foodPartnerId?: string;
}
```

### UpdateOrderResponse (from HTTP)
```typescript
interface UpdateOrderResponse {
  orderId: string;
  status: number;
  price: number;
  date: string;
  quantity: number[];
  foodIds: string[];
  thaliIds: string[];
  user: User;
}
```

---

## 🛠️ Available Hooks

### 1. `useOrderAccept()`
**Purpose:** Accept orders with loading/error states

```typescript
const { 
  acceptOrder,  // Function to accept order
  loading,      // Is request in progress?
  error,        // Error message if failed
  clearError    // Clear error message
} = useOrderAccept();
```

### 2. `useOrders(autoRefresh?, refreshInterval?)`
**Purpose:** Full order management with auto-refresh

```typescript
const {
  orders,              // All orders with details
  loading,             // Initial loading state
  error,               // Error message
  acceptOrder,         // Accept an order
  updateOrderStatus,   // Update order status
  refreshOrders        // Manual refresh
} = useOrders(true, 30000); // Auto-refresh every 30s
```

### 3. `useOrderWebSocket()`
**Purpose:** WebSocket connection status

```typescript
const {
  wsConnected,        // Is WebSocket connected?
  wsError,            // WebSocket error
  reconnectAttempts,  // Number of reconnect attempts
  refreshWebSocket    // Manual reconnection
} = useOrderWebSocket();
```

---

## ✅ Best Practices

### 1. Error Handling
```typescript
const handleAccept = async () => {
  try {
    const result = await orderService.acceptOrder(orderId, partnerId);
    if (result.success) {
      toast.success('Order accepted!');
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
    console.error('Accept order error:', error);
  }
};
```

### 2. Loading States
```typescript
const [isAccepting, setIsAccepting] = useState(false);

const handleAccept = async () => {
  setIsAccepting(true);
  try {
    await orderService.acceptOrder(orderId, partnerId);
  } finally {
    setIsAccepting(false);
  }
};

<button disabled={isAccepting}>
  {isAccepting ? 'Accepting...' : 'Accept Order'}
</button>
```

### 3. Optimistic Updates
```typescript
const handleUpdate = async (newStatus: number) => {
  // Update UI immediately
  updateLocalState(orderId, newStatus);
  
  try {
    // Send to backend
    await orderService.updateOrderStatus(orderId, newStatus);
  } catch (error) {
    // Rollback on error
    revertLocalState(orderId);
    toast.error('Failed to update status');
  }
};
```

---

## 🧪 Testing

### Test Accept Order
```typescript
// In browser console:
import { orderService } from './services/orderService';

// Test accept
orderService.acceptOrder('test-order-id', 'food-partner-id')
  .then(res => console.log('Success:', res))
  .catch(err => console.error('Error:', err));
```

### Test Update Status
```typescript
// In browser console:
import { orderService } from './services/orderService';

// Test update
orderService.updateOrderStatus('order-id', 1)
  .then(res => console.log('Updated:', res))
  .catch(err => console.error('Error:', err));
```

---

## 📝 Summary

| Operation | Method | Endpoint | Hook |
|-----------|--------|----------|------|
| Get Orders | WebSocket | `/topic/food-orders/{pincode}` | `useWebSocket()` |
| Accept Order | HTTP POST | `/food-partner/accept` | `useOrderAccept()` |
| Update Status | HTTP PUT | `/food-partner/update-order` | `useOrders()` |

**Key Principle:**
- 📡 WebSocket = Receive data (Backend → Frontend)
- 🌐 HTTP = Send actions (Frontend → Backend)
