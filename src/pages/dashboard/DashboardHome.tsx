import { RefreshCw, TrendingUp, TrendingDown, DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';

export function DashboardHome() {
  const { stats, loading, error, refresh } = useDashboard();

  // Calculate percentage changes (mock data - you can enhance this later)
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous day data - you can add this to API later
  const previousDayOrders = 3;
  const previousDayIncome = 2000;

  const ordersChange = stats ? getPercentageChange(stats.successOrders, previousDayOrders) : 0;
  const incomeChange = stats ? getPercentageChange(stats.finalIncome, previousDayIncome) : 0;

  return (
    <div>
      {/* Header with Refresh Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome to your food partner dashboard</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error}
            <button
              onClick={refresh}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards - Loading State */}
      {loading && <DashboardSkeleton />}

      {/* Stats Cards - Loaded State */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Success Orders Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Success Orders</h3>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.successOrders}
            </div>
            <div className="flex items-center text-xs">
              {ordersChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{ordersChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{ordersChange.toFixed(1)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{stats.finalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-xs">
              {incomeChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{incomeChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{incomeChange.toFixed(1)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-gray-500">All time orders received</p>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.totalOrders > 0 
                      ? ((stats.successOrders / stats.totalOrders) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalOrders > 0 
                        ? (stats.successOrders / stats.totalOrders) * 100 
                        : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Average Order Value</span>
                  <span className="text-sm font-semibold text-blue-600">
                    ₹{stats.successOrders > 0 
                      ? (stats.finalIncome / stats.successOrders).toFixed(2) 
                      : 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((stats.finalIncome / stats.successOrders / 1000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-md">
                <span className="text-sm text-gray-600">Completed Orders</span>
                <span className="text-lg font-bold text-green-600">{stats.successOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-md">
                <span className="text-sm text-gray-600">Pending Orders</span>
                <span className="text-lg font-bold text-orange-600">
                  {stats.totalOrders - stats.successOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-md">
                <span className="text-sm text-gray-600">Today's Earnings</span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{stats.finalIncome.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions and Recent Activity (keep existing code) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <span className="mr-2">📋</span>
              View All Orders
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <span className="mr-2">🍽️</span>
              Manage Menu
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <span className="mr-2">📊</span>
              View Analytics
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <span className="mr-2">⚙️</span>
              Settings
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {!loading && stats && stats.totalOrders === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No orders yet</p>
              <p className="text-sm">Start accepting orders to see activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-gray-500">Order #ORD001 - ₹450</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Menu item updated</p>
                  <p className="text-xs text-gray-500">Chicken Curry - Price updated</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500">₹{stats?.finalIncome.toFixed(2)} from {stats?.successOrders} orders</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
