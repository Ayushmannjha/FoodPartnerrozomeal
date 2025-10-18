import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';

interface HistoryStatsCardsProps {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export function HistoryStatsCards({
  totalOrders,
  totalRevenue,
  averageOrderValue,
  thisWeekOrders,
  thisMonthOrders,
}: HistoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Orders */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Total Completed</h3>
          <Package className="h-8 w-8 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-green-600 mb-1">
          {totalOrders}
        </div>
        <p className="text-xs text-gray-500">All time completed orders</p>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-1">
          ₹{totalRevenue.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-gray-500">Total earnings from orders</p>
      </div>

      {/* Average Order Value */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Average Order</h3>
          <TrendingUp className="h-8 w-8 text-orange-600" />
        </div>
        <div className="text-3xl font-bold text-orange-600 mb-1">
          ₹{averageOrderValue.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-gray-500">Per order average</p>
      </div>

      {/* This Month */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">This Month</h3>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
        <div className="text-3xl font-bold text-purple-600 mb-1">
          {thisMonthOrders}
        </div>
        <p className="text-xs text-gray-500">
          This week: <span className="font-medium">{thisWeekOrders}</span>
        </p>
      </div>
    </div>
  );
}
