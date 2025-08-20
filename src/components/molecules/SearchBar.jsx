import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search by location, property type...", className = "" }) => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-12 h-12 text-base bg-white shadow-sm border-gray-300 focus:border-accent focus:ring-accent"
        />
        <Button 
          type="submit"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-accent hover:bg-accent/90"
        >
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

export default SearchBar