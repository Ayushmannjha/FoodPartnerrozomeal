import React, { createContext, useContext, useReducer, type ReactNode, useEffect, useCallback } from 'react';
import type { Order } from '../types/order';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNotification } from '../hooks/useNotification';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: number | null;
    dateFrom: string | null;
    dateTo: string | null;
    searchTerm: string;
  };
  acceptedOrderIds: Set<string>; // ✅ ONLY for notification prevention (NOT for filtering display)
}

type OrderAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_SELECTED_ORDER'; payload: Order | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<OrderState['filters']> }
  | { type: 'UPDATE_ORDER'; payload: Order}
  | { type: 'REMOVE_ORDER'; payload: string }
  | { type: 'MARK_ORDER_ACCEPTED'; payload: string }; // ✅ Add accepted tracking

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    dateFrom: null,
    dateTo: null,
    searchTerm: ''
  },
  acceptedOrderIds: new Set() // ✅ Initialize accepted orders set
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_ORDERS':
      console.log('🔧 Reducer SET_ORDERS:', {
        currentCount: state.orders.length,
        newCount: action.payload.length,
        newOrders: action.payload.map(o => o.orderId)
      });
      return { ...state, orders: action.payload, loading: false };
    
    case 'ADD_ORDER':
      const orderExists = state.orders.some(order => order.orderId === action.payload.orderId);
      if (orderExists) {
        console.log('ℹ️ Reducer ADD_ORDER: Order already exists:', action.payload.orderId);
        return state;
      }
      console.log('✅ Reducer ADD_ORDER: Adding new order:', action.payload.orderId);
      return { 
        ...state, 
        orders: [action.payload, ...state.orders]
      };
    
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrder: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.orderId === action.payload.orderId ? action.payload : order
        )
      };
    
    case 'REMOVE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.orderId !== action.payload)
      };
    
    case 'MARK_ORDER_ACCEPTED': // ✅ Mark accepted + update status optimistically
      console.log('✅ Marking order as accepted (notification prevention):', action.payload);
      console.log('ℹ️  Optimistically updating order status to 1 (Accepted)');
      return {
        ...state,
        acceptedOrderIds: new Set([...state.acceptedOrderIds, action.payload]),
        // ✅ Optimistically update the order status to "Accepted" (1)
        orders: state.orders.map(order =>
          order.orderId === action.payload
            ? { ...order, status: 1 } // Update status to Accepted
            : order
        )
      };
    
    default:
      return state;
  }
};

interface OrderContextType {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;  // ✅ Removes from both WebSocket and local state
  markOrderAsAccepted: (orderId: string) => void; // ✅ Mark order as accepted globally
  setFilters: (filters: Partial<OrderState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshWebSocket: () => void;
  wsConnected: boolean;
  wsError: string | null;
  reconnectAttempts: number;
  isInitialLoadComplete: boolean; // ✅ Added to track initial load completion
  // ✅ Accept order via: orderService.acceptOrder() or useOrderAccept() hook
  // ✅ Update status via: orderService.updateOrderStatus() or useOrders() hook
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const [previousOrderIds, setPreviousOrderIds] = React.useState<Set<string>>(new Set());
  const [isInitialLoadDone, setIsInitialLoadDone] = React.useState(false);

  // Get notification context to trigger notifications
  const notificationContext = useNotification();
  const { showNotification } = notificationContext;
  
  // Debug: Check if notification context is available
  console.log('🔍 OrderProvider: Notification context available?', {
    hasContext: !!notificationContext,
    hasShowNotification: typeof showNotification === 'function',
    activeNotification: notificationContext.activeNotification?.order?.orderId
  });

  const {
    wsConnected,
    orders: receivedOrders,
    refreshWebSocket,
    removeOrder: removeFromWebSocket,
    isInitialLoadComplete
  } = useWebSocket();

  // Handle new orders and trigger notifications
  // ✅ Use ref to track previous order count to detect changes
  const prevOrderCountRef = React.useRef<number>(0);

  useEffect(() => {
    if (!receivedOrders || !Array.isArray(receivedOrders)) {
      return;
    }

    const currentCount = receivedOrders.length;
    const previousCount = prevOrderCountRef.current;

    console.log('🔄 OrderContext: Checking orders:', {
      currentCount,
      previousCount,
      changed: currentCount !== previousCount,
      isInitialLoadDone
    });

    // ✅ ONLY dispatch if the count actually changed
    if (currentCount !== previousCount) {
      console.log('✅ OrderContext: Order count changed, dispatching SET_ORDERS with', currentCount, 'orders');
      dispatch({ type: 'SET_ORDERS', payload: receivedOrders });
      dispatch({ type: 'SET_ERROR', payload: null });
      prevOrderCountRef.current = currentCount;
    }
    
    // Handle initial load completion
    if (isInitialLoadComplete && !isInitialLoadDone) {
      console.log('📋 Initial load complete, remembering', receivedOrders.length, 'existing orders');
      setIsInitialLoadDone(true);
      setPreviousOrderIds(new Set(receivedOrders.map(o => o.orderId)));
      return;
    }
    
    // 🔔 Trigger notifications for NEW orders only (after initial load)
    // ✅ Also check acceptedOrderIds to prevent duplicate notifications
    if (isInitialLoadDone && receivedOrders.length > 0) {
      receivedOrders.forEach(order => {
        const isNewOrder = !previousOrderIds.has(order.orderId);
        const notAlreadyAccepted = !state.acceptedOrderIds.has(order.orderId);
        
        if (isNewOrder && notAlreadyAccepted) {
          console.log('🔔 NEW ORDER DETECTED! Showing notification:', order.orderId);
          showNotification(order);
          setPreviousOrderIds(prev => new Set([...prev, order.orderId]));
        } else if (isNewOrder && !notAlreadyAccepted) {
          console.log('⏭️ Skipping notification - order already accepted:', order.orderId);
          setPreviousOrderIds(prev => new Set([...prev, order.orderId]));
        }
      });
    }
  }, [receivedOrders, isInitialLoadDone, isInitialLoadComplete, showNotification]);

  // Removed wsError handling as it's no longer returned from useWebSocket

  const addOrder = useCallback((order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  const updateOrder = useCallback((order: Order) => {
    dispatch({ type: 'UPDATE_ORDER', payload: order });
  }, []);

  const removeOrder = useCallback((orderId: string) => {
    console.log('🎯 OrderContext removeOrder called for:', orderId);
    // Remove from WebSocket state (primary source)
    removeFromWebSocket(orderId);
    // Also remove from local context state
    dispatch({ type: 'REMOVE_ORDER', payload: orderId });
  }, [removeFromWebSocket]);

  const markOrderAsAccepted = useCallback((orderId: string) => {
    console.log('✅ OrderContext markOrderAsAccepted called for:', orderId);
    console.log('ℹ️  This prevents duplicate notifications - order will still display based on status');
    dispatch({ type: 'MARK_ORDER_ACCEPTED', payload: orderId });
  }, []);

  const setFilters = useCallback((filters: Partial<OrderState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const contextValue: OrderContextType = {
    state,
    dispatch,
    addOrder,
    updateOrder,
    removeOrder,
    markOrderAsAccepted, // ✅ Export globally accepted orders tracker
    setFilters,
    setLoading,
    setError,
    refreshWebSocket,
    wsConnected,
    wsError: null,
    reconnectAttempts: 0,
    isInitialLoadComplete, // ✅ Added for loading state tracking
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export const useOrderFilters = () => {
  const { state, setFilters } = useOrderContext();
  return {
    filters: state.filters,
    setFilters,
  };
};

export const useOrderWebSocket = () => {
  const { 
    wsConnected, 
    wsError, 
    reconnectAttempts, 
    isInitialLoadComplete,
    refreshWebSocket,
    removeOrder
  } = useOrderContext();
  
  return {
    wsConnected,
    wsError,
    reconnectAttempts,
    isInitialLoadComplete,
    refreshWebSocket,
    removeOrder  // ✅ Export removeOrder for direct WebSocket order removal
  };
  // ✅ For accepting orders, use: orderService.acceptOrder() or useOrderAccept() hook
  // ✅ For updating status, use: orderService.updateOrderStatus() or useOrders() hook
};
