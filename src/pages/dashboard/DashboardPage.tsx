import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Sidebar } from '../../components/layout/Sidebar';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
