import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PropertyGrid from "@/components/organisms/PropertyGrid"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { propertyService } from "@/services/api/propertyService"
import { useContext } from "react"
import { AuthContext } from "@/App"

const BrowseProperties = () => {
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

  const loadProperties = async () => {
    try {
      setError(null)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await propertyService.getAll()
      setProperties(data)
      setFilteredProperties(data)
    } catch (err) {
      setError("Failed to load properties. Please try again.")
      console.error("Error loading properties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

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

    // Location filter
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
          Find Your <span className="price-gradient bg-clip-text text-transparent">Dream Home</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover thousands of beautiful properties in your ideal location. 
          Start your journey to homeownership today.
        </p>
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

        {/* Properties Section */}
        <div className="flex-1">
          {/* View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-display font-semibold text-primary">
              Available Properties
              <Button onClick={() => {
                let abcd = {};
                console.log('abcd', abcd.length());
              }}>CLick me</Button>
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
              onRetry={loadProperties}
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

export default BrowseProperties