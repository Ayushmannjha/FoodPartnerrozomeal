export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}