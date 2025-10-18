import { Search, Calendar, ArrowUpDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface HistoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  onSortChange: (value: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc') => void;
  onDateRangeClick: () => void;
}

export function HistoryFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onDateRangeClick,
}: HistoryFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date Range Filter */}
        <Button
          variant="outline"
          onClick={onDateRangeClick}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Date Range
        </Button>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Highest Amount</SelectItem>
            <SelectItem value="amount-asc">Lowest Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
