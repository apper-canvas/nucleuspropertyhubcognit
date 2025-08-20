import { useState } from "react"
import Button from "@/components/atoms/Button"
import { FilterSection, PriceRange, PropertyTypeFilter, BedroomBathroomFilter } from "@/components/molecules/FilterSection"
import ApperIcon from "@/components/ApperIcon"

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = () => {
    return filters.priceMin || 
           filters.priceMax || 
           (filters.propertyTypes && filters.propertyTypes.length > 0) ||
           filters.bedrooms ||
           filters.bathrooms ||
           filters.location
  }

  const getFilterCount = () => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.propertyTypes && filters.propertyTypes.length > 0) count++
    if (filters.bedrooms) count++
    if (filters.bathrooms) count++
    if (filters.location) count++
    return count
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {getFilterCount()}
              </span>
            )}
          </span>
          <ApperIcon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            className="w-4 h-4" 
          />
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? "block" : "hidden lg:block"} ${className}`}>
        <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-primary flex items-center">
              <ApperIcon name="Filter" className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters() && (
                <span className="ml-2 bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {getFilterCount()}
                </span>
              )}
            </h2>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-accent hover:text-accent/80"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Sections */}
          <div className="space-y-6">
            <FilterSection title="Price Range" defaultOpen={true}>
              <PriceRange filters={filters} onFilterChange={onFilterChange} />
            </FilterSection>

            <FilterSection title="Property Type" defaultOpen={true}>
              <PropertyTypeFilter filters={filters} onFilterChange={onFilterChange} />
            </FilterSection>

            <FilterSection title="Beds & Baths" defaultOpen={false}>
              <BedroomBathroomFilter filters={filters} onFilterChange={onFilterChange} />
            </FilterSection>
          </div>

          {/* Apply Filters Button (Mobile) */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar