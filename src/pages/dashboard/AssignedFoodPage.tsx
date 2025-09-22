import { useState } from 'react';
import { useAssignedFood } from '../../hooks/useAssignedFood';
import type { FlattenedAssignedFood } from '../../types/assignedFood';
import { FoodGridSkeleton, StatsGridSkeleton } from '../../components/common/Skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export function AssignedFoodPage() {
  const { 
    assignedFoods, 
    loading, 
    error, 
    refetch, 
    toggleAvailability,
    clearError 
  } = useAssignedFood();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter foods based on search and category
  const filteredFoods = assignedFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All Categories', ...new Set(assignedFoods.map(food => food.category))];

  const handleToggleAvailability = async (assignedFoodId: string, currentStatus: boolean) => {
    const result = await toggleAvailability(assignedFoodId, !currentStatus);
    if (result.success) {
      console.log('✅ Availability toggled successfully');
    }
  };

  if (loading && assignedFoods.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Assigned Menu Items</h2>
          <p className="text-gray-600">Manage your assigned food items and their availability</p>
        </div>

        {/* Action Bar Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <StatsGridSkeleton />

        {/* Food Grid Skeleton */}
        <FoodGridSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Assigned Menu Items</h2>
        <p className="text-gray-600">Manage your assigned food items and their availability</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
            <button
              onClick={clearError}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="border border-gray-300 rounded-md px-3 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={refetch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-2xl font-bold text-gray-900">{assignedFoods.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="text-2xl font-bold text-green-600">
            {assignedFoods.filter(food => food.isAvailable).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">
            {assignedFoods.filter(food => !food.isAvailable).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {assignedFoods.length === 0 
              ? 'No food items assigned yet' 
              : 'No items match your search criteria'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <FoodItemCard
              key={food.id}
              food={food}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Food Item Card Component - Simplified
interface FoodItemCardProps {
  food: FlattenedAssignedFood;
  onToggleAvailability: (assignedFoodId: string, currentStatus: boolean) => void;
}

// Simplified FoodItemCard with only availability toggle
function FoodItemCard({ 
  food, 
  onToggleAvailability
}: FoodItemCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 🎯 URL construction
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return `https://via.placeholder.com/300x200?text=${encodeURIComponent(food.name)}&color=6B7280&background=F3F4F6`;
    }
    
    // Check if it's already a complete URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Remove leading slash to avoid double slashes
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    return `https://api.rozomeal.com/${cleanPath}`;
  };

  const primaryImageUrl = getImageUrl(food.imageUrl);
  const fallbackImageUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(food.name)}&color=6B7280&background=F3F4F6`;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoading(false);
    
    if (!imageError) {
      setImageError(true);
      e.currentTarget.src = fallbackImageUrl;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 🖼️ Image Container */}
      <div className="relative w-full h-48 bg-gray-100">
        {/* Loading Skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading image...</div>
          </div>
        )}
        
        {/* Actual Image */}
        <img 
          src={primaryImageUrl}
          alt={food.name}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Error State Overlay */}
        {imageError && !imageLoading && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
            Failed to load
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            food.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {food.isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-orange-600">₹{food.price}</span>
          <span className="text-sm text-gray-500">Category: {food.category}</span>
        </div>
        
        {/* Only Availability Toggle Button */}
        <button 
          onClick={() => onToggleAvailability(food.id, food.isAvailable)}
          className={`w-full py-2 px-3 rounded-md text-sm flex items-center justify-center ${
            food.isAvailable 
              ? 'bg-gray-600 hover:bg-gray-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {food.isAvailable ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Mark as Out of Stock
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Mark as Available
            </>
          )}
        </button>
      </div>
    </div>
  );
}
