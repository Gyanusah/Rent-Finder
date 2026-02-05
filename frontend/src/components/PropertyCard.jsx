import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { favoriteAPI, getImageUrl } from "../services/apiService";

export default function PropertyCard({ property, onFavoriteChange }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    // e.stopPropagation();// this will be changed
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteAPI.remove(property._id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.add(property._id);
        setIsFavorite(true);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  const primaryImage = getImageUrl(property.images?.[0]?.url);
  const imageCount = property.images?.length || 0;

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full">
        {/* Image Section */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />

          {/* Image Count Badge */}
          {imageCount > 0 && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📷 {imageCount} photo{imageCount > 1 ? "s" : ""}
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <button
              onClick={handleFavorite}
              disabled={loading}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {property.propertyType.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-2 mb-2">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3">
            📍 {property.area}, {property.city}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="text-gray-700">
              <span className="font-semibold">Rent:</span> ₹{property.rent}
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Deposit:</span> ₹
              {property.deposit}
            </div>
            {property.roomCount && (
              <div className="text-gray-700">
                <span className="font-semibold">Rooms:</span>{" "}
                {property.roomCount}
              </div>
            )}
            {property.roomType && (
              <div className="text-gray-700">
                <span className="font-semibold">Type:</span> {property.roomType}
              </div>
            )}
          </div>

          {/* Amenities Icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities?.wifi && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                📶 WiFi
              </span>
            )}
            {property.amenities?.ac && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                ❄️ AC
              </span>
            )}
            {property.amenities?.parking && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                🚗 Parking
              </span>
            )}
          </div>

          {/* Owner Info */}
          {property.owner && (
            <div className="text-sm text-gray-600 pb-3 border-t pt-3">
              <p className="font-semibold">{property.owner.name}</p>
              <p>📞 {property.owner.phone || "N/A"}</p>
            </div>
          )}

          {/* View Details Button */}
          <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
