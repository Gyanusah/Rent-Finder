

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
          const res = await propertyAPI.getById(propertyId);
          setFormData(res.data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [propertyId, isOwner, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const val = type === "checkbox" ? checked : value;

    // nested fields support
    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: isNaN(val) ? val : Number(val),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: val,
      }));
    }
  };

  const handleAmenityChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleRuleChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [key]: !prev.rules[key],
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
      const fd = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          fd.append(
            key,
            typeof formData[key] === "object"
              ? JSON.stringify(formData[key])
              : formData[key],
          );
        }
      });

      formData.images.forEach((img) => fd.append("images", img));

      if (propertyId) {
        await propertyAPI.update(propertyId, fd);
      } else {
        await propertyAPI.create(fd);
      }

      setSuccess("Property saved successfully");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        Loading...
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  return (
    <div className="min-h-screen bg-[#070b14] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-bold text-center">
          {propertyId ? "Edit Property" : "Add Property"}
        </h1>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-xl"
        >
          {/* BASIC */}
          <section>
            <h2 className="text-xl font-bold mb-4">Basic Info</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                className={inputClass}
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="propertyType"
                placeholder="Property Type"
                value={formData.propertyType}
                onChange={handleChange}
              />
              <textarea
                className={`${inputClass} md:col-span-2`}
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* LOCATION */}
          <section>
            <h2 className="text-xl font-bold mb-4">Location</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                className={inputClass}
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* PRICING */}
          <section>
            <h2 className="text-xl font-bold mb-4">Pricing</h2>

            <div className="grid md:grid-cols-3 gap-5">
              <input
                className={inputClass}
                name="rent"
                placeholder="Rent"
                value={formData.rent}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="deposit"
                placeholder="Deposit"
                value={formData.deposit}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="maintenance"
                placeholder="Maintenance"
                value={formData.maintenance}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* DETAILS */}
          <section>
            <h2 className="text-xl font-bold mb-4">Details</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                className={inputClass}
                name="roomType"
                placeholder="Room Type"
                value={formData.roomType}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="roomCount"
                placeholder="Room Count"
                value={formData.roomCount}
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="bathrooms.total"
                placeholder="Total Bathrooms"
                value={formData.bathrooms.total}
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="floor.current"
                placeholder="Current Floor"
                value={formData.floor.current}
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="roomSize.value"
                placeholder="Room Size"
                value={formData.roomSize.value}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* IMAGES */}
          <section>
            <h2 className="text-xl font-bold mb-4">Images</h2>

            <input type="file" multiple onChange={handleImageChange} />
          </section>

          {/* SUBMIT */}
          <button
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold"
          >
            {submitting ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
