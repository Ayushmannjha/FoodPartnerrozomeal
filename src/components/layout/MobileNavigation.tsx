import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Home, Package, ChefHat, BarChart2, User, Settings, X } from "lucide-react";

export function MobileNavigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // All navigation items
  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Orders', href: '/dashboard/order', icon: <Package className="h-5 w-5" /> },
    { name: 'Assigned', href: '/dashboard/assigned', icon: <ChefHat className="h-5 w-5" /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <User className="h-5 w-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Order Assigned', href: '/dashboard/order-assigned', icon: <Package className="h-5 w-5" /> },
  ];

  // Primary navigation for bottom bar (limit to 4-5 most important)
  const primaryNav = allNavItems.slice(0, 6);
  
  // Secondary navigation for drawer
  const secondaryNav = allNavItems;

  return (
    <>
      {/* Bottom Navigation Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
        <div className="flex justify-around items-center">
          {primaryNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 px-3 ${
                location.pathname === item.href
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-full ${
                location.pathname === item.href ? 'bg-orange-100' : ''
              }`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          
          {/* Drawer Trigger Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center py-2 px-3 text-gray-600">
                <div className="p-1 rounded-full">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Menu</span>
              </button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-72 sm:w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium">Menu</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Drawer Navigation */}
                <div className="flex-1 overflow-auto py-2">
                  <ul className="space-y-1">
                    {secondaryNav.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-5 py-3 ${
                            location.pathname === item.href
                              ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Drawer Footer */}
                <div className="p-4 border-t mt-auto">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">Need help?</p>
                    <button className="text-sm font-medium text-orange-600 mt-1">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Space placeholder to prevent content from being hidden behind the bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}