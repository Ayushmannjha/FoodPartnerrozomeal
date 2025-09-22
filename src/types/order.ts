import { Food } from './food';
import { Thali } from './thali';

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at?: string | null;
  username: string;
  authorities: Array<{
    authority: string;
  }>;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}

export interface Order {
  orderId: string;
  user: User;
  foodIds: string[];
  thaliIds: string[] | null;
  quantity: number[];
  price: number;
  status: number;
  date: string;
}

export interface FoodPartner {
  userId: string;
  name: string;
  state: string;
  city: string;
  address: string;
  licenseNumber: string;
  certifications: string;
}

export interface AssignedOrder {
  id: number;
  order: Order;
  foodPartner: FoodPartner;
}

export interface AcceptOrderResponse {
  message: string;
  orderId: string;
  foodPartnerId: string;
}

export interface OrderWithDetails extends Order {
  foodDetails: Food[];
  thaliDetails: Thali[];
}

// Enhanced order interface with detailed items
export interface EnhancedOrder extends Order {
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'food' | 'thali';
  category?: string;
  imageUrl?: string;
}

// 🎯 Updated UpdateOrderResponse to match your actual API response
export interface UpdateOrderResponse {
  orderId: string;
  user: User;
  foodIds: string[];
  thaliIds: string[];
  quantity: number[];
  price: number;
  status: number;
  date: string;
  pincode: number;
  assigned: boolean;
}

// You assigned Order interface to the response of accept order api
export interface AssignedOrderResponse {
  orderId: string;
  user: User;
  foodIds: string[];
  thaliIds: string[] | null;
  quantity: number[];
  price: number;
  status: number;
  date: string;
  pincode: number;
  assigned: boolean; // 🎯 Fixed: boolean instead of Boolean
}

// 🎯 Move enum and constants to the end and make sure they're properly exported
export enum OrderStatus {
  PREPARING = 0,    // Customer sees: "preparing"
  ON_THE_WAY = 1,   // Customer sees: "on-the-way" 
  DELIVERED = 2,    // Customer sees: "delivered"
  CANCELLED = 3     // Customer sees: "cancelled"
}

// 🎯 Updated labels to match customer experience
export const ORDER_STATUS_LABELS = {
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.ON_THE_WAY]: 'On the Way',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled'
} as const;

// 🎯 Updated colors for new status mapping
export const ORDER_STATUS_COLORS = {
  [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800',    // Preparing food
  [OrderStatus.ON_THE_WAY]: 'bg-blue-100 text-blue-800',      // Out for delivery
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',     // Successfully delivered
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'          // Order cancelled
} as const;

// 🎯 Helper function to get customer status string (for reference)
export const getCustomerStatusString = (status: number): string => {
  switch (status) {
    case 0:
      return "preparing";
    case 1:
      return "on-the-way";
    case 2:
      return "delivered";
    case 3:
      return "cancelled";  
    default:
      return "unknown";
  }
};

// 🎯 Helper function for food partner actions (what they can do next)
export const getFoodPartnerActions = (currentStatus: number): string[] => {
  switch (currentStatus) {
    case OrderStatus.PREPARING:
      return ['Mark Ready for Delivery'];
    case OrderStatus.ON_THE_WAY:
      return ['Mark Delivered'];
    case OrderStatus.DELIVERED:
    case OrderStatus.CANCELLED:
      return []; // No more actions possible
    default:
      return [];
  }
};