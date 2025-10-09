# 🔍 WebSocket Communication Debug Guide

## ✅ Current Status

Your WebSocket is **SUCCESSFULLY CONNECTED**! Here's what's working:

```
✅ Connection established to: https://api.rozomeal.com/ws
✅ STOMP handshake completed
✅ Subscribed to: /foodPartner/queue/orders
✅ Subscribed to: /foodPartner/queue/status
✅ Request sent to: /app/getOrders with pincode: 800020
```

## 📊 What You'll See Now

After the code updates, your console will show **detailed logs**:

### 1. **Request Sent (Client → Server)**
```
📤 ========== SENDING REQUEST TO SERVER ==========
   Destination: /app/getOrders
   Pincode (original): 800020
   Pincode (type): number
   Payload (stringified): "800020"
   Payload length: 6
   Expected on backend: int pin = Integer.parseInt(pincode.replace("\"", ""))
================================================
```

### 2. **Response Received (Server → Client)**
```
📨 RAW MESSAGE RECEIVED FROM SERVER:
   Headers: {...}
   Body (raw): [{"orderId":"123",...}]
   Body length: 1234
   Body type: string

📥 PARSED ORDER DATA: [{...}]
   Data type: object
   Is Array: true
   Order count: 5
   First order: {...}
```

## 🔍 Debugging Steps

### Step 1: Check if Backend Receives the Request

Your backend should log something like:
```java
// In FoodPartnerController.java getOrdersWs() method
System.out.println("Received pincode: " + pincode);
```

**Add this to your backend:**
```java
@MessageMapping("/getOrders")
@SendToUser("/queue/orders")
public List<Orders> getOrdersWs(@Payload String pincode) {
    System.out.println("🔵 WebSocket getOrders called");
    System.out.println("🔵 Received pincode: " + pincode);
    try {
        int pin = Integer.parseInt(pincode.replace("\"", ""));
        System.out.println("🔵 Parsed pincode: " + pin);
        List<Orders> orders = ors.getByPincodeAndAssigned(pin, false);
        System.out.println("🔵 Found orders: " + orders.size());
        System.out.println("🔵 Sending response...");
        return orders;
    } catch (Exception e) {
        System.out.println("🔴 Error: " + e.getMessage());
        e.printStackTrace();
        return Collections.emptyList();
    }
}
```

### Step 2: Check Database for Orders

Run this query in your database:
```sql
SELECT * FROM orders WHERE pincode = 800020 AND assigned = false;
```

If no orders exist, **create a test order**:
```sql
INSERT INTO orders (order_id, pincode, assigned, status, ...) 
VALUES (uuid_generate_v4(), 800020, false, 0, ...);
```

### Step 3: Verify WebSocket Security

Check if your backend WebSocket security allows the connection:

```java
// In WebSocketConfig.java or Security Config
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")  // ✅ Should allow all origins
            .withSockJS();
}
```

### Step 4: Test REST API for Comparison

Use the debug panel or run this in browser console:
```javascript
const token = localStorage.getItem('token');
const userId = 'f858012e-39ec-4528-ab6d-14099d010e26';
fetch(`https://api.rozomeal.com/food-partner/get-orders?userId=${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log('REST API Orders:', d));
```

## 🎯 Expected Behavior

### If Orders Exist:
```
📨 RAW MESSAGE RECEIVED FROM SERVER:
   Body: [{"orderId":"abc-123","customerName":"John",...}]

📥 PARSED ORDER DATA: Array(3)
   Order count: 3
   First order: {orderId: "abc-123", ...}

📦 Received orders from WebSocket: 3
```

### If No Orders Exist:
```
📨 RAW MESSAGE RECEIVED FROM SERVER:
   Body: []

📥 PARSED ORDER DATA: []
   Order count: 0

(No orders displayed in UI)
```

### If Backend Error:
```
⏰ 5 seconds passed - checking if server responded...
   If no response above, check:
   1. Backend @MessageMapping("/getOrders") is working
   2. Backend @SendToUser("/queue/orders") is configured
   3. Backend has orders for pincode: 800020
   4. Backend WebSocket security allows this connection
```

## 🛠️ Common Issues & Solutions

### Issue 1: No Response After 5 Seconds
**Problem**: Backend not receiving or not responding
**Solution**:
- Check backend logs for errors
- Verify @MessageMapping("/getOrders") exists
- Check if backend is running on correct port
- Verify WebSocket endpoint is accessible

### Issue 2: Empty Array Response
**Problem**: Backend responds but no orders
**Solution**:
- Check database for orders with pincode 800020
- Verify `assigned = false` in query
- Create test orders in database

### Issue 3: Parse Error
**Problem**: Cannot parse response
**Solution**:
- Check backend returns proper JSON
- Verify Content-Type headers
- Check for extra characters in response

## 📱 Using the Debug Panel

Add this to your dashboard to see real-time logs:

```tsx
import { WebSocketDebugPanel } from '../components/debug/WebSocketDebugPanel';

// In your dashboard page
<WebSocketDebugPanel />
```

## 🎉 Success Indicators

You'll know it's working when you see:
1. ✅ Request sent with pincode
2. ✅ Server response received within 1 second
3. ✅ Orders array parsed successfully
4. ✅ Orders displayed in UI

## 📞 Next Steps

1. **Refresh your browser** to load the new debug logging
2. **Login again** with your test account
3. **Check the console** for detailed logs
4. **Check backend logs** to verify request received
5. **Verify database** has orders for pincode 800020

The enhanced logging will now show you exactly what's happening! 🚀
