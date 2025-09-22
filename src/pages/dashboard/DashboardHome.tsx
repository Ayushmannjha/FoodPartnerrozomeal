export function DashboardHome() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your food partner dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Orders</h3>
          <div className="text-3xl font-bold text-orange-600">12</div>
          <p className="text-xs text-gray-500">+2 from yesterday</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
          <div className="text-3xl font-bold text-green-600">₹2,450</div>
          <p className="text-xs text-gray-500">+15% from yesterday</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Items</h3>
          <div className="text-3xl font-bold text-blue-600">8</div>
          <p className="text-xs text-gray-500">Menu items available</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Rating</h3>
          <div className="text-3xl font-bold text-yellow-600">4.8</div>
          <p className="text-xs text-gray-500">⭐⭐⭐⭐⭐</p>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="mr-2">📋</span>
              View All Orders
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="mr-2">🍽️</span>
              Manage Menu
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="mr-2">📊</span>
              View Analytics
            </button>
            <button className="w-full flex items-center justify-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="mr-2">⚙️</span>
              Settings
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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
                <p className="text-xs text-gray-500">₹1,250 from 3 orders</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
