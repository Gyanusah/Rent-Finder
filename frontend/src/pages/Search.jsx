import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyAPI } from "../services/apiService";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchProperties = async (params) => {
    setLoading(true);
    try {
      const response = await propertyAPI.getAll(params);
      setProperties(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {
      ...Object.fromEntries(searchParams),
      page,
      limit: 12,
    };
    fetchProperties(params);
  }, [searchParams, page]);

  const handleSearch = (formData) => {
    const newParams = new URLSearchParams();
    if (formData.city) newParams.append("city", formData.city);
    if (formData.area) newParams.append("area", formData.area);
    if (formData.propertyType)
      newParams.append("propertyType", formData.propertyType);
    if (formData.minRent) newParams.append("minRent", formData.minRent);
    if (formData.maxRent) newParams.append("maxRent", formData.maxRent);

    setSearchParams(newParams);
    setPage(1);
  };

  const handleFilter = (filterData) => {
    setFilters(filterData);
    const params = {
      ...Object.fromEntries(searchParams),
      ...filterData,
      page: 1,
    };
    if (filterData.furnishing) {
      params.furnishing = filterData.furnishing;
    }
    if (filterData.amenities && filterData.amenities.length > 0) {
      params.amenities = filterData.amenities;
    }
    fetchProperties(params);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar onFilter={handleFilter} />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSkeletons />
            ) : properties.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-700">
                    Found <span className="font-bold">{properties.length}</span>{" "}
                    properties
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded ${
                          page === i + 1
                            ? "bg-primary text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-xl">No properties found</p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
