export default function OrdersLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
