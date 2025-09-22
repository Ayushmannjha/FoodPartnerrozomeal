import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { OrderCardSkeleton, StatsCardSkeleton } from '../../components/common/Skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { OrderFilters } from '../../components/order/OrderFilters';
import { EmptyOrderState } from '../../components/order/EmptyOrderState';
import { OrderCard } from '../../components/order/OrderCard';
import { OrderPageHeader } from '../../components/order/OrderPageHeader';
import type { Order } from '../../types/order';
import { OrderStatus } from '../../types/order';
import { AlertCircle, Package, Clock, CheckCircle, Bell } from 'lucide-react';

export function OrderPage() {
  const { orders, loading, error, refetch, acceptOrder, clearError } = useOrders();
  const { user } = useAuth();
  
  // Local state for UI management
  const [acceptingOrders, setAcceptingOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(true);

  // Filter orders based on current filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.phone.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && (order.status === OrderStatus.PREPARING || order.status === 0)) ||
      (filterStatus === 'accepted' && order.status !== OrderStatus.PREPARING && order.status !== 0);

    return matchesSearch && matchesStatus;
  });

  // Categorize orders
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PREPARING || order.status === 0);
  const activeOrders = orders.filter(order => 
    order.status === OrderStatus.ON_THE_WAY || 
    order.status === 1
  );
  const completedOrders = orders.filter(order => 
    order.status === OrderStatus.DELIVERED || 
    order.status === 2
  );

  // Handle order acceptance
  const handleAcceptOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    if (!user?.id) {
      return { success: false, message: 'User not authenticated' };
    }

    setAcceptingOrders(prev => new Set(prev).add(orderId));

    try {
      const result = await acceptOrder(orderId, user.id);
      
      if (result.success) {
        // Refresh orders to get updated data
        await refetch();
        return { success: true, message: 'Order accepted successfully!' };
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to accept order' 
      };
    } finally {
      setAcceptingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Handle bulk accept for pending orders
  const handleBulkAccept = async () => {
    for (const order of pendingOrders) {
      await handleAcceptOrder(order.orderId);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filters: { status: string; search: string }) => {
    setFilterStatus(filters.status);
    setSearchTerm(filters.search);
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Loading Header */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Loading Orders */}
          <div className="space-y-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Page Header */}
        <OrderPageHeader
          title="Order Management"
          subtitle="Manage your customer orders efficiently"
          onRefresh={refetch}
          isLoading={loading}
        />

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
              <button
                onClick={clearError}
                className="ml-2 underline hover:no-underline font-medium"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Notification Bar for Pending Orders */}
        {pendingOrders.length > 0 && showNotifications && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    You have {pendingOrders.length} pending order{pendingOrders.length > 1 ? 's' : ''} waiting for acceptance
                  </p>
                  <p className="text-sm text-yellow-700">
                    Accept orders quickly to provide better customer service
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {pendingOrders.length > 1 && (
                  <button
                    onClick={handleBulkAccept}
                    disabled={acceptingOrders.size > 0}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
                  >
                    Accept All
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={orders.length}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Pending"
              value={pendingOrders.length}
              icon={Clock}
              color="yellow"
              highlight={pendingOrders.length > 0}
            />
            <StatCard
              title="Active"
              value={activeOrders.length}
              icon={Package}
              color="orange"
            />
            <StatCard
              title="Completed"
              value={completedOrders.length}
              icon={CheckCircle}
              color="green"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <OrderFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Orders Content */}
        {orders.length === 0 ? (
          <EmptyOrderState
            title="No Orders Yet"
            description="You haven't received any orders yet. Orders will appear here when customers place them."
            actionButton={
              <button
                onClick={refetch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Orders
              </button>
            }
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyOrderState
            title="No Matching Orders"
            description="No orders match your current filters. Try adjusting your search criteria."
            actionButton={
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            
            {/* Pending Orders Section */}
            {pendingOrders.filter(order => 
              filterStatus === 'all' || filterStatus === 'pending'
            ).length > 0 && (
              <OrderSection
                title="Pending Orders"
                orders={pendingOrders.filter(order => 
                  !searchTerm || 
                  order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onAccept={handleAcceptOrder}
                acceptingOrders={acceptingOrders}
                priority="high"
              />
            )}

            {/* Active Orders Section */}
            {activeOrders.filter(order => 
              filterStatus === 'all' || filterStatus === 'accepted'
            ).length > 0 && (
              <OrderSection
                title="Active Orders"
                orders={activeOrders.filter(order => 
                  !searchTerm || 
                  order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onAccept={handleAcceptOrder}
                acceptingOrders={acceptingOrders}
                priority="medium"
              />
            )}

            {/* Completed Orders Section */}
            {completedOrders.filter(order => 
              filterStatus === 'all' || filterStatus === 'accepted'
            ).length > 0 && (
              <OrderSection
                title="Completed Orders"
                orders={completedOrders.filter(order => 
                  !searchTerm || 
                  order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onAccept={handleAcceptOrder}
                acceptingOrders={acceptingOrders}
                priority="low"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'yellow' | 'orange' | 'green';
  highlight?: boolean;
}

function StatCard({ title, value, icon: Icon, color, highlight }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
    green: 'text-green-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${highlight ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

interface OrderSectionProps {
  title: string;
  orders: Order[];
  onAccept: (orderId: string) => Promise<{ success: boolean; message: string }>;
  acceptingOrders: Set<string>;
  priority: 'high' | 'medium' | 'low';
}

function OrderSection({ title, orders, onAccept, acceptingOrders, priority }: OrderSectionProps) {
  if (orders.length === 0) return null;

  const borderColor = {
    high: 'border-yellow-200',
    medium: 'border-orange-200',
    low: 'border-green-200'
  };

  return (
    <div className={`border-l-4 ${borderColor[priority]} pl-4`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {title} ({orders.length})
        </h2>
        {priority === 'high' && orders.length > 1 && (
          <span className="text-sm text-yellow-600 font-medium">
            ⚡ Requires immediate attention
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard
            key={order.orderId}
            order={order}
            onAccept={onAccept}
            isAccepting={acceptingOrders.has(order.orderId)}
            showDetails={false}
          />
        ))}
      </div>
    </div>
  );
}
