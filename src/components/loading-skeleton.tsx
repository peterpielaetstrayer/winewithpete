export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeletonLarge() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border md:col-span-2">
        <div className="aspect-[4/3] bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeletonText() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}
