export const formatPrice = (price) => {
  if (typeof price !== "number") return "Price not available"
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (dateString) => {
  if (!dateString) return "Date not available"
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date not available"
  }
}

export const formatSquareFeet = (sqft) => {
  if (typeof sqft !== "number") return "N/A"
  return sqft.toLocaleString()
}

export const formatBedsBaths = (beds, baths) => {
  const bedText = beds === 1 ? "bed" : "beds"
  const bathText = baths === 1 ? "bath" : "baths"
  return `${beds} ${bedText}, ${baths} ${bathText}`
}