interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-20',
    circular: 'rounded-full'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : '100%'),
    height: height || undefined
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton components for specific use cases
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <Skeleton width={120} className="h-6" />
            <Skeleton width={80} className="h-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton width={100} />
            <Skeleton width={80} />
            <Skeleton width={60} />
            <Skeleton width={90} />
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Skeleton width={100} className="h-8" />
          <Skeleton width={40} className="h-8" variant="circular" />
        </div>
      </div>
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="rectangular" height={192} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Skeleton width={150} className="h-6" />
          <Skeleton width={80} className="h-5" />
        </div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton width={60} className="h-8" />
          <Skeleton width={100} />
        </div>
        <Skeleton width="100%" className="h-10" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Skeleton width={80} className="mb-2" />
      <Skeleton width={40} className="h-8" />
    </div>
  );
}

// Grid skeleton loaders
export function OrdersGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FoodGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: count }, (_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
