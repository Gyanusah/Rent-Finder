import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyAPI } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import ImageCarousel from "../components/ImageCarousel";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyAPI.getById(id);
        setProperty(response.data.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to send inquiry");
      return;
    }

    try {
      await propertyAPI.sendInquiry(id, { message });
      setInquirySent(true);
      setMessage("");
      setTimeout(() => setInquirySent(false), 3000);
    } catch (error) {
      console.error("Error sending inquiry:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSkeletons />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Carousel */}
        <div className="mb-8">
          <ImageCarousel images={property.images || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {property.title}
              </h1>
              <p className="text-gray-600 mb-4">📍 {property.address}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Rent</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{property.rent}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Deposit</p>
                  <p className="text-2xl font-bold">₹{property.deposit}</p>
                </div>
                {property.maintenance > 0 && (
                  <div>
                    <p className="text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold">
                      ₹{property.maintenance}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="text-xl font-bold">
                    {property.propertyType.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.roomCount && (
                  <div>
                    <p className="text-gray-600 text-sm">Rooms</p>
                    <p className="text-lg font-semibold">
                      {property.roomCount}
                    </p>
                  </div>
                )}
                {property.bathrooms && (
                  <>
                    <div>
                      <p className="text-gray-600 text-sm">Total Bathrooms</p>
                      <p className="text-lg font-semibold">
                        {property.bathrooms.total}
                      </p>
                    </div>
                    {property.bathrooms.attached > 0 && (
                      <div>
                        <p className="text-gray-600 text-sm">Attached</p>
                        <p className="text-lg font-semibold">
                          {property.bathrooms.attached}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-gray-600 text-sm">Furnishing</p>
                  <p className="text-lg font-semibold capitalize">
                    {property.furnishing}
                  </p>
                </div>
                {property.roomSize && (
                  <div>
                    <p className="text-gray-600 text-sm">Size</p>
                    <p className="text-lg font-semibold">
                      {property.roomSize.value} {property.roomSize.unit}
                    </p>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <p className="text-gray-600 text-sm">Floor</p>
                    <p className="text-lg font-semibold">
                      {property.floor.current} / {property.floor.total}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities &&
              Object.keys(property.amenities).some(
                (k) => property.amenities[k]
              ) && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.wifi && (
                      <div className="flex items-center space-x-2">
                        <span>📶</span>
                        <span>WiFi</span>
                      </div>
                    )}
                    {property.amenities.ac && (
                      <div className="flex items-center space-x-2">
                        <span>❄️</span>
                        <span>AC</span>
                      </div>
                    )}
                    {property.amenities.parking && (
                      <div className="flex items-center space-x-2">
                        <span>🚗</span>
                        <span>Parking</span>
                      </div>
                    )}
                    {property.amenities.powerBackup && (
                      <div className="flex items-center space-x-2">
                        <span>🔌</span>
                        <span>Power Backup</span>
                      </div>
                    )}
                    {property.amenities.waterSupply && (
                      <div className="flex items-center space-x-2">
                        <span>💧</span>
                        <span>Water Supply</span>
                      </div>
                    )}
                    {property.amenities.lift && (
                      <div className="flex items-center space-x-2">
                        <span>🛗</span>
                        <span>Lift</span>
                      </div>
                    )}
                    {property.amenities.gym && (
                      <div className="flex items-center space-x-2">
                        <span>💪</span>
                        <span>Gym</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Rules */}
            {property.rules &&
              Object.keys(property.rules).some(
                (k) => property.rules[k] !== undefined
              ) && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    House Rules
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      🚬 Smoking:{" "}
                      <span className="font-semibold">
                        {property.rules.smoking ? "Allowed" : "Not Allowed"}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      🍺 Drinking:{" "}
                      <span className="font-semibold">
                        {property.rules.drinking ? "Allowed" : "Not Allowed"}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      🐾 Pets:{" "}
                      <span className="font-semibold">
                        {property.rules.pets ? "Allowed" : "Not Allowed"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar - Contact & Inquiry */}
          <div className="lg:col-span-1 space-y-6">
            {/* Owner Info */}
            {property.owner && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Contact Owner
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">{property.owner.name}</span>
                  </p>
                  <p className="text-gray-700">📧 {property.owner.email}</p>
                  {property.owner.phone && (
                    <p className="text-gray-700">📞 {property.owner.phone}</p>
                  )}
                  <a
                    href={`https://wa.me/${property.owner.phone?.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-center font-semibold"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* Send Inquiry */}
            {user ? (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Send Inquiry
                </h3>
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary resize-none"
                    rows="4"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Send Inquiry
                  </button>
                  {inquirySent && (
                    <p className="text-green-600 text-sm">
                      Inquiry sent successfully!
                    </p>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-blue-800">Please login to send inquiries</p>
              </div>
            )}

            {/* Availability */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Availability
              </h3>
              <p className="text-gray-700">
                Status:{" "}
                <span
                  className={
                    property.availability?.available
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {property.availability?.available
                    ? "Available"
                    : "Not Available"}
                </span>
              </p>
              {property.availability?.availableFrom && (
                <p className="text-gray-700 mt-2">
                  Available From:{" "}
                  <span className="font-semibold">
                    {new Date(
                      property.availability.availableFrom
                    ).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
