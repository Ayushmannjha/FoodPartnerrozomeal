import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrderContext, useOrderWebSocket } from '../../context/OrderContext';
import { useOrderAccept } from '../../hooks/useOrderAccept';
import { canAcceptOrder } from '../../utils/orderUtils';
import { OrderCard } from '../../components/order/OrderCard';
import { OrderPageHeader } from '../../components/order/OrderPageHeader';
import { OrderFilters } from '../../components/order/OrderFilters';
import { EmptyOrderState } from '../../components/order/EmptyOrderState';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Package, Clock, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export function OrderPage() {
  const { user } = useAuth();
  const { state, updateOrder, setFilters } = useOrderContext();
  const { 
    wsConnected, 
    wsError, 
    refreshWebSocket,
    removeOrder: removeFromWebSocket
  } = useOrderWebSocket();
  const { acceptOrder } = useOrderAccept(); // ✅ Use orderService via hook
  
  const [acceptingOrders, setAcceptingOrders] = useState<Set<string>>(new Set());

  // Filter orders based on current filters
  const filteredOrders = state.orders.filter(order => {
    const { filters } = state;
    
    const matchesSearch = !filters.searchTerm || 
      order.orderId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      order.user.phone.includes(filters.searchTerm);

    const matchesStatus = filters.status === null || order.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  // Categorize orders
  const pendingOrders = state.orders.filter(order => canAcceptOrder(order.status));
  const activeOrders = state.orders.filter(order => order.status === 1 || order.status === 2);
  const completedOrders = state.orders.filter(order => order.status === 3);

  // Handle order acceptance
  // ✅ Now uses orderService.acceptOrder() via useOrderAccept() hook
  const handleAcceptOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    console.log('🎯 handleAcceptOrder called for orderId:', orderId);
    
    if (!user?.id) {
      console.error('❌ User not authenticated');
      return { success: false, message: 'User not authenticated' };
    }

    setAcceptingOrders(prev => new Set(prev).add(orderId));

    try {
      console.log('📤 Accepting order via orderService...');
      
      const result = await acceptOrder(orderId, user.id);
      
      console.log('📥 Accept order result:', result);
      
      if (result.success) {
        // ✅ Remove from WebSocket state via OrderContext (primary source)
        console.log('✅ Order accepted successfully - removing from pending orders');
        removeFromWebSocket(orderId);  // ✅ Use WebSocket removeOrder via OrderContext
        
        console.log('🎉 Order acceptance complete!');
      } else {
        console.error('❌ Order acceptance failed:', result.message);
      }
      
      return result; // Returns {success, data, message}
    } catch (error) {
      console.error('❌ Error accepting order:', error);
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

  // Handle filter changes
  const handleFilterChange = (filters: { status: string; search: string }) => {
    setFilters({
      status: filters.status === 'all' ? null : parseInt(filters.status),
      searchTerm: filters.search
    });
  };

  // Loading state
  if (state.loading && state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* WebSocket Status Indicator */}
        <div className="mb-4 flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            wsConnected 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {wsConnected ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
            {wsConnected ? 'Real-time Connected' : 'Connection Lost'}
          </div>
          
          {!wsConnected && (
            <button
              onClick={refreshWebSocket}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Reconnect
            </button>
          )}
        </div>

        {/* WebSocket Error Alert */}
        {wsError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              WebSocket Error: {wsError}
            </AlertDescription>
          </Alert>
        )}

        {/* Page Header */}
        <OrderPageHeader
          title="Order Management"
          subtitle="Manage your customer orders efficiently"
          onRefresh={refreshWebSocket}
          isLoading={state.loading}
        />

        {/* Error Alert */}
        {state.error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={state.orders.length}
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
        {state.orders.length === 0 ? (
          <EmptyOrderState
            title="No Orders Yet"
            description="You haven't received any orders yet. Orders will appear here when customers place them."
            actionButton={
              <button
                onClick={refreshWebSocket}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Connection
              </button>
            }
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyOrderState
            title="No Matching Orders"
            description="No orders match your current filters. Try adjusting your search criteria."
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.orderId}
                order={order}
                onAccept={handleAcceptOrder}
                isAccepting={acceptingOrders.has(order.orderId)}
                showDetails={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'yellow' | 'orange' | 'green';
  highlight?: boolean;
}

function StatCard({ title, value, icon: Icon, color, highlight = false }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${highlight ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
