import React, { useState } from "react";

export default function FilterSidebar({ onFilter }) {
  const [filters, setFilters] = useState({
    furnishing: "",
    familyAllowed: false,
    bachelorAllowed: false,
    amenities: [],
  });

  const handleFurnishingChange = (value) => {
    const newFilters = { ...filters, furnishing: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleAmenityChange = (amenity) => {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];

    const newFilters = { ...filters, amenities };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleResidentTypeChange = (type) => {
    const newFilters = {
      ...filters,
      [type]: !filters[type],
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filterData) => {
    const filterPayload = {
      furnishing: filterData.furnishing || undefined,
      amenities:
        filterData.amenities.length > 0 ? filterData.amenities : undefined,
      familyAllowed: filterData.familyAllowed || undefined,
      bachelorAllowed: filterData.bachelorAllowed || undefined,
    };
    onFilter(filterPayload);
  };

  const resetFilters = () => {
    const newFilters = {
      furnishing: "",
      familyAllowed: false,
      bachelorAllowed: false,
      amenities: [],
    };
    setFilters(newFilters);
    onFilter({
      furnishing: undefined,
      amenities: undefined,
      familyAllowed: undefined,
      bachelorAllowed: undefined,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6 h-fit sticky top-20">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>

      {/* Furnishing */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Furnishing</h4>
        <div className="space-y-2">
          {["furnished", "semi-furnished", "unfurnished"].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="furnishing"
                value={type}
                checked={filters.furnishing === type}
                onChange={(e) => handleFurnishingChange(e.target.value)}
                className="mr-2 cursor-pointer"
              />
              <span className="text-gray-700 capitalize">
                {type.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Amenities</h4>
        <div className="space-y-2">
          {[
            { name: "wifi", label: "📶 WiFi" },
            { name: "ac", label: "❄️ Air Conditioning" },
            { name: "parking", label: "🚗 Parking" },
            { name: "powerBackup", label: "🔌 Power Backup" },
            { name: "waterSupply", label: "💧 Water Supply" },
            { name: "lift", label: "🛗 Lift" },
            { name: "gym", label: "💪 Gym" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(name)}
                onChange={() => handleAmenityChange(name)}
                className="mr-2 cursor-pointer"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Resident Type */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Resident Type</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.familyAllowed}
              onChange={() => handleResidentTypeChange("familyAllowed")}
              className="mr-2 cursor-pointer"
            />
            <span className="text-gray-700">Family Allowed</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.bachelorAllowed}
              onChange={() => handleResidentTypeChange("bachelorAllowed")}
              className="mr-2 cursor-pointer"
            />
            <span className="text-gray-700">Bachelor Allowed</span>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition font-semibold"
      >
        Reset Filters
      </button>
    </div>
  );
}
