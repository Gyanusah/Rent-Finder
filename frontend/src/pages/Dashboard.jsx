import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { propertyAPI } from "../services/apiService";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isOwner } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
  });

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await propertyAPI.getByOwner(user.id, { limit: 100 });
        setProperties(response.data.data);

        // Calculate stats
        let totalViews = 0;
        let totalInquiries = 0;
        response.data.data.forEach((prop) => {
          totalViews += prop.views || 0;
          totalInquiries += prop.inquiries?.length || 0;
        });

        setStats({
          totalProperties: response.data.data.length,
          totalViews,
          totalInquiries,
        });
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, isOwner, navigate]);

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await propertyAPI.delete(id);
        setProperties(properties.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <Link
            to="/dashboard/add-property"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">
              Total Properties
            </p>
            <p className="text-4xl font-bold text-primary mt-2">
              {stats.totalProperties}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Views</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.totalViews}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Inquiries</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {stats.totalInquiries}
            </p>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
          </div>

          {loading ? (
            <LoadingSkeletons />
          ) : properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <Link
                          to={`/property/${property._id}`}
                          className="text-primary hover:underline font-semibold truncate max-w-xs block"
                        >
                          {property.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {property.area}, {property.city}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ₹{property.rent}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {property.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {property.inquiries?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.availability?.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {property.availability?.available
                            ? "Available"
                            : "Rented"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                        <Link
                          to={`/dashboard/edit-property/${property._id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No properties yet</p>
              <Link
                to="/dashboard/add-property"
                className="text-primary font-semibold hover:underline mt-4 inline-block"
              >
                Add your first property
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
