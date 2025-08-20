import propertiesData from "@/services/mockData/properties.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const propertyService = {
  async getAll() {
    await delay(Math.random() * 300 + 200)
    return [...propertiesData]
  },

  async getById(id) {
    await delay(Math.random() * 200 + 200)
    const property = propertiesData.find(p => p.Id === id)
    return property ? { ...property } : null
  },

  async create(propertyData) {
    await delay(300)
    const newId = Math.max(...propertiesData.map(p => p.Id)) + 1
    const newProperty = {
      ...propertyData,
      Id: newId,
      listingDate: new Date().toISOString()
    }
    propertiesData.push(newProperty)
    return { ...newProperty }
  },

  async update(id, updates) {
    await delay(250)
    const index = propertiesData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Property not found")
    }
    propertiesData[index] = { ...propertiesData[index], ...updates }
    return { ...propertiesData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = propertiesData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Property not found")
    }
    const deletedProperty = propertiesData.splice(index, 1)[0]
    return { ...deletedProperty }
  },

  async searchByLocation(location) {
    await delay(Math.random() * 400 + 200)
    const searchTerm = location.toLowerCase()
    return propertiesData.filter(property =>
      property.location.city.toLowerCase().includes(searchTerm) ||
      property.location.state.toLowerCase().includes(searchTerm) ||
      property.location.neighborhood?.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }))
  },

  async filterByPriceRange(minPrice, maxPrice) {
    await delay(Math.random() * 300 + 200)
    return propertiesData.filter(property => {
      const price = property.price
      const meetsMin = minPrice ? price >= minPrice : true
      const meetsMax = maxPrice ? price <= maxPrice : true
      return meetsMin && meetsMax
    }).map(p => ({ ...p }))
  },

  async filterByPropertyType(propertyType) {
    await delay(Math.random() * 200 + 200)
    return propertiesData.filter(property =>
      property.propertyType.toLowerCase() === propertyType.toLowerCase()
    ).map(p => ({ ...p }))
  },

  async searchProperties(searchQuery, filters = {}) {
    await delay(Math.random() * 400 + 200)
    let results = [...propertiesData]

    // Text search
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      results = results.filter(property =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.location.city.toLowerCase().includes(searchTerm) ||
        property.location.state.toLowerCase().includes(searchTerm) ||
        property.location.neighborhood?.toLowerCase().includes(searchTerm) ||
        property.propertyType.toLowerCase().includes(searchTerm) ||
        property.features?.some(feature => feature.toLowerCase().includes(searchTerm))
      )
    }

    // Apply filters
    if (filters.priceMin) {
      results = results.filter(p => p.price >= filters.priceMin)
    }
    if (filters.priceMax) {
      results = results.filter(p => p.price <= filters.priceMax)
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(p => filters.propertyTypes.includes(p.propertyType))
    }
    if (filters.bedrooms) {
      if (filters.bedrooms === "5+") {
        results = results.filter(p => p.bedrooms >= 5)
      } else {
        results = results.filter(p => p.bedrooms === filters.bedrooms)
      }
    }
    if (filters.bathrooms) {
      if (filters.bathrooms === "5+") {
        results = results.filter(p => p.bathrooms >= 5)
      } else {
        results = results.filter(p => p.bathrooms === filters.bathrooms)
      }
    }

    return results.map(p => ({ ...p }))
  }
}