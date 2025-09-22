import { useAuth } from '../../context/AuthContext';

export function DashboardHeader() {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rozomeal Dashboard</h1>
            <p className="text-sm text-gray-600">Food Partner Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, {user.name || 'Partner'}
              </span>
            )}
            <button 
              onClick={logout}
              className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
