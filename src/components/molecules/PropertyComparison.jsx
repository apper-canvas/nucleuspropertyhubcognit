import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatPrice } from "@/utils/formatters"

const PropertyComparison = ({ properties, onRemoveProperty, onViewProperty }) => {
  if (!properties || properties.length === 0) {
    return null
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4">
        <h3 className="text-lg font-display font-semibold flex items-center">
          <ApperIcon name="GitCompare" className="w-5 h-5 mr-2" />
          Property Comparison ({properties.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-primary">Property</th>
{properties.map(property => (
                <th key={property.Id} className="p-4 min-w-[280px]">
                  <div className="relative">
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveProperty(property.Id)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-error"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </Button>
                  </div>
                  <h4 className="font-semibold text-primary text-left line-clamp-2 mb-2">
                    {property.title}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProperty(property.Id)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Price</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
                  <span className="text-xl font-bold price-gradient bg-clip-text text-transparent">
                    {formatPrice(property.price)}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Location</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
<div className="flex items-center justify-center">
                    <ApperIcon name="MapPin" className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm">
                      {property.location?.city}, {property.location?.state}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Type</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
                  <Badge variant="secondary">{property.propertyType}</Badge>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Bedrooms</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <ApperIcon name="Bed" className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Bathrooms</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <ApperIcon name="Bath" className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-semibold text-primary">Square Feet</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <ApperIcon name="Square" className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{property.squareFeet?.toLocaleString()}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-primary">Key Features</td>
              {properties.map(property => (
                <td key={property.Id} className="p-4">
                  <div className="space-y-1">
                    {property.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <ApperIcon name="Check" className="w-3 h-3 mr-1 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PropertyComparison