
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../services/apiService";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, updateProfile, changePassword } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const getAvatarSrc = (src) => {
    if (!src) return "/placeholder.svg";
    if (src.startsWith("blob:")) return src;
    return getImageUrl(src);
  };

  const avatarSrc = getAvatarSrc(preview || user?.avatar);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login");

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || null,
      });
      setPreview(user.avatar || null);
    }
  }, [user, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((p) => ({ ...p, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (formData.avatar instanceof File) {
        data.append("avatar", formData.avatar);
      }

      const result = await updateProfile(data);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Update failed");
    }

    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* HEADER CARD */}
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 mb-8 border border-white/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* PROFILE IMAGE */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 min-w-[96px] min-h-[96px] rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="block w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer text-xs">
                    📷
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImage}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {formData.name || "User"}
                </h1>
                <p className="text-gray-500">{formData.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:opacity-90 transition"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* SUCCESS / ERROR */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["profile", "password", "privacy", "notifications"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                activeTab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            {isEditing && (
              <button
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

/* SMALL REUSABLE INPUT */
function Input({ label, name, value, onChange, isEditing }) {
  return (
    <div>
      <label className="text-gray-600 font-medium">{label}</label>
      {isEditing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-2 px-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="mt-2 px-4 py-2 bg-gray-100 rounded-xl">
          {value || "-"}
        </div>
      )}
    </div>
  );
}
