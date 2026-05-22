

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
      <div className="group relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* IMAGE SECTION */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {property.propertyType?.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            disabled={loading}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:scale-110 transition"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>

          {/* Image count */}
          {imageCount > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
              📷 {imageCount}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-3">
          {/* TITLE */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {property.title}
          </h3>

          {/* LOCATION */}
          <p className="text-sm text-gray-600">
            📍 {property.area}, {property.city}
          </p>

          {/* PRICE CARD */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-2">
              <p className="text-gray-500 text-xs">Rent</p>
              <p className="font-bold text-gray-900">₹{property.rent}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-2">
              <p className="text-gray-500 text-xs">Deposit</p>
              <p className="font-bold text-gray-900">₹{property.deposit}</p>
            </div>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            {property.amenities?.wifi && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                📶 WiFi
              </span>
            )}
            {property.amenities?.ac && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                ❄️ AC
              </span>
            )}
            {property.amenities?.parking && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                🚗 Parking
              </span>
            )}
          </div>

          {/* OWNER */}
          {property.owner && (
            <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">
                {property.owner.name}
              </p>
              <p>📞 {property.owner.phone || "N/A"}</p>
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
}