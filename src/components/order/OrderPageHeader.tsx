// src/components/order/OrderPageHeader.tsx
import { RefreshCw } from 'lucide-react';

interface OrderPageHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function OrderPageHeader({ title, subtitle, onRefresh, isLoading }: OrderPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </div>
  );
}