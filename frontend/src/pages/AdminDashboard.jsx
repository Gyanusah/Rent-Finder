import React, { useEffect, useState } from "react";
import { propertyAPI, authAPI } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ properties: 0, users: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch properties
        const propsRes = await propertyAPI.getAll({ limit: 100 });
        const propertiesData = propsRes?.data?.data || [];
        
        // Fetch users
        const usersRes = await authAPI.getAllUsers();
        const usersData = usersRes?.data?.data || [];
        
        // Filter owners from users
        const ownersData = usersData.filter(user => user.role === 'owner');

        setStats({
          properties: propertiesData.length,
          users: usersData.length,
          inquiries: 0,
        });

        setUsers(usersData);
        setProperties(propertiesData);
        setOwners(ownersData);
      } catch (err) {
        console.error("Error loading admin stats:", err);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-medium">
                  Total Properties
                </p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.properties}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {stats.users}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm font-medium">
                  Total Inquiries
                </p>
                <p className="text-4xl font-bold text-orange-600 mt-2">
                  {stats.inquiries}
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
              </div>

              {users.length === 0 ? (
                <p className="text-gray-600 p-6">No users available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Phone
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-gray-800">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                u.role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : u.role === "owner"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {u.phone || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">All Properties</h2>
              </div>

              {properties.length === 0 ? (
                <p className="text-gray-600 p-6">No properties available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Rent
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr
                          key={property._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-gray-800 font-medium">{property.title}</p>
                              <p className="text-gray-600 text-sm">{property.roomType}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-gray-800">{property.owner?.name || 'Unknown'}</p>
                              <p className="text-gray-600 text-sm">{property.owner?.email || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {property.propertyType?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-semibold">
                            ₹{property.rent?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {property.area}, {property.city}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              property.availability?.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {property.availability?.available ? 'Available' : 'Rented'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Owners Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Owner Details</h2>
              </div>

              {owners.length === 0 ? (
                <p className="text-gray-600 p-6">No owners available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Owner Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Properties Count
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Total Rent Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {owners.map((owner) => {
                        const ownerProperties = properties.filter(p => p.owner?._id === owner._id);
                        const totalRentValue = ownerProperties.reduce((sum, p) => sum + (p.rent || 0), 0);
                        
                        return (
                          <tr
                            key={owner._id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">{owner.name}</td>
                            <td className="px-6 py-4 text-gray-600">{owner.email}</td>
                            <td className="px-6 py-4 text-gray-600">{owner.phone || '-'}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {ownerProperties.length} properties
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-semibold">
                              ₹{totalRentValue.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
