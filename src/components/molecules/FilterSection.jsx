import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import ApperIcon from "@/components/ApperIcon"

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4 group"
      >
        <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-5 h-5 text-gray-500 group-hover:text-accent transition-all duration-200"
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const PriceRange = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="priceMin" className="block mb-2">Min Price</Label>
        <Input
          id="priceMin"
          type="number"
          placeholder="$0"
          value={filters.priceMin || ""}
          onChange={(e) => onFilterChange({ priceMin: e.target.value ? Number(e.target.value) : null })}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="priceMax" className="block mb-2">Max Price</Label>
        <Input
          id="priceMax"
          type="number"
          placeholder="Any"
          value={filters.priceMax || ""}
          onChange={(e) => onFilterChange({ priceMax: e.target.value ? Number(e.target.value) : null })}
          className="w-full"
        />
      </div>
    </div>
  )
}

const PropertyTypeFilter = ({ filters, onFilterChange }) => {
  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment", "Land"]
  
  const togglePropertyType = (type) => {
    const currentTypes = filters.propertyTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFilterChange({ propertyTypes: newTypes })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {propertyTypes.map(type => (
        <Button
          key={type}
          variant={filters.propertyTypes?.includes(type) ? "secondary" : "outline"}
          size="sm"
          onClick={() => togglePropertyType(type)}
          className="justify-start"
        >
          {type}
        </Button>
      ))}
    </div>
  )
}

const BedroomBathroomFilter = ({ filters, onFilterChange }) => {
  const options = [1, 2, 3, 4, "5+"]

  const handleBedroomChange = (bedrooms) => {
    onFilterChange({ bedrooms: bedrooms === filters.bedrooms ? null : bedrooms })
  }

  const handleBathroomChange = (bathrooms) => {
    onFilterChange({ bathrooms: bathrooms === filters.bathrooms ? null : bathrooms })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Bedrooms</Label>
        <div className="flex gap-2">
          {options.map(option => (
            <Button
              key={`bed-${option}`}
              variant={filters.bedrooms === option ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleBedroomChange(option)}
              className="flex-1"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="block mb-2">Bathrooms</Label>
        <div className="flex gap-2">
          {options.map(option => (
            <Button
              key={`bath-${option}`}
              variant={filters.bathrooms === option ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleBathroomChange(option)}
              className="flex-1"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { FilterSection, PriceRange, PropertyTypeFilter, BedroomBathroomFilter }