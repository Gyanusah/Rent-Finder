

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyAPI } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import ImageCarousel from "../components/ImageCarousel";
import LoadingSkeletons from "../components/LoadingSkeletons";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user, isOwner } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPropertyOwner =
    isOwner &&
    property &&
    (property.owner?._id?.toString() || property.owner?.toString()) ===
      user?.id;

  const inquiryCount = property?.inquiries?.length || 0;
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
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <LoadingSkeletons />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <p className="text-slate-400 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* BACKGROUND GLOWS */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* IMAGE CAROUSEL */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <ImageCarousel images={property.images || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* TITLE CARD */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
              <h1 className="text-3xl md:text-4xl font-bold">
                {property.title}
              </h1>

              <p className="text-slate-400 mt-2">📍 {property.address}</p>

              {/* PRICE GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-slate-400 text-sm">Rent</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{property.rent}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Deposit</p>
                  <p className="text-xl font-semibold">₹{property.deposit}</p>
                </div>

                {property.maintenance > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Maintenance</p>
                    <p className="text-xl font-semibold">
                      ₹{property.maintenance}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-slate-400 text-sm">Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {property.propertyType.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-3">About Property</h2>
              <p className="text-slate-300 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* DETAILS */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-slate-300">
                {property.roomCount && (
                  <div>
                    <p className="text-slate-500 text-sm">Rooms</p>
                    <p className="font-semibold">{property.roomCount}</p>
                  </div>
                )}

                {property.bathrooms && (
                  <div>
                    <p className="text-slate-500 text-sm">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms.total}</p>
                  </div>
                )}

                <div>
                  <p className="text-slate-500 text-sm">Furnishing</p>
                  <p className="font-semibold capitalize">
                    {property.furnishing}
                  </p>
                </div>

                {property.roomSize && (
                  <div>
                    <p className="text-slate-500 text-sm">Size</p>
                    <p className="font-semibold">
                      {property.roomSize.value} {property.roomSize.unit}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AMENITIES */}
            {property.amenities && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-slate-300">
                  {property.amenities.wifi && <p>📶 WiFi</p>}
                  {property.amenities.ac && <p>❄️ AC</p>}
                  {property.amenities.parking && <p>🚗 Parking</p>}
                  {property.amenities.gym && <p>💪 Gym</p>}
                  {property.amenities.lift && <p>🛗 Lift</p>}
                  {property.amenities.waterSupply && <p>💧 Water</p>}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* OWNER CARD */}
            {property.owner && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>

                <p className="text-slate-300 font-semibold">
                  {property.owner.name}
                </p>

                <p className="text-slate-400 text-sm mt-2">
                  {property.owner.email}
                </p>

                <a
                  href={`https://wa.me/${property.owner.phone?.replace(
                    /[^0-9]/g,
                    "",
                  )}`}
                  className="mt-4 block text-center bg-green-500 hover:bg-green-600 transition py-2 rounded-xl font-semibold"
                >
                  WhatsApp Chat
                </a>
              </div>
            )}

            {/* INQUIRY */}
            {user && !isPropertyOwner && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="font-semibold mb-3">Send Inquiry</h3>

                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    placeholder="Write message..."
                  />

                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl font-semibold transition">
                    Send Message
                  </button>

                  {inquirySent && (
                    <p className="text-green-400 text-sm">
                      Inquiry sent successfully
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* STATUS */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="font-semibold mb-3">Availability</h3>

              <p className="text-slate-300">
                Status:{" "}
                <span className="text-green-400 font-semibold">
                  {property.availability?.available
                    ? "Available"
                    : "Not Available"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}