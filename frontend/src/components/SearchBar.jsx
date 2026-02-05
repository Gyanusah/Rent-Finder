import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [formData, setFormData] = useState({
    city: "",
    area: "",
    propertyType: "",
    minRent: "",
    maxRent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-4 md:p-8 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Mumbai"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g., Bandra"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="full_house">Full House</option>
            <option value="single_room">Single Room</option>
            <option value="shared_room">Shared Room</option>
            <option value="pg_room">PG Room</option>
          </select>
        </div>

        {/* Min Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rent
          </label>
          <input
            type="number"
            name="minRent"
            value={formData.minRent}
            onChange={handleChange}
            placeholder="₹5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
          />
        </div>

        {/* Max Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Rent
          </label>
          <input
            type="number"
            name="maxRent"
            value={formData.maxRent}
            onChange={handleChange}
            placeholder="₹50000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto mt-4 bg-primary text-white px-8 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
      >
        Search
      </button>
    </form>
  );
}
