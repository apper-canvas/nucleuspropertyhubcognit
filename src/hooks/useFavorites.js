import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const FAVORITES_KEY = "propertyhub_favorites"

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY)
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setFavorites([])
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }, [favorites])

  const addToFavorites = (property) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.Id === property.Id)
      if (isAlreadyFavorite) {
        return prev
      }
      const newFavorites = [...prev, { ...property, favoriteDate: new Date().toISOString() }]
      toast.success("Added to favorites!", {
        position: "top-right",
        autoClose: 2000
      })
      return newFavorites
    })
  }

  const removeFromFavorites = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.Id !== propertyId)
      toast.info("Removed from favorites", {
        position: "top-right",
        autoClose: 2000
      })
      return newFavorites
    })
  }

  const toggleFavorite = (property) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.Id === property.Id)
    if (isCurrentlyFavorite) {
      removeFromFavorites(property.Id)
    } else {
      addToFavorites(property)
    }
  }

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.Id === propertyId)
  }

  const clearFavorites = () => {
    setFavorites([])
    toast.info("All favorites cleared", {
      position: "top-right",
      autoClose: 2000
    })
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }
}