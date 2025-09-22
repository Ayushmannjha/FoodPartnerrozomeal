// src/components/order/OrderFilters.tsx
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface OrderFiltersProps {
  onFilterChange: (filters: { status: string; search: string }) => void;
}

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: null },
    { value: 'pending', label: 'Pending', count: null },
    { value: 'accepted', label: 'Accepted', count: null }
  ];

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onFilterChange({ status: newStatus, search });
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    onFilterChange({ status, search: newSearch });
  };

  const clearFilters = () => {
    setStatus('all');
    setSearch('');
    onFilterChange({ status: 'all', search: '' });
  };

  const hasActiveFilters = status !== 'all' || search !== '';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        
        {/* Filter Label */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or phone..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="flex space-x-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}