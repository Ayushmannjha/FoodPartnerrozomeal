import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Profile', href: '/dashboard/profile', icon: '📋' },
    { name: 'Assigned', href: '/dashboard/assigned', icon: '🍽️' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Order Assigned', href: '/dashboard/order-assigned', icon: '📦' },
    { name: 'Order', href: '/dashboard/order', icon: '📋' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
