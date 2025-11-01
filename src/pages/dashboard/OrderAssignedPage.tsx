import { useState } from 'react';
import { useAssignedOrders } from '../../hooks/useAssignedOrders';
import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types/order';
import type { AssignedOrder } from '../../types/order';
import { OrdersGridSkeleton, StatsGridSkeleton } from '../../components/common/Skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Clock, User, Package, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

export function OrderAssignedPage() {
  const { 
    assignedOrders, 
    loading, 
    error, 
    updatingOrderId,
    refetch, 
    updateOrderStatus,
    clearError 
  } = useAssignedOrders();
  
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Filter orders based on status
  const filteredOrders = assignedOrders.filter(assignedOrder => {
    if (selectedStatus === 'All Status') return true;
    const statusValue = Object.entries(ORDER_STATUS_LABELS).find(
      ([_, label]) => label === selectedStatus
    )?.[0];
    return statusValue ? assignedOrder.order.status === parseInt(statusValue) : true;
  });

  // Get unique statuses for filter
  const statusOptions = ['All Status', ...Object.values(ORDER_STATUS_LABELS)];

  // In your OrderAssignedPage.tsx component
const getNextStatusOptions = (currentStatus: number): OrderStatus[] => {
  switch (currentStatus) {
    case OrderStatus.preparing_order:    // 0 → Can mark ready for delivery
      return [OrderStatus.delivered_order];  // [1]  // [2]

    case OrderStatus.delivered_order:    // 2 → Order complete, no more actions
    case OrderStatus.cancelled_order:    // 3 → Order cancelled, no more actions
      return [];
    
    default:
      return [];
  }
};

// 🎯 Update the status update handler to provide better feedback
const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
  console.log('🎯 Handling status update:', { orderId, newStatus });

  const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      console.log('✅ Order status updated successfully:', result.data);
      
      // Optional: Show success notification
      // You can add a toast notification here
    } else {
      console.error('❌ Failed to update order status:', result.message);
      
      // Optional: Show error notification
      // You can add a toast notification here
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (loading && assignedOrders.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Assigned Orders</h2>
          <p className="text-gray-600">Manage and track your assigned orders</p>
        </div>

        {/* Action Bar Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <StatsGridSkeleton />

        {/* Orders Skeleton */}
        <OrdersGridSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Assigned Orders</h2>
        <p className="text-gray-600">Manage and track your assigned orders</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
            <button
              onClick={clearError}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={refetch}
          className="bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
    <p className="text-2xl font-bold text-gray-900">{assignedOrders.length}</p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">Preparing</h3>
    <p className="text-2xl font-bold text-orange-600">
      {assignedOrders.filter(order => order.order.status === OrderStatus.preparing_order).length}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">Ready for Delivery</h3>
    <p className="text-2xl font-bold text-blue-600">
      {assignedOrders.filter(order => order.order.status === OrderStatus.delivered_order).length}
    </p>
  </div>
</div>
      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {assignedOrders.length === 0 
              ? 'No assigned orders yet' 
              : 'No orders match your filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((assignedOrder) => (
            <OrderCard
              key={assignedOrder.id}
              assignedOrder={assignedOrder}
              isExpanded={expandedOrders.has(assignedOrder.order.orderId)}
              onToggleExpansion={toggleOrderExpansion}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updatingOrderId === assignedOrder.order.orderId}
              nextStatusOptions={getNextStatusOptions(assignedOrder.order.status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Order Card Component
interface OrderCardProps {
  assignedOrder: any;
  isExpanded: boolean;
  onToggleExpansion: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  isUpdating: boolean;
  nextStatusOptions: OrderStatus[];
}

function OrderCard({ 
  assignedOrder, 
  isExpanded, 
  onToggleExpansion, 
  onStatusUpdate, 
  isUpdating,
  nextStatusOptions 
}: OrderCardProps) {
  const { order } = assignedOrder;
  const totalItems = assignedOrder.foodDetails.length + assignedOrder.thaliDetails.length;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderId.slice(-8)}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ORDER_STATUS_COLORS[order.status as OrderStatus]
              }`}>
                {ORDER_STATUS_LABELS[order.status as OrderStatus]}
              </span>
              {/* 🎯 Add assigned indicator */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Assigned
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{order.user.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span>{totalItems} items</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>₹{order.price}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {/* Status Update Buttons */}
     {nextStatusOptions.map(status => (
  <button
    key={status}
    onClick={() => onStatusUpdate(order.orderId, status)}
    disabled={isUpdating}
    className={`px-3 py-1 text-black text-xs rounded-md disabled:opacity-50 ${
      status === OrderStatus.delivered_order ? 'bg-green-600 hover:bg-green-700' :
      'bg-gray-600 hover:bg-gray-700'
    }`}
  >
    {isUpdating ? '⏳ Updating...' : 
     status === OrderStatus.delivered_order ? 'Mark ready to Deliver' :
     `Mark ${ORDER_STATUS_LABELS[status]}`
    }
  </button>
))}
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => onToggleExpansion(order.orderId)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Details (Expandable) */}
      {isExpanded && (
        <div className="p-4">
          {/* Customer Info */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Name:</span> {order.user.name}</p>
              <p><span className="font-medium">Email:</span> {order.user.email}</p>
              <p><span className="font-medium">Phone:</span> {order.user.phone}</p>
            </div>
          </div>

          {/* Food Items */}
          {assignedOrder.foodDetails.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Food Items</h4>
              <div className="space-y-2">
                {assignedOrder.foodDetails.map((food: any) => (
                  <div key={food.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="font-medium">{food.name}</span>
                      <span className="text-gray-600 ml-2">x{food.quantity}</span>
                    </div>
                    <span className="font-medium">₹{food.price * food.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thali Items */}
          {assignedOrder.thaliDetails.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Thali Items</h4>
              <div className="space-y-2">
                {assignedOrder.thaliDetails.map((thali: any) => (
                  <div key={thali.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="font-medium">{thali.name}</span>
                      <span className="text-gray-600 ml-2">x{thali.quantity}</span>
                    </div>
                    <span className="font-medium">₹{thali.price * thali.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{order.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
