# WebSocket Cleanup - Removing Unused WebSocket Functions

## 📋 Analysis Summary

### ✅ HTTP-Based Functions (Already Working)
These are the **existing HTTP-based functions** that handle order operations:

#### 1. **Accept Order (HTTP)**
- **Service**: `orderService.acceptOrder(orderId, foodPartnerId)`
- **Endpoint**: `POST /food-partner/accept?orderId={orderId}&fid={foodPartnerId}`
- **Hook**: `useOrderAccept()` - Custom hook with loading/error states
- **Alternative Hook**: `useOrders()` also has `acceptOrder()` function
- **Status**: ✅ Working and actively used

#### 2. **Update Order Status (HTTP)**
- **Service**: `orderService.updateOrderStatus(orderId, status)`
- **Endpoint**: `PUT /food-partner/update-order?orderId={orderId}&status={status}`
- **Hook**: `useOrders()` has `updateOrderStatus()` function
- **Usage**: Used in `OrderAssignedPage.tsx`
- **Status**: ✅ Working and actively used

### ❌ WebSocket Functions (To Remove)
These were created but are **NOT being used** in the actual application:

#### 1. **Accept Order (WebSocket)**
- **Service**: `webSocket.acceptOrder(orderId, foodPartnerId)`
- **Destination**: `/app/acceptOrder`
- **Hook**: `useWebSocket()` exports `acceptOrderWs()`
- **Context**: `OrderContext` exposes `acceptOrderWs()`
- **Usage**: Only used in `WebSocketDemo.tsx` (demo component)
- **Status**: ❌ Remove - Not used in production

#### 2. **Update Order Status (WebSocket)**
- **Service**: `webSocket.updateOrderStatus(orderId, status)`
- **Destination**: `/app/updateOrderStatus`
- **Hook**: `useWebSocket()` exports `updateOrderStatus()`
- **Context**: `OrderContext` exposes `updateOrderStatus()`
- **Usage**: Not used anywhere in production code
- **Status**: ❌ Remove - Not used in production

## 🎯 WebSocket Purpose (After Cleanup)

**WebSocket should ONLY be used for:**
1. ✅ **Receiving new orders** in real-time (via `/topic/food-orders/{pincode}`)
2. ✅ **Listening for order updates** from backend (via `/user/queue/orders`)

**WebSocket should NOT be used for:**
1. ❌ Accepting orders (use HTTP `POST /food-partner/accept`)
2. ❌ Updating order status (use HTTP `PUT /food-partner/update-order`)

## 🔧 Changes Required

### 1. Remove from `webSocket.ts`
- Remove `acceptOrder()` function
- Remove `updateOrderStatus()` function
- Keep `connectWebSocket()`, `disconnectWebSocket()`, `requestOrdersByPincode()`

### 2. Update `useWebSocket.ts`
- Remove `acceptOrderWs` callback
- Remove `updateOrderStatus` callback
- Remove from return object
- Keep `orders`, `wsConnected`, `wsError`, `reconnectAttempts`, `refreshWebSocket`

### 3. Update `OrderContext.tsx`
- Remove `acceptOrderWs` from interface
- Remove `updateOrderStatus` from interface
- Remove from destructuring
- Remove from context value
- Keep WebSocket connection status and orders

### 4. Keep HTTP Functions
- ✅ `orderService.acceptOrder()` - Keep as-is
- ✅ `orderService.updateOrderStatus()` - Keep as-is
- ✅ `useOrderAccept()` hook - Keep as-is
- ✅ `useOrders()` hook - Keep as-is

## 📊 Before vs After

### Before (Confusing)
```
Accept Order:
  - HTTP: orderService.acceptOrder() ← Used
  - WebSocket: acceptOrderWs() ← Not used
  
Update Status:
  - HTTP: orderService.updateOrderStatus() ← Used
  - WebSocket: updateOrderStatus() ← Not used
```

### After (Clean)
```
Accept Order:
  - HTTP: orderService.acceptOrder() ← Only option
  
Update Status:
  - HTTP: orderService.updateOrderStatus() ← Only option
  
WebSocket:
  - Receive orders in real-time ← Only purpose
```

## ✅ Benefits of Cleanup

1. **Less Confusion**: Clear separation - WebSocket for receiving, HTTP for actions
2. **Simpler Code**: Remove unused functions and their TypeScript types
3. **Better Performance**: No unnecessary WebSocket subscriptions
4. **Easier Maintenance**: Only one way to do each operation
5. **Clear Architecture**: 
   - WebSocket = Real-time data push (backend → frontend)
   - HTTP = User actions (frontend → backend)

## 🧪 Testing After Cleanup

After cleanup, verify:
1. ✅ Orders still appear in real-time via WebSocket
2. ✅ Accept order button still works (via HTTP)
3. ✅ Update status still works (via HTTP)
4. ✅ No console errors
5. ✅ TypeScript compiles without errors

## 📝 Files to Modify

1. `/src/services/webSocket.ts` - Remove 2 functions
2. `/src/hooks/useWebSocket.ts` - Remove 2 callbacks
3. `/src/context/OrderContext.tsx` - Remove from interface
4. `/src/components/common/WebSocketDemo.tsx` - Update or remove (demo only)
