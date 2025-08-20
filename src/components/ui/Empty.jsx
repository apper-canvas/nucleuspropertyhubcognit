import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  icon = "Search", 
  title = "No results found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-12 h-12 text-accent" />
      </div>
      
      <h2 className="text-2xl font-display font-bold text-primary mb-4">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="min-w-[200px]">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Filter" className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-primary mb-1">Adjust Filters</h4>
          <p className="text-sm text-gray-500">Try different price ranges or property types</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-secondary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="MapPin" className="w-6 h-6 text-secondary" />
          </div>
          <h4 className="font-semibold text-primary mb-1">Expand Location</h4>
          <p className="text-sm text-gray-500">Search in nearby cities or neighborhoods</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Bell" className="w-6 h-6 text-accent" />
          </div>
          <h4 className="font-semibold text-primary mb-1">Get Notified</h4>
          <p className="text-sm text-gray-500">Save your search and get alerts for new listings</p>
        </div>
      </div>
    </div>
  )
}

export default Empty