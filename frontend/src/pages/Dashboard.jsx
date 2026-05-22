
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { propertyAPI } from "../services/apiService";
import LoadingSkeletons from "../components/LoadingSkeletons";

const StatCard = ({ label, value, color, icon, delay }) => (
  <div className="stat-card" style={{ animationDelay: delay }}>
    <div className="stat-icon" style={{ background: color }}>
      {icon}
    </div>
    <div className="stat-content">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color }}>
        {value}
      </p>
    </div>
    <div className="stat-glow" style={{ background: color }} />
  </div>
);

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
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
      return;
    }
    const fetchProperties = async () => {
      try {
        const response = await propertyAPI.getByOwner(user.id, { limit: 100 });
        setProperties(response.data.data);
        let totalViews = 0,
          totalInquiries = 0;
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
    try {
      await propertyAPI.delete(id);
      setProperties(properties.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete property");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient background */
        .dash-root::before {
          content: '';
          position: fixed;
          top: -30%;
          left: -20%;
          width: 70vw;
          height: 70vh;
          background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .dash-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .dash-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 56px;
          animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        .dash-greeting {
          font-family: 'Syne', sans-serif;
        }

        .dash-greeting small {
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }

        .dash-greeting h1 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .dash-greeting h1 span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          padding: 14px 24px;
          border-radius: 14px;
          text-decoration: none;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 0 rgba(99,102,241,0.4);
          white-space: nowrap;
          flex-shrink: 0;
          margin-top: 8px;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.45);
        }

        .btn-add svg { width: 18px; height: 18px; }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.3s, transform 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-3px);
        }

        .stat-glow {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: 0.08;
          filter: blur(30px);
          pointer-events: none;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.9;
        }

        .stat-icon svg { width: 24px; height: 24px; color: #fff; }

        .stat-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        /* Table section */
        .table-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          overflow: hidden;
          animation: fadeUp 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .table-header {
          padding: 28px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .table-count {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }

        .table-wrap { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        th {
          padding: 14px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }

        tbody tr:last-child { border-bottom: none; }

        tbody tr:hover { background: rgba(255,255,255,0.03); }

        td {
          padding: 18px 24px;
          font-size: 14px;
          color: #b0b0c0;
          vertical-align: middle;
        }

        .prop-title {
          color: #e8e8f0;
          font-weight: 600;
          text-decoration: none;
          font-size: 14px;
          display: block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s;
        }

        .prop-title:hover { color: #818cf8; }

        .prop-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          font-size: 13px;
        }

        .prop-rent {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #fff;
          font-size: 15px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .badge-available {
          background: rgba(16,185,129,0.12);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
        }

        .badge-rented {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.2);
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .action-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(99,102,241,0.1);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.2);
          padding: 7px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-edit:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
          color: #a5b4fc;
        }

        .btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(239,68,68,0.08);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.15);
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.35);
        }

        /* Empty state */
        .empty-state {
          padding: 80px 32px;
          text-align: center;
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .empty-icon svg { width: 32px; height: 32px; color: #6366f1; }

        .empty-state h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #555;
          font-size: 14px;
          margin-bottom: 24px;
        }

        /* Delete modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }

        .modal-box {
          background: #13131a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .modal-icon svg { width: 26px; height: 26px; color: #f87171; }

        .modal-box h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .modal-box p {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .modal-actions { display: flex; gap: 12px; }

        .btn-cancel {
          flex: 1;
          background: rgba(255,255,255,0.05);
          color: #888;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #bbb; }

        .btn-confirm-delete {
          flex: 1;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }

        .btn-confirm-delete:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.4);
        }

        /* Animations */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        .views-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #888;
        }

        .views-pill svg { width: 13px; height: 13px; }
      `}</style>

      <div className="dash-root">
        <div className="dash-container">
          {/* Header */}
          <div className="dash-header">
            <div className="dash-greeting">
              <small>Owner Dashboard</small>
              <h1>
                Welcome back,{" "}
                <span>{user?.name?.split(" ")[0] || "Owner"}</span>
              </h1>
            </div>
            <Link to="/dashboard/add-property" className="btn-add">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Property
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              label="Total Properties"
              value={stats.totalProperties}
              color="#6366f1"
              delay="0.1s"
              icon={
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 21V12h6v9"
                  />
                </svg>
              }
            />
            <StatCard
              label="Total Views"
              value={stats.totalViews}
              color="#10b981"
              delay="0.2s"
              icon={
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z"
                  />
                  <circle cx="12" cy="12" r="2.5" strokeLinecap="round" />
                </svg>
              }
            />
            <StatCard
              label="Total Inquiries"
              value={stats.totalInquiries}
              color="#f59e0b"
              delay="0.3s"
              icon={
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              }
            />
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-header">
              <h2>My Properties</h2>
              {!loading && (
                <span className="table-count">
                  {properties.length} listings
                </span>
              )}
            </div>

            {loading ? (
              <LoadingSkeletons />
            ) : properties.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Rent / mo</th>
                      <th>Views</th>
                      <th>Inquiries</th>
                      <th>Status</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, i) => (
                      <tr
                        key={property._id}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <td>
                          <Link
                            to={`/property/${property._id}`}
                            className="prop-title"
                          >
                            {property.title}
                          </Link>
                        </td>
                        <td>
                          <span className="prop-location">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              style={{ width: 12, height: 12 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            {property.area}, {property.city}
                          </span>
                        </td>
                        <td>
                          <span className="prop-rent">
                            ₹{property.rent?.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className="views-pill">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z"
                              />
                            </svg>
                            {property.views || 0}
                          </span>
                        </td>
                        <td style={{ color: "#888", fontSize: 13 }}>
                          {property.inquiries?.length || 0}
                        </td>
                        <td>
                          <span
                            className={`badge ${property.availability?.available ? "badge-available" : "badge-rented"}`}
                          >
                            <span className="badge-dot" />
                            {property.availability?.available
                              ? "Available"
                              : "Rented"}
                          </span>
                        </td>
                        <td>
                          <div
                            className="action-btns"
                            style={{ justifyContent: "center" }}
                          >
                            <Link
                              to={`/dashboard/edit-property/${property._id}`}
                              className="btn-edit"
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                style={{ width: 13, height: 13 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                                />
                              </svg>
                              Edit
                            </Link>
                            <button
                              className="btn-delete"
                              onClick={() => setDeleteConfirm(property._id)}
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                style={{ width: 13, height: 13 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </div>
                <h3>No properties yet</h3>
                <p>
                  Start listing your properties and reach thousands of renters.
                </p>
                <Link
                  to="/dashboard/add-property"
                  className="btn-add"
                  style={{ display: "inline-flex" }}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3>Delete Property?</h3>
            <p>
              This action cannot be undone. The property listing will be
              permanently removed from your account.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={() => handleDeleteProperty(deleteConfirm)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
