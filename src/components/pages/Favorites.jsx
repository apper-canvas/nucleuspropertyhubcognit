import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import PropertyCard from "@/components/molecules/PropertyCard"
import PropertyComparison from "@/components/molecules/PropertyComparison"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { useFavorites } from "@/hooks/useFavorites"

const Favorites = () => {
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState([])
  const [viewMode, setViewMode] = useState("grid")

  const handleCompareToggle = () => {
    setCompareMode(!compareMode)
    if (!compareMode) {
      setSelectedForComparison([])
    }
  }

  const handlePropertySelect = (property) => {
    if (selectedForComparison.find(p => p.Id === property.Id)) {
      setSelectedForComparison(prev => prev.filter(p => p.Id !== property.Id))
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, property])
    }
  }

  const handleRemoveFromComparison = (propertyId) => {
    setSelectedForComparison(prev => prev.filter(p => p.Id !== propertyId))
  }

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`)
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Empty
            icon="Heart"
            title="No favorites yet"
            description="Start browsing properties and save the ones you love to see them here."
            actionLabel="Browse Properties"
            onAction={() => navigate("/")}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            You have {favorites.length} saved propert{favorites.length === 1 ? "y" : "ies"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Compare Mode Toggle */}
          <Button
            variant={compareMode ? "secondary" : "outline"}
            onClick={handleCompareToggle}
            className="flex items-center"
          >
            <ApperIcon name="GitCompare" className="w-4 h-4 mr-2" />
            Compare
            {selectedForComparison.length > 0 && (
              <span className="ml-2 bg-white text-secondary rounded-full text-xs px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {selectedForComparison.length}
              </span>
            )}
          </Button>

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

      {/* Compare Instructions */}
      {compareMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start">
            <ApperIcon name="Info" className="w-5 h-5 text-accent mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-accent mb-1">Compare Properties</h3>
              <p className="text-sm text-accent/80">
                Click on properties to select them for comparison (up to 3 properties).
                Selected: {selectedForComparison.length}/3
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Property Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
            : "space-y-6 mb-8"
        }
      >
        {favorites.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
            className="relative"
          >
            {compareMode && (
              <div className="absolute top-3 left-3 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handlePropertySelect(property)
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedForComparison.find(p => p.Id === property.Id)
                      ? "bg-secondary border-secondary text-white"
                      : "bg-white/90 border-gray-300 hover:border-secondary"
                  }`}
                >
                  {selectedForComparison.find(p => p.Id === property.Id) && (
                    <ApperIcon name="Check" className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
            <PropertyCard 
              property={property}
              className={`${
                compareMode && selectedForComparison.find(p => p.Id === property.Id)
                  ? "ring-2 ring-secondary shadow-lg"
                  : ""
              } ${viewMode === "list" ? "max-w-none" : ""}`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Property Comparison */}
      {selectedForComparison.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <PropertyComparison
            properties={selectedForComparison}
            onRemoveProperty={handleRemoveFromComparison}
            onViewProperty={handleViewProperty}
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="lg"
          className="min-w-[200px]"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Find More Properties
        </Button>
      </motion.div>
    </div>
  )
}

export default Favorites