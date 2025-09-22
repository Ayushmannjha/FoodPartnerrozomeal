import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OrderWithDetails } from '../types/order';

interface OrderState {
  orders: OrderWithDetails[];
  selectedOrder: OrderWithDetails | null;
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
  | { type: 'SET_ORDERS'; payload: OrderWithDetails[] }
  | { type: 'SET_SELECTED_ORDER'; payload: OrderWithDetails | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<OrderState['filters']> }
  | { type: 'UPDATE_ORDER'; payload: OrderWithDetails }
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
      return { ...state, orders: action.payload };
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrder: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
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

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | null>(null);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
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