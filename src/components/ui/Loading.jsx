import ApperIcon from "@/components/ApperIcon"

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="skeleton h-12 w-96 mx-auto mb-4 rounded-lg" />
        <div className="skeleton h-6 w-128 mx-auto rounded-lg" />
      </div>

      {/* Filter and Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar Skeleton */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-6">
            <div className="skeleton h-8 w-32 mb-6 rounded-lg" />
            
            {/* Filter Sections */}
            {[1, 2, 3].map(section => (
              <div key={section} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="skeleton h-6 w-24 mb-4 rounded-md" />
                <div className="space-y-3">
                  <div className="skeleton h-10 w-full rounded-lg" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map(item => (
                      <div key={item} className="skeleton h-8 w-16 rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="skeleton h-8 w-48 rounded-lg" />
            <div className="skeleton h-10 w-32 rounded-lg" />
          </div>

          {/* Property Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="bg-surface rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Image Skeleton */}
                <div className="skeleton h-64 w-full" />
                
                {/* Content Skeleton */}
                <div className="p-6">
                  {/* Price */}
                  <div className="skeleton h-8 w-32 mb-3 rounded-lg" />
                  
                  {/* Title */}
                  <div className="skeleton h-6 w-full mb-2 rounded-md" />
                  <div className="skeleton h-6 w-3/4 mb-4 rounded-md" />
                  
                  {/* Location */}
                  <div className="skeleton h-4 w-48 mb-4 rounded-md" />
                  
                  {/* Property Details */}
                  <div className="flex justify-between">
                    {[1, 2, 3].map(detail => (
                      <div key={detail} className="skeleton h-4 w-16 rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 bg-white rounded-full p-4 shadow-lg border border-gray-200">
        <ApperIcon name="Loader2" className="w-6 h-6 text-accent animate-spin" />
      </div>
    </div>
  )
}

export default Loading