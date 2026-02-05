import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { favoriteAPI } from "../services/apiService";
import PropertyCard from "../components/PropertyCard";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function Wishlist() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await favoriteAPI.getAll({ limit: 100 });
        setFavorites(response.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await favoriteAPI.remove(propertyId);
      setFavorites(favorites.filter((fav) => fav.property._id !== propertyId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">
            Please login to view your wishlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          My Wishlist ❤️
        </h1>

        {loading ? (
          <LoadingSkeletons />
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite._id} className="relative">
                <PropertyCard property={favorite.property} />
                <button
                  onClick={() => handleRemoveFavorite(favorite.property._id)}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-xl">Your wishlist is empty</p>
            <p className="text-gray-500 mt-2">
              Add properties to your wishlist to save them for later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
