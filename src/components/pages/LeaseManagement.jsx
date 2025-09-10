import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { propertyService } from "@/services/api/propertyService";
import { formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const LeaseManagement = () => {
  const [properties, setProperties] = useState([]);
  const [leaseProperties, setLeaseProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
      
      // Filter properties that have lease information
      const leases = data.filter(property => property.leaseAmount && property.leaseAmount > 0);
      setLeaseProperties(leases);
    } catch (err) {
      setError("Failed to load lease properties. Please try again.");
      console.error("Error loading lease properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const formatLeaseAmount = (amount) => {
    if (typeof amount !== "number") return "Amount not available";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + "/month";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Lease Management</h1>
          <p className="text-gray-600">Manage your rental properties and lease agreements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent/10 rounded-full mr-4">
                <ApperIcon name="Home" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">{leaseProperties.length}</h3>
                <p className="text-gray-600">Active Leases</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-success/10 rounded-full mr-4">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {leaseProperties.reduce((total, prop) => total + (prop.leaseAmount || 0), 0).toLocaleString()}
                </h3>
                <p className="text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-warning/10 rounded-full mr-4">
                <ApperIcon name="Calendar" className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {leaseProperties.filter(prop => {
                    if (!prop.leaseEndDate) return false;
                    const endDate = new Date(prop.leaseEndDate);
                    const threeMonthsFromNow = new Date();
                    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                    return endDate <= threeMonthsFromNow;
                  }).length}
                </h3>
                <p className="text-gray-600">Expiring Soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lease Properties List */}
        {leaseProperties.length === 0 ? (
          <Empty 
            message="No lease properties found"
            description="Properties with lease information will appear here"
          />
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-primary">Active Lease Properties</h2>
            <div className="grid gap-6">
              {leaseProperties.map((property) => (
                <motion.div
                  key={property.Id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-primary mb-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                              <span>
                                {property.location?.address}, {property.location?.city}, {property.location?.state}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            For Lease
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Monthly Rent</p>
                            <p className="text-xl font-bold text-primary">
                              {formatLeaseAmount(property.leaseAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Lease End Date</p>
                            <p className="font-semibold text-primary">
                              {property.leaseEndDate ? formatDate(property.leaseEndDate) : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Property Type</p>
                            <p className="font-semibold text-primary">
                              {property.propertyType}
                            </p>
                          </div>
                        </div>

                        {property.leaseEndDate && (
                          <div className="mb-4">
                            {(() => {
                              const endDate = new Date(property.leaseEndDate);
                              const today = new Date();
                              const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                              
                              if (daysUntilEnd < 0) {
                                return (
                                  <Badge variant="secondary" className="bg-error/10 text-error">
                                    <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
                                    Lease Expired
                                  </Badge>
                                );
                              } else if (daysUntilEnd <= 30) {
                                return (
                                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                                    <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                                    Expires in {daysUntilEnd} days
                                  </Badge>
                                );
                              } else if (daysUntilEnd <= 90) {
                                return (
                                  <Badge variant="secondary" className="bg-info/10 text-info">
                                    <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                                    Expires in {Math.ceil(daysUntilEnd / 30)} months
                                  </Badge>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 lg:ml-6 mt-4 lg:mt-0">
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                          Edit Lease
                        </Button>
                        <Button variant="outline" size="sm">
                          <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaseManagement;