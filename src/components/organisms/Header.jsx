import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Favorites from "@/components/pages/Favorites";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
const navigate = useNavigate()
  const { favorites } = useFavorites()
  const { user, logout } = useContext(AuthContext)

  const isActive = (path) => location.pathname === path

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="Home" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors duration-200">
              PropertyHub
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`font-medium transition-all duration-200 hover:text-accent ${
                isActive("/") ? "text-accent" : "text-primary"
              }`}
            >
              Browse
            </Link>
            <Link
              to="/leases"
              className={`font-medium transition-all duration-200 hover:text-accent ${
                isActive("/leases") ? "text-accent" : "text-primary"
              }`}
            >
              Leases
            </Link>
            <Link
              to="/favorites"
              className={`font-medium transition-all duration-200 hover:text-accent flex items-center ${
                isActive("/favorites") ? "text-accent" : "text-primary"
              }`}
            >
              <ApperIcon name="Heart" className="w-4 h-4 mr-1" />
              Favorites
              {favorites.length > 0 && (
                <span className="ml-1 bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="ml-4"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6" 
            />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-4 border-t border-gray-100">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
<motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
<nav className="space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block font-medium transition-all duration-200 hover:text-accent ${
                  isActive("/") ? "text-accent" : "text-primary"
                }`}
              >
                Browse Properties
              </Link>
              <Link
                to="/leases"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block font-medium transition-all duration-200 hover:text-accent ${
                  isActive("/leases") ? "text-accent" : "text-primary"
                }`}
              >
                Lease Management
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block font-medium transition-all duration-200 hover:text-accent flex items-center ${
                  isActive("/favorites") ? "text-accent" : "text-primary"
                }`}
              >
                <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-2 bg-secondary text-white text-xs rounded-full px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full justify-start"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header