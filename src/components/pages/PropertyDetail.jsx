import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { Card, CardContent } from "@/components/atoms/Card"
import ImageCarousel from "@/components/molecules/ImageCarousel"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { propertyService } from "@/services/api/propertyService"
import { useFavorites } from "@/hooks/useFavorites"
import { formatPrice, formatDate } from "@/utils/formatters"

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { isFavorite, toggleFavorite } = useFavorites()

  const loadProperty = async () => {
    try {
      setError(null)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      const data = await propertyService.getById(Number(id))
      if (data) {
        setProperty(data)
      } else {
        setError("Property not found.")
      }
    } catch (err) {
      setError("Failed to load property details. Please try again.")
      console.error("Error loading property:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperty()
  }, [id])

  const handleFavoriteToggle = () => {
    toggleFavorite(property)
    toast.success(
      isFavorite(property.Id) ? "Removed from favorites" : "Added to favorites",
      { position: "top-right" }
    )
  }

  const handleBack = () => {
    navigate(-1)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "Info" },
    { id: "features", label: "Features", icon: "Star" },
    { id: "location", label: "Location", icon: "MapPin" }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProperty} />
  if (!property) return <Error message="Property not found" onRetry={loadProperty} />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-primary hover:text-accent"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageCarousel
              images={property.images}
              title={property.title}
              className="h-96 lg:h-[500px]"
            />
          </motion.div>

          {/* Property Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {property.propertyType}
              </Badge>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-surface rounded-lg p-4 border border-gray-200">
                <ApperIcon name="Bed" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? "s" : ""}</div>
              </div>
              <div className="text-center bg-surface rounded-lg p-4 border border-gray-200">
                <ApperIcon name="Bath" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? "s" : ""}</div>
              </div>
              <div className="text-center bg-surface rounded-lg p-4 border border-gray-200">
                <ApperIcon name="Square" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-primary">
                  {property.squareFeet?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
              <div className="text-center bg-surface rounded-lg p-4 border border-gray-200">
                <ApperIcon name="Calendar" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-sm font-semibold text-primary">Listed</div>
                <div className="text-sm text-gray-600">{formatDate(property.listingDate)}</div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-accent text-accent"
                        : "border-transparent text-gray-500 hover:text-primary hover:border-gray-300"
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <Card>
              <CardContent className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{property.description}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-3">Property Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Property Type</span>
                          <span className="font-medium text-primary">{property.propertyType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Year Built</span>
                          <span className="font-medium text-primary">{property.yearBuilt || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Lot Size</span>
                          <span className="font-medium text-primary">{property.lotSize || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Parking</span>
                          <span className="font-medium text-primary">{property.parking || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Property Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features?.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <ApperIcon name="Check" className="w-5 h-5 text-success mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-3">Address</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">
                          {property.location.address}<br />
                          {property.location.city}, {property.location.state} {property.location.zipCode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-3">Neighborhood</h3>
                      <p className="text-gray-700">
                        {property.location.neighborhood || "Information not available"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold price-gradient bg-clip-text text-transparent mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <p className="text-gray-600">Listed {formatDate(property.listingDate)}</p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleFavoriteToggle}
                    variant={isFavorite(property.Id) ? "secondary" : "outline"}
                    className="w-full"
                  >
                    <ApperIcon 
                      name="Heart" 
                      className={`w-4 h-4 mr-2 ${isFavorite(property.Id) ? "fill-current" : ""}`}
                    />
                    {isFavorite(property.Id) ? "Saved to Favorites" : "Save to Favorites"}
                  </Button>

                  <Button className="w-full" size="lg">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    Contact Agent
                  </Button>

                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                    Schedule Tour
                  </Button>

                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Share" className="w-4 h-4 mr-2" />
                    Share Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail