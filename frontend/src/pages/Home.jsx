import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../services/apiService";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertyAPI.getAll({ limit: 6 });
        setProperties(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = (formData) => {
    const params = new URLSearchParams();
    if (formData.city) params.append("city", formData.city);
    if (formData.area) params.append("area", formData.area);
    if (formData.propertyType)
      params.append("propertyType", formData.propertyType);
    if (formData.minRent) params.append("minRent", formData.minRent);
    if (formData.maxRent) params.append("maxRent", formData.maxRent);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-primary to-blue-800 text-white py-12 md:py-20 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37, 99, 235, 0.9), rgba(30, 58, 138, 0.9))",
        }}
      >
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-blue-100">
            Search for rooms, flats, and houses near you
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Featured Properties
        </h2>

        {loading ? (
          <LoadingSkeletons />
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">No properties available</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/search")}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
          >
            View All Properties
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why Choose RentFinder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Verified Listings
              </h3>
              <p className="text-gray-600">
                All properties are verified and authentic
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy Communication
              </h3>
              <p className="text-gray-600">
                Direct contact with property owners
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600">Your information is protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
