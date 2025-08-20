import { useState } from "react"
import { motion } from "framer-motion"
import PropertyCard from "@/components/molecules/PropertyCard"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry,
  viewMode = "grid",
  sortBy = "price-low",
  onSortChange 
}) => {
  const [loadMoreCount, setLoadMoreCount] = useState(12)

  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest Listed" },
    { value: "bedrooms", label: "Most Bedrooms" },
    { value: "square-feet", label: "Largest First" }
  ]

  const sortProperties = (properties, sortBy) => {
    if (!properties) return []
    
    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.listingDate) - new Date(a.listingDate)
        case "bedrooms":
          return b.bedrooms - a.bedrooms
        case "square-feet":
          return (b.squareFeet || 0) - (a.squareFeet || 0)
        default:
          return 0
      }
    })
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRetry} />
  if (!properties || properties.length === 0) {
    return <Empty 
      title="No properties found" 
      description="Try adjusting your filters or search criteria to find more properties."
    />
  }

  const sortedProperties = sortProperties(properties, sortBy)
  const displayedProperties = sortedProperties.slice(0, loadMoreCount)

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {displayedProperties.length} of {sortedProperties.length} properties
        </p>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-6"
      }>
        {displayedProperties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
          >
            <PropertyCard 
              property={property} 
              className={viewMode === "list" ? "max-w-none" : ""}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {displayedProperties.length < sortedProperties.length && (
        <div className="text-center mt-12">
          <Button
            onClick={() => setLoadMoreCount(prev => prev + 12)}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Load More Properties
          </Button>
          <p className="text-gray-500 text-sm mt-2">
            {sortedProperties.length - displayedProperties.length} more properties available
          </p>
        </div>
      )}
    </div>
  )
}

export default PropertyGrid