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
}

type OrderAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_SELECTED_ORDER'; payload: Order | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<OrderState['filters']> }
  | { type: 'UPDATE_ORDER'; payload: Order}
  | { type: 'REMOVE_ORDER'; payload: string };

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
  }
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
  const { showNotification } = useNotification();

  const {
    wsConnected,
    orders: receivedOrders,
    refreshWebSocket,
    removeOrder: removeFromWebSocket,
    isInitialLoadComplete
  } = useWebSocket();

  // Handle new orders and trigger notifications
  useEffect(() => {
    console.log('🔄 OrderContext: receivedOrders changed:', {
      isNull: receivedOrders === null,
      isArray: Array.isArray(receivedOrders),
      length: receivedOrders?.length,
      data: receivedOrders
    });
    
    if (receivedOrders && Array.isArray(receivedOrders) && receivedOrders.length > 0) {
      console.log('✅ OrderContext: Dispatching SET_ORDERS with', receivedOrders.length, 'orders');
      dispatch({ type: 'SET_ORDERS', payload: receivedOrders });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // 🔔 Trigger notifications for NEW orders only (skip initial load)
      if (isInitialLoadDone) {
        receivedOrders.forEach(order => {
          if (!previousOrderIds.has(order.orderId)) {
            console.log('🔔 New order detected, showing notification:', order.orderId);
            showNotification(order);
            setPreviousOrderIds(prev => new Set([...prev, order.orderId]));
          }
        });
      } else if (isInitialLoadComplete) {
        // Mark initial load as done and remember these order IDs
        console.log('📋 Initial load complete, remembering', receivedOrders.length, 'existing orders');
        setIsInitialLoadDone(true);
        setPreviousOrderIds(new Set(receivedOrders.map(o => o.orderId)));
      }
    } else if (receivedOrders && Array.isArray(receivedOrders) && receivedOrders.length === 0) {
      console.log('ℹ️ OrderContext: Received empty orders array');
      if (isInitialLoadComplete && !isInitialLoadDone) {
        setIsInitialLoadDone(true);
      }
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
