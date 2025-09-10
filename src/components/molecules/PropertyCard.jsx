import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { formatDate, formatPrice } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const PropertyCard = ({ property, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(property.Id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group ${className}`}
    >
      <Link 
        to={`/property/${property.Id}`}
        className="block bg-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden card-hover"
      >
        {/* Image Container */}
<div className="relative h-64 overflow-hidden">
          <div className={`image-fade-in ${imageLoaded ? "loaded" : ""}`}>
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Image Overlay */}
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-200 ${
              favorite ? "text-error" : "text-gray-600 hover:text-error"
            }`}
          >
            <ApperIcon 
              name={favorite ? "Heart" : "Heart"} 
              className={`w-5 h-5 transition-all duration-200 ${
                favorite ? "fill-current heart-animate" : ""
              }`}
            />
          </Button>

{/* Property Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 price-gradient text-white font-semibold"
          >
            {property.leaseAmount && property.leaseAmount > 0 ? 'For Lease' : property.propertyType}
          </Badge>

<div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-sm backdrop-blur-sm">
            <ApperIcon name="Camera" className="w-4 h-4 inline mr-1" />
            {property.images?.length || 0}
          </div>
        </div>

        {/* Content */}
<div className="p-6">
          {/* Price or Lease Amount */}
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-primary mb-1 price-gradient bg-clip-text text-transparent">
              {property.leaseAmount && property.leaseAmount > 0 
                ? `$${property.leaseAmount.toLocaleString()}/month`
                : formatPrice(property.price)}
            </h3>
            <p className="text-sm text-gray-600">Listed {formatDate(property.listingDate)}</p>
          </div>

          {/* Title */}
          <h4 className="font-display text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {property.title}
          </h4>

{/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {property.location?.city}, {property.location?.state}
            </span>
          </div>
          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard