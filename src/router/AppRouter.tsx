import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.tsx';
import { OrderProvider } from '../context/OrderContext.tsx';
import { PrivateRoute } from './PrivateRoute.tsx';
import { PublicRoute } from './PublicRoute.tsx';

// Public pages
import { HomePage } from '../pages/public/HomePage.tsx';
import { LoginPage } from '../pages/auth/LoginPage.tsx';

// Private pages
import { DashboardPage } from '../pages/dashboard/DashboardPage.tsx';
import { DashboardHome } from '../pages/dashboard/DashboardHome.tsx';
import { ProfilePage } from '../pages/dashboard/ProfilePage.tsx';
import { AssignedFoodPage } from '../pages/dashboard/AssignedFoodPage.tsx';
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage.tsx';
import { SettingsPage } from '../pages/dashboard/SettingsPage.tsx';
import { OrderAssignedPage } from '../pages/dashboard/OrderAssignedPage.tsx';
import { OrderPage } from '../pages/dashboard/OrderPage.tsx';

// 404 page component
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="text-gray-600 mt-4">Page not found</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <OrderProvider>
                  <DashboardPage />
                </OrderProvider>
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assigned" element={<AssignedFoodPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
              <Route path="order-assigned" element={<OrderAssignedPage />} />
                <Route path="order" element={<OrderPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
