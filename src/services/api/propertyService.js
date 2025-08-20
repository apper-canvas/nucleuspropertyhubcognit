import propertiesData from "@/services/mockData/properties.json";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Initialize ApperClient for database operations
const getApperClient = () => {
  if (typeof window !== 'undefined' && window.ApperSDK) {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }
  return null
}

export const propertyService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        // Fallback to mock data
        await delay(Math.random() * 300 + 200)
        return [...propertiesData]
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "location" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "squareFeet" } },
          { field: { Name: "propertyType" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "listingDate" } },
          { field: { Name: "yearBuilt" } },
          { field: { Name: "lotSize" } },
          { field: { Name: "parking" } }
        ],
        orderBy: [{ fieldName: "listingDate", sorttype: "DESC" }],
        pagingInfo: { limit: 50, offset: 0 }
      }

      const response = await apperClient.fetchRecords("Properties", params)
      
      if (!response.success) {
        console.error("Error fetching properties:", response.message)
        toast.error(response.message)
        // Fallback to mock data
        await delay(Math.random() * 300 + 200)
        return [...propertiesData]
      }

      return response.data || []
    } catch (error) {
      console.error("Error in propertyService.getAll:", error?.response?.data?.message || error.message)
      // Fallback to mock data
      await delay(Math.random() * 300 + 200)
      return [...propertiesData]
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        // Fallback to mock data
        await delay(Math.random() * 200 + 200)
        const property = propertiesData.find(p => p.Id === id)
        return property ? { ...property } : null
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "location" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "squareFeet" } },
          { field: { Name: "propertyType" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "listingDate" } },
          { field: { Name: "yearBuilt" } },
          { field: { Name: "lotSize" } },
          { field: { Name: "parking" } }
        ]
      }

      const response = await apperClient.getRecordById("Properties", id, params)
      
      if (!response || !response.data) {
        // Fallback to mock data
        await delay(Math.random() * 200 + 200)
        const property = propertiesData.find(p => p.Id === id)
        return property ? { ...property } : null
      }

      return response.data
    } catch (error) {
      console.error("Error in propertyService.getById:", error?.response?.data?.message || error.message)
      // Fallback to mock data
      await delay(Math.random() * 200 + 200)
      const property = propertiesData.find(p => p.Id === id)
      return property ? { ...property } : null
    }
  },

  async create(propertyData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        // Fallback to mock data
        await delay(300)
        const newId = Math.max(...propertiesData.map(p => p.Id)) + 1
        const newProperty = {
          ...propertyData,
          Id: newId,
          listingDate: new Date().toISOString().split('T')[0]
        }
        propertiesData.push(newProperty)
        toast.success("Property created successfully")
        return { ...newProperty }
      }

      const params = {
        records: [{
          title: propertyData.title,
          price: propertyData.price,
          location: propertyData.location,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          squareFeet: propertyData.squareFeet,
          propertyType: propertyData.propertyType,
          images: propertyData.images,
          description: propertyData.description,
          features: propertyData.features,
          yearBuilt: propertyData.yearBuilt,
          lotSize: propertyData.lotSize,
          parking: propertyData.parking
        }]
      }

      const response = await apperClient.createRecord("Properties", params)
      
      if (!response.success) {
        console.error("Error creating property:", response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} properties:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Property created successfully")
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error in propertyService.create:", error?.response?.data?.message || error.message)
      toast.error("Failed to create property")
      return null
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        // Fallback to mock data
        await delay(250)
        const index = propertiesData.findIndex(p => p.Id === id)
        if (index === -1) {
          throw new Error("Property not found")
        }
        propertiesData[index] = { ...propertiesData[index], ...updates }
        toast.success("Property updated successfully")
        return { ...propertiesData[index] }
      }

      const params = {
        records: [{
          Id: id,
          ...updates
        }]
      }

      const response = await apperClient.updateRecord("Properties", params)
      
      if (!response.success) {
        console.error("Error updating property:", response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} properties:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Property updated successfully")
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error in propertyService.update:", error?.response?.data?.message || error.message)
      toast.error("Failed to update property")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        // Fallback to mock data
        await delay(200)
        const index = propertiesData.findIndex(p => p.Id === id)
        if (index === -1) {
          throw new Error("Property not found")
        }
        const deletedProperty = propertiesData.splice(index, 1)[0]
        toast.success("Property deleted successfully")
        return { ...deletedProperty }
      }

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord("Properties", params)
      
      if (!response.success) {
        console.error("Error deleting property:", response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} properties:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Property deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error in propertyService.delete:", error?.response?.data?.message || error.message)
      toast.error("Failed to delete property")
      return false
    }
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