import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { propertyAPI } from "../services/apiService";

export default function PropertyForm() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { isOwner } = useAuth();
  const [loading, setLoading] = useState(!!propertyId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    area: "",
    pincode: "",
    rent: "",
    deposit: "",
    maintenance: "",
    propertyType: "full_house",
    roomType: "",
    roomCount: "",
    furnishing: "semi-furnished",
    balcony: false,
    familyAllowed: true,
    bachelorAllowed: true,
    amenities: {},
    rules: {},
    bathrooms: { total: 1, attached: 1, common: 0 },
    floor: { current: 1, total: 1 },
    roomSize: { value: 500, unit: "sqft" },
    images: [],
  });

  useEffect(() => {
    if (propertyId && !isOwner) {
      navigate("/");
      return;
    }

    if (propertyId) {
      const fetchProperty = async () => {
        try {
          const response = await propertyAPI.getById(propertyId);
          setFormData(response.data.data);
        } catch (error) {
          console.error("Error fetching property:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [propertyId, isOwner, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: isNaN(newValue) ? newValue : Number(newValue),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleRuleChange = (rule) => {
    setFormData((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [rule]: !prev.rules[rule],
      },
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Property title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Property description is required");
      }
      if (!formData.address.trim()) {
        throw new Error("Property address is required");
      }
      if (!formData.city.trim()) {
        throw new Error("City is required");
      }
      if (!formData.area.trim()) {
        throw new Error("Area/Locality is required");
      }
      if (!formData.rent) {
        throw new Error("Rent amount is required");
      }
      if (!formData.deposit) {
        throw new Error("Security deposit is required");
      }

      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          if (typeof formData[key] === "object") {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add images - only add File objects, skip existing URLs
      let imageCount = 0;
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, idx) => {
          if (image instanceof File) {
            console.log(`Adding image ${idx}:`, image.name, image.size);
            formDataToSend.append("images", image);
            imageCount++;
          }
        });
      }

      console.log(`Total images to upload: ${imageCount}`);

      let result;
      if (propertyId) {
        result = await propertyAPI.update(propertyId, formDataToSend);
      } else {
        result = await propertyAPI.create(formDataToSend);
      }

      setSuccess(
        "Property " + (propertyId ? "updated" : "created") + " successfully!",
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error submitting form. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {propertyId ? "Edit Property" : "Add New Property"}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 space-y-8"
        >
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="full_house">Full House</option>
                  <option value="single_room">Single Room</option>
                  <option value="shared_room">Shared Room</option>
                  <option value="pg_room">PG Room</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Area/Locality
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="\d{6}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Maintenance (₹)
                </label>
                <input
                  type="number"
                  name="maintenance"
                  value={formData.maintenance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Room Type</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="Studio">Studio</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Furnishing
                </label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Room Count
                </label>
                <input
                  type="number"
                  name="roomCount"
                  value={formData.roomCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Room Size (sqft)
                </label>
                <input
                  type="number"
                  name="roomSize.value"
                  value={formData.roomSize.value}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Bathrooms */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bathrooms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total
                  </label>
                  <input
                    type="number"
                    name="bathrooms.total"
                    value={formData.bathrooms.total}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Attached
                  </label>
                  <input
                    type="number"
                    name="bathrooms.attached"
                    value={formData.bathrooms.attached}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Common
                  </label>
                  <input
                    type="number"
                    name="bathrooms.common"
                    value={formData.bathrooms.common}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Floor */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Floor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Current Floor
                  </label>
                  <input
                    type="number"
                    name="floor.current"
                    value={formData.floor.current}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    name="floor.total"
                    value={formData.floor.total}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "wifi",
                "ac",
                "parking",
                "powerBackup",
                "waterSupply",
                "lift",
                "gym",
              ].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities[amenity] || false}
                    onChange={() => handleAmenityChange(amenity)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 capitalize">
                    {amenity.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              House Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["smoking", "drinking", "pets"].map((rule) => (
                <label key={rule} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rules[rule] || false}
                    onChange={() => handleRuleChange(rule)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 capitalize">{rule}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Resident Type */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Resident Eligibility
            </h2>
            <div className="flex items-center space-x-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="familyAllowed"
                  checked={formData.familyAllowed}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Family Allowed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bachelorAllowed"
                  checked={formData.bachelorAllowed}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Bachelor Allowed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Has Balcony</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Images</h2>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-700 font-semibold mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-600 text-sm">
                  PNG, JPG, GIF up to 10MB each (up to 10 images)
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Selected Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, idx) => {
                    const imageUrl =
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : image.url;

                    return (
                      <div key={idx} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter(
                              (_, i) => i !== idx,
                            );
                            setFormData((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ✕
                        </button>
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          {image instanceof File
                            ? image.name
                            : `Image ${idx + 1}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : propertyId
                  ? "Update Property"
                  : "Add Property"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
