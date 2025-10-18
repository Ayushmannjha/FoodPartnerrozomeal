import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { Home, Package, ChefHat, BarChart2, User, Settings } from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // If mobile, use the mobile navigation
  if (isMobile) {
    return <MobileNavigation />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Orders', href: '/dashboard/order', icon: <Package className="h-5 w-5" /> },
    { name: 'Orders History', href: '/dashboard/history', icon: <ChefHat className="h-5 w-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <User className="h-5 w-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Order Assigned', href: '/dashboard/order-assigned', icon: <Package className="h-5 w-5" /> },
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
