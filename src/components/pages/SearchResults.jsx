import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import PropertyGrid from "@/components/organisms/PropertyGrid"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { propertyService } from "@/services/api/propertyService"
import { useContext } from "react"
import { AuthContext } from "@/App"

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""
  
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("price-low")
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
    bedrooms: null,
    bathrooms: null,
    location: ""
  })

  const searchProperties = async (searchQuery) => {
    try {
      setError(null)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const allProperties = await propertyService.getAll()
      
      if (!searchQuery.trim()) {
        setProperties(allProperties)
        setFilteredProperties(allProperties)
        return
      }

const searchTerm = searchQuery.toLowerCase()
      const filtered = allProperties.filter(property => {
        return (
          property.title?.toLowerCase().includes(searchTerm) ||
          property.description?.toLowerCase().includes(searchTerm) ||
          property.location?.city?.toLowerCase().includes(searchTerm) ||
          property.location?.state?.toLowerCase().includes(searchTerm) ||
          property.location?.neighborhood?.toLowerCase().includes(searchTerm) ||
          property.propertyType?.toLowerCase().includes(searchTerm) ||
          property.features?.some(feature => feature?.toLowerCase().includes(searchTerm))
        )
      })

      setProperties(filtered)
      setFilteredProperties(filtered)
    } catch (err) {
      setError("Failed to search properties. Please try again.")
      console.error("Error searching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchProperties(query)
  }, [query])

  useEffect(() => {
    applyFilters()
  }, [filters, properties])

  const applyFilters = () => {
    let filtered = [...properties]

    // Price range filter
    if (filters.priceMin !== null) {
      filtered = filtered.filter(property => property.price >= filters.priceMin)
    }
    if (filters.priceMax !== null) {
      filtered = filtered.filter(property => property.price <= filters.priceMax)
    }

    // Property type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      )
    }

    // Bedroom filter
    if (filters.bedrooms !== null) {
      if (filters.bedrooms === "5+") {
        filtered = filtered.filter(property => property.bedrooms >= 5)
      } else {
        filtered = filtered.filter(property => property.bedrooms === filters.bedrooms)
      }
    }

    // Bathroom filter
    if (filters.bathrooms !== null) {
      if (filters.bathrooms === "5+") {
        filtered = filtered.filter(property => property.bathrooms >= 5)
      } else {
        filtered = filtered.filter(property => property.bathrooms === filters.bathrooms)
      }
    }

// Additional location filter
    if (filters.location && filters.location.trim()) {
      const searchLocation = filters.location.toLowerCase()
      filtered = filtered.filter(property =>
        property.location?.city?.toLowerCase().includes(searchLocation) ||
        property.location?.state?.toLowerCase().includes(searchLocation) ||
        property.location?.neighborhood?.toLowerCase().includes(searchLocation)
      )
    }

    setFilteredProperties(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedrooms: null,
      bathrooms: null,
      location: ""
    })
  }

  const handleNewSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-primary hover:text-accent mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
            {query ? (
              <>Search Results for "<span className="price-gradient bg-clip-text text-transparent">{query}</span>"</>
            ) : (
              "Search <span className='price-gradient bg-clip-text text-transparent'>Properties</span>"
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {properties.length > 0 
              ? `Found ${properties.length} propert${properties.length === 1 ? "y" : "ies"} matching your search`
              : "Try adjusting your search terms or filters"
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleNewSearch}
            placeholder="Refine your search..."
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Search Results */}
        <div className="flex-1">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-display font-semibold text-primary">
              {query ? `Results for "${query}"` : "Search Results"}
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-0"
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-0"
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Property Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              error={error}
              onRetry={() => searchProperties(query)}
              viewMode={viewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults