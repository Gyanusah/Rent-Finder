

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
    const params = {
      ...Object.fromEntries(searchParams),
      ...filterData,
      page: 1,
    };

    fetchProperties(params);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 HERO SECTION */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Search Properties
          </h1>
          <p className="text-gray-200 mb-8">
            Find the best rooms, flats, and houses
          </p>

          {/* 💎 Glass Search */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-4 sticky top-4">
              <FilterSidebar onFilter={handleFilter} />
            </div>
          </div>

          {/* Properties */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSkeletons />
            ) : properties.length > 0 ? (
              <>
                {/* Result Count */}
                <div className="mb-4">
                  <p className="text-gray-700">
                    Found <span className="font-bold">{properties.length}</span>{" "}
                    properties
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 flex-wrap">
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
              <div className="text-center py-12 bg-white rounded-lg shadow">
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

