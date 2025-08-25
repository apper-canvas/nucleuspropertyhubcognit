import { toast } from "react-toastify"

// Utility function to add delay for realistic loading experience
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

// Mock data storage key
const STORAGE_KEY = 'propertyHub_properties'

// Initialize mock data from JSON file
const initializeMockData = async () => {
  try {
    // Try to get data from localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // If no stored data, load default mock data
    const defaultData = await import('@/services/mockData/properties.json')
    const properties = defaultData.default || defaultData
    
    // Store in localStorage for persistence
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
    return properties
  } catch (error) {
    console.error('Error loading mock data:', error)
    return []
  }
}

// Save mock data to localStorage
const saveMockData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving mock data:', error)
  }
}

// Check if we should use mock service (when database is unavailable)
const shouldUseMockService = async () => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) return true
    
    // Try a simple test query to check if database table exists
    const testParams = {
      fields: [{ field: { Name: "Id" } }],
      pagingInfo: { limit: 1, offset: 0 }
    }
    
    const testResponse = await apperClient.fetchRecords("property_c", testParams)
    return !testResponse.success
  } catch (error) {
    return true
  }
}

// Mock service implementation
const mockService = {
  async getAll() {
    await delay(300)
    const data = await initializeMockData()
    return [...data] // Return copy to prevent mutations
  },

  async getById(id) {
    await delay(250)
    const data = await initializeMockData()
    const property = data.find(p => p.Id === parseInt(id))
    return property ? { ...property } : null
  },

  async create(propertyData) {
    await delay(400)
    const data = await initializeMockData()
    
    const newProperty = {
      ...propertyData,
      Id: Math.max(...data.map(p => p.Id), 0) + 1,
      listingDate: new Date().toISOString().split('T')[0]
    }
    
    const updatedData = [...data, newProperty]
    saveMockData(updatedData)
    
    toast.success("Property created successfully")
    return { ...newProperty }
  },

  async update(id, updates) {
    await delay(350)
    const data = await initializeMockData()
    
    const index = data.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      toast.error("Property not found")
      return null
    }
    
    const updatedProperty = { ...data[index], ...updates }
    const updatedData = [...data]
    updatedData[index] = updatedProperty
    
    saveMockData(updatedData)
    
    toast.success("Property updated successfully")
    return { ...updatedProperty }
  },

  async delete(id) {
    await delay(300)
    const data = await initializeMockData()
    
    const filteredData = data.filter(p => p.Id !== parseInt(id))
    if (filteredData.length === data.length) {
      toast.error("Property not found")
      return false
    }
    
    saveMockData(filteredData)
    
    toast.success("Property deleted successfully")
    return true
  }
}

// Transform database record to UI format
const transformDatabaseToUI = (record) => {
  if (!record) return null
  
  return {
    Id: record.Id,
    title: record.title_c || record.Name,
    price: record.price_c,
    location: {
      address: record.location_address_c,
      city: record.location_city_c,
      state: record.location_state_c,
      zipCode: record.location_zip_code_c,
      neighborhood: record.location_neighborhood_c
    },
    bedrooms: record.bedrooms_c,
    bathrooms: record.bathrooms_c,
    squareFeet: record.square_feet_c,
    propertyType: record.property_type_c,
    images: record.images_c ? (typeof record.images_c === 'string' ? record.images_c.split('\n').filter(img => img.trim()) : record.images_c) : [],
    description: record.description_c,
    features: record.features_c ? (typeof record.features_c === 'string' ? record.features_c.split('\n').filter(feature => feature.trim()) : record.features_c) : [],
    listingDate: record.listing_date_c,
    yearBuilt: record.year_built_c,
    lotSize: record.lot_size_c,
    parking: record.parking_c
  }
}

// Transform UI data to database format (only updateable fields)
const transformUIToDatabase = (data) => {
  const record = {}
  
  if (data.title !== undefined) record.title_c = data.title
  if (data.price !== undefined) record.price_c = data.price
  if (data.location !== undefined) {
    if (data.location.address !== undefined) record.location_address_c = data.location.address
    if (data.location.city !== undefined) record.location_city_c = data.location.city
    if (data.location.state !== undefined) record.location_state_c = data.location.state
    if (data.location.zipCode !== undefined) record.location_zip_code_c = data.location.zipCode
    if (data.location.neighborhood !== undefined) record.location_neighborhood_c = data.location.neighborhood
  }
  if (data.bedrooms !== undefined) record.bedrooms_c = data.bedrooms
  if (data.bathrooms !== undefined) record.bathrooms_c = data.bathrooms
  if (data.squareFeet !== undefined) record.square_feet_c = data.squareFeet
  if (data.propertyType !== undefined) record.property_type_c = data.propertyType
  if (data.images !== undefined) record.images_c = Array.isArray(data.images) ? data.images.join('\n') : data.images
  if (data.description !== undefined) record.description_c = data.description
  if (data.features !== undefined) record.features_c = Array.isArray(data.features) ? data.features.join('\n') : data.features
  if (data.listingDate !== undefined) record.listing_date_c = data.listingDate
  if (data.yearBuilt !== undefined) record.year_built_c = data.yearBuilt
  if (data.lotSize !== undefined) record.lot_size_c = data.lotSize
  if (data.parking !== undefined) record.parking_c = data.parking
  
  return record
}

// Database service implementation
const databaseService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not available")
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "location_address_c" } },
          { field: { Name: "location_city_c" } },
          { field: { Name: "location_state_c" } },
          { field: { Name: "location_zip_code_c" } },
          { field: { Name: "location_neighborhood_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "lot_size_c" } },
          { field: { Name: "parking_c" } }
        ],
        orderBy: [{ fieldName: "listing_date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 50, offset: 0 }
      }

      const response = await apperClient.fetchRecords("property_c", params)
      
      if (!response.success) {
        console.error("Error fetching properties:", response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(transformDatabaseToUI)
    } catch (error) {
      console.error("Error in propertyService.getAll:", error?.response?.data?.message || error.message)
      throw error
    }
  },
async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not available")
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "location_address_c" } },
          { field: { Name: "location_city_c" } },
          { field: { Name: "location_state_c" } },
          { field: { Name: "location_zip_code_c" } },
          { field: { Name: "location_neighborhood_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "lot_size_c" } },
          { field: { Name: "parking_c" } }
        ]
      }

      const response = await apperClient.getRecordById("property_c", id, params)
      
      if (!response || !response.data) {
        return null
      }

      return transformDatabaseToUI(response.data)
    } catch (error) {
      console.error("Error in propertyService.getById:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async create(propertyData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not available")
      }

      const dbRecord = transformUIToDatabase(propertyData)
      const params = {
        records: [dbRecord]
      }

      const response = await apperClient.createRecord("property_c", params)
      
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
          return transformDatabaseToUI(successfulRecords[0].data)
        }
      }

      return null
    } catch (error) {
      console.error("Error in propertyService.create:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not available")
      }

      const dbUpdates = transformUIToDatabase(updates)
      const params = {
        records: [{
          Id: id,
          ...dbUpdates
        }]
      }

      const response = await apperClient.updateRecord("property_c", params)
      
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
          return transformDatabaseToUI(successfulUpdates[0].data)
        }
      }

      return null
    } catch (error) {
      console.error("Error in propertyService.update:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not available")
      }

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord("property_c", params)
      
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
      throw error
    }
  }
}

// Main service export - intelligently chooses between database and mock service
export const propertyService = {
  async getAll() {
    try {
      const useMock = await shouldUseMockService()
      if (useMock) {
        return await mockService.getAll()
      }
      return await databaseService.getAll()
    } catch (error) {
      console.error("Error in propertyService.getAll:", error?.response?.data?.message || error.message)
      // Fallback to mock service on any error
      try {
        return await mockService.getAll()
      } catch (mockError) {
        toast.error("Failed to load properties")
        return []
      }
    }
  },

  async getById(id) {
    try {
      const useMock = await shouldUseMockService()
      if (useMock) {
        return await mockService.getById(id)
      }
      return await databaseService.getById(id)
    } catch (error) {
      console.error("Error in propertyService.getById:", error?.response?.data?.message || error.message)
      // Fallback to mock service on any error
      try {
        return await mockService.getById(id)
      } catch (mockError) {
        return null
      }
    }
  },

  async create(propertyData) {
    try {
      const useMock = await shouldUseMockService()
      if (useMock) {
        return await mockService.create(propertyData)
      }
      return await databaseService.create(propertyData)
    } catch (error) {
      console.error("Error in propertyService.create:", error?.response?.data?.message || error.message)
      // Fallback to mock service on any error
      try {
        return await mockService.create(propertyData)
      } catch (mockError) {
        toast.error("Failed to create property")
        return null
      }
    }
  },

  async update(id, updates) {
    try {
      const useMock = await shouldUseMockService()
      if (useMock) {
        return await mockService.update(id, updates)
      }
      return await databaseService.update(id, updates)
    } catch (error) {
      console.error("Error in propertyService.update:", error?.response?.data?.message || error.message)
      // Fallback to mock service on any error
      try {
        return await mockService.update(id, updates)
      } catch (mockError) {
        toast.error("Failed to update property")
        return null
      }
    }
  },

  async delete(id) {
    try {
      const useMock = await shouldUseMockService()
      if (useMock) {
        return await mockService.delete(id)
      }
      return await databaseService.delete(id)
    } catch (error) {
      console.error("Error in propertyService.delete:", error?.response?.data?.message || error.message)
      // Fallback to mock service on any error
      try {
        return await mockService.delete(id)
      } catch (mockError) {
        toast.error("Failed to delete property")
        return false
      }
    }
  }
}