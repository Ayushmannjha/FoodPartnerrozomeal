// src/components/order/OrderStats.tsx
import { Order, OrderStatus } from '../../types/order';
import { Package, Clock, DollarSign, CheckCircle, Truck } from 'lucide-react';

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = {
    total: orders.length,
    preparing: orders.filter(order => order.status === OrderStatus.PREPARING).length,
    onTheWay: orders.filter(order => order.status === OrderStatus.ON_THE_WAY).length,
    delivered: orders.filter(order => order.status === OrderStatus.DELIVERED).length,
    cancelled: orders.filter(order => order.status === OrderStatus.CANCELLED).length,
    revenue: orders.reduce((sum, order) => sum + order.price, 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-orange-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Preparing</p>
            <p className="text-2xl font-bold text-orange-600">{stats.preparing}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Truck className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">On the Way</p>
            <p className="text-2xl font-bold text-blue-600">{stats.onTheWay}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-red-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}