import { useState } from 'react';
import { RefreshCw, Download, FileText } from 'lucide-react';
import { useHistoryOrders } from '../../hooks/useHistoryOrders';
import { HistoryStatsCards } from '../../components/history/HistoryStatsCards';
import { HistoryFilters } from '../../components/history/HistoryFilters';
import { HistoryTable } from '../../components/history/HistoryTable';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';

export function HistoryPage() {
  const {
    filteredOrders,
    loading,
    error,
    refresh,
    setSearchTerm,
    setSortBy,
    stats,
  } = useHistoryOrders();

  const [searchValue, setSearchValue] = useState('');
  const [sortByValue, setSortByValue] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setSearchTerm(value);
  };

  const handleSortChange = (value: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc') => {
    setSortByValue(value);
    setSortBy(value);
  };

  const handleDateRangeClick = () => {
    // TODO: Implement date range picker
    console.log('Date range picker coming soon!');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">View all your completed orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
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

      {/* Loading State */}
      {loading && <DashboardSkeleton />}

      {/* Stats Cards */}
      {!loading && !error && (
        <HistoryStatsCards
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
          averageOrderValue={stats.averageOrderValue}
          thisWeekOrders={stats.thisWeekOrders}
          thisMonthOrders={stats.thisMonthOrders}
        />
      )}

      {/* Filters */}
      {!loading && !error && (
        <HistoryFilters
          searchTerm={searchValue}
          onSearchChange={handleSearchChange}
          sortBy={sortByValue}
          onSortChange={handleSortChange}
          onDateRangeClick={handleDateRangeClick}
        />
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
              <span className="font-medium">{stats.totalOrders}</span> orders
            </p>
          </div>
          <HistoryTable orders={filteredOrders} />
        </>
      )}

      {/* Empty State */}
      {!loading && !error && stats.totalOrders === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-24 w-24 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Completed Orders Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start accepting and completing orders to see your history here
          </p>
        </div>
      )}
    </div>
  );
}
