import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const ImageCarousel = ({ images, title, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setImageLoaded(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageLoaded(false)
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
    setImageLoaded(false)
  }

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <ApperIcon name="ImageOff" className="w-16 h-16 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className={`image-fade-in ${imageLoaded ? "loaded" : ""}`}>
              <img
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-primary"
            >
              <ApperIcon name="ChevronLeft" className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-primary"
            >
              <ApperIcon name="ChevronRight" className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-secondary shadow-md"
                  : "border-gray-200 hover:border-accent"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel