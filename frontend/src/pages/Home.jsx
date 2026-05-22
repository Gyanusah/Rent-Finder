// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { propertyAPI } from "../services/apiService";
// // import SearchBar from "../components/SearchBar";
// // import PropertyCard from "../components/PropertyCard";
// // import LoadingSkeletons from "../components/LoadingSkeletons";

// // export default function Home() {
// //   const navigate = useNavigate();
// //   const [properties, setProperties] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchFeaturedProperties = async () => {
// //       try {
// //         const response = await propertyAPI.getAll({ limit: 6 });
// //         setProperties(response?.data?.data || []);
// //       } catch (error) {
// //         console.error("Error fetching properties:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchFeaturedProperties();
// //   }, []);

// //   const handleSearch = (formData) => {
// //     const params = new URLSearchParams();
// //     if (formData.city) params.append("city", formData.city);
// //     if (formData.area) params.append("area", formData.area);
// //     if (formData.propertyType)
// //       params.append("propertyType", formData.propertyType);
// //     if (formData.minRent) params.append("minRent", formData.minRent);
// //     if (formData.maxRent) params.append("maxRent", formData.maxRent);

// //     navigate(`/search?${params.toString()}`);
// //   };

// //   return (
// //     <div className="min-h-screen">
// //       {/* Hero Section */}
// //       <div
// //         className="bg-gradient-to-r from-primary to-blue-800 text-white py-12 md:py-20 px-4"
// //         style={{
// //           backgroundImage:
// //             "linear-gradient(rgba(37, 99, 235, 0.9), rgba(30, 58, 138, 0.9))",
// //         }}
// //       >
// //         <div className="max-w-7xl mx-auto text-center mb-8">
// //           <h1 className="text-4xl md:text-5xl font-bold mb-4">
// //             Find Your Perfect Home
// //           </h1>
// //           <p className="text-xl text-blue-100">
// //             Search for rooms, flats, and houses near you
// //           </p>
// //         </div>
// //       </div>

// //       {/* Search Bar */}
// //       <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-12">
// //         <SearchBar onSearch={handleSearch} />
// //       </div>

// //       {/* Featured Properties */}
// //       <div className="max-w-7xl mx-auto px-4 py-12">
// //         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
// //           Featured Properties
// //         </h2>

// //         {loading ? (
// //           <LoadingSkeletons />
// //         ) : properties.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {properties.map((property) => (
// //               <PropertyCard key={property._id} property={property} />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-12">
// //             <p className="text-gray-600 text-xl">No properties available</p>
// //           </div>
// //         )}

// //         {/* View All Button */}
// //         <div className="text-center mt-12">
// //           <button
// //             onClick={() => navigate("/search")}
// //             className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
// //           >
// //             View All Properties
// //           </button>
// //         </div>
// //       </div>

// //       {/* Features Section */}
// //       <div className="bg-gray-50 py-12">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
// //             Why Choose RentFinder?
// //           </h2>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="text-center">
// //               <div className="text-4xl mb-4">🏠</div>
// //               <h3 className="text-xl font-semibold text-gray-800 mb-2">
// //                 Verified Listings
// //               </h3>
// //               <p className="text-gray-600">
// //                 All properties are verified and authentic
// //               </p>
// //             </div>
// //             <div className="text-center">
// //               <div className="text-4xl mb-4">📱</div>
// //               <h3 className="text-xl font-semibold text-gray-800 mb-2">
// //                 Easy Communication
// //               </h3>
// //               <p className="text-gray-600">
// //                 Direct contact with property owners
// //               </p>
// //             </div>
// //             <div className="text-center">
// //               <div className="text-4xl mb-4">🔒</div>
// //               <h3 className="text-xl font-semibold text-gray-800 mb-2">
// //                 Safe & Secure
// //               </h3>
// //               <p className="text-gray-600">Your information is protected</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { propertyAPI } from "../services/apiService";
// import SearchBar from "../components/SearchBar";
// import PropertyCard from "../components/PropertyCard";
// import LoadingSkeletons from "../components/LoadingSkeletons";

// export default function Home() {
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeaturedProperties = async () => {
//       try {
//         const response = await propertyAPI.getAll({ limit: 6 });
//         setProperties(response?.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching properties:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProperties();
//   }, []);

//   const handleSearch = (formData) => {
//     const params = new URLSearchParams();
//     if (formData.city) params.append("city", formData.city);
//     if (formData.area) params.append("area", formData.area);
//     if (formData.propertyType)
//       params.append("propertyType", formData.propertyType);
//     if (formData.minRent) params.append("minRent", formData.minRent);
//     if (formData.maxRent) params.append("maxRent", formData.maxRent);

//     navigate(`/search?${params.toString()}`);
//   };

//   return (
//     <div className="min-h-screen">
//       {/* 🔥 HERO SECTION */}
//       <div
//         className="relative text-white py-20 px-4 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994')",
//         }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/60"></div>

//         {/* Content */}
//         <div className="relative max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Find Your Perfect Home
//           </h1>
//           <p className="text-lg md:text-xl text-gray-200 mb-10">
//             Search for rooms, flats, and houses near you
//           </p>

//           {/* 💎 Glass Search */}
//           <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
//             <SearchBar onSearch={handleSearch} />
//           </div>
//         </div>
//       </div>

//       {/* 🔥 FEATURED PROPERTIES */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
//           Featured Properties
//         </h2>

//         {loading ? (
//           <LoadingSkeletons />
//         ) : properties.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {properties.map((property) => (
//               <PropertyCard key={property._id} property={property} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-xl">No properties available</p>
//           </div>
//         )}

//         {/* View All */}
//         <div className="text-center mt-12">
//           <button
//             onClick={() => navigate("/search")}
//             className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
//           >
//             View All Properties
//           </button>
//         </div>
//       </div>

//       {/* 🔥 FEATURES SECTION */}
//       <div className="bg-gray-50 py-16">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
//             Why Choose RentFinder?
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
//               <div className="text-4xl mb-4">🏠</div>
//               <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
//               <p className="text-gray-600">
//                 All properties are verified and authentic
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
//               <div className="text-4xl mb-4">📱</div>
//               <h3 className="text-xl font-semibold mb-2">Easy Communication</h3>
//               <p className="text-gray-600">
//                 Direct contact with property owners
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
//               <div className="text-4xl mb-4">🔒</div>
//               <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
//               <p className="text-gray-600">Your information is protected</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../services/apiService";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import LoadingSkeletons from "../components/LoadingSkeletons";

/* ── Animated counter on scroll ── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const id = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(id);
          } else setCount(start);
        }, 18);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const features = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Verified Listings",
    desc: "Every property is reviewed and authenticated before going live — no fakes, no surprises.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
    title: "Direct Communication",
    desc: "Message owners directly without middlemen. Faster decisions, zero commissions.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
    title: "Safe & Private",
    desc: "Bank-grade encryption keeps your personal data and contacts fully protected.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
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
    ),
    title: "Hyperlocal Search",
    desc: "Filter by city, area or neighbourhood to find rentals within walking distance.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await propertyAPI.getAll({ limit: 6 });
        setProperties(response?.data?.data || []);
      } catch (e) {
        console.error("Error fetching properties:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (formData) => {
    const params = new URLSearchParams();
    if (formData.city) params.append("city", formData.city);
    if (formData.area) params.append("area", formData.area);
    if (formData.propertyType)
      params.append("propertyType", formData.propertyType);
    if (formData.minRent) params.append("minRent", formData.minRent);
    if (formData.maxRent) params.append("maxRent", formData.maxRent);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* Google Font import via style tag */}
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        // .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        // .font-outfit   { font-family: 'Outfit', sans-serif; }
        // @keyframes heroZoom {
        //   from { transform: scale(1.04); }
        //   to   { transform: scale(1.10); }
        // }
        // .hero-zoom { animation: heroZoom 14s ease-in-out infinite alternate; }
        // @keyframes fadeUp {
        //   from { opacity: 0; transform: translateY(28px); }
        //   to   { opacity: 1; transform: translateY(0); }
        // }
        // .fade-up-1 { animation: fadeUp 0.7s 0.05s ease both; }
        // .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        // .fade-up-3 { animation: fadeUp 0.7s 0.25s ease both; }
        // .fade-up-4 { animation: fadeUp 0.7s 0.35s ease both; }
        // .fade-up-5 { animation: fadeUp 0.7s 0.45s ease both; }
        // @keyframes pulse-dot {
        //   0%,100% { opacity:1; transform:scale(1); }
        //   50%      { opacity:0.4; transform:scale(1.6); }
        // }
        // .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        // .diagonal-cut {
        //   clip-path: polygon(0 55%, 100% 0, 100% 100%, 0 100%);
        // }
        // .bg-text-watermark {
        //   font-size: clamp(80px, 18vw, 200px);
        //   -webkit-text-stroke: 1px rgba(26,23,20,0.06);
        //   color: transparent;
        //   user-select: none;
        //   pointer-events: none;
        // }
      `}</style>

      <div className="min-h-screen bg-gray-600 font-outfit overflow-x-hidden">
        {/* ══════════════════ HERO ══════════════════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background image with zoom */}
          <div
            className="hero-zoom absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80')",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950/85 via-stone-900/60 to-amber-900/20" />

          {/* Diagonal cream slice at bottom */}
          <div className="diagonal-cut absolute bottom-0 left-0 right-0 h-32 bg-amber-50" />

          {/* Hero content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-40">
            {/* Eyebrow badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Nepal's #1 Rental Platform
            </div>

            {/* Heading */}
            <h1 className="fade-up-2 font-playfair text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.02] tracking-tight mb-6 max-w-3xl">
              Find Your <em className="text-amber-400 not-italic">Perfect</em>
              <br />
              Home Today
            </h1>

            {/* Subheading */}
            <p className="fade-up-3 text-base md:text-lg text-white/50 font-light leading-relaxed max-w-md mb-12">
              Thousands of verified rooms, flats, and houses — searchable by
              city, area, and budget.
            </p>

            {/* Glass search card */}
            <div className="fade-up-4 backdrop-blur-xl bg-white/8 border border-white/12 rounded-2xl p-6 md:p-8 max-w-3xl shadow-2xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-4">
                Search Properties
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Stats */}
            <div className="fade-up-5 flex flex-wrap gap-10 mt-14">
              {[
                { target: 1200, suffix: "+", label: "Active Listings" },
                { target: 48, suffix: "+", label: "Cities Covered" },
                { target: 5000, suffix: "+", label: "Happy Tenants" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-playfair text-3xl md:text-4xl font-bold text-amber-400">
                    <Counter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-white/35 mt-1 tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ FEATURED PROPERTIES ══════════════════ */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-3">
                Handpicked for You
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
                Featured Properties
              </h2>
            </div>

            <button
              onClick={() => navigate("/search")}
              className="group inline-flex items-center gap-3 bg-stone-900 hover:bg-amber-500 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/30 whitespace-nowrap self-start sm:self-auto"
            >
              View All Properties
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <LoadingSkeletons />
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-9 h-9 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
                  />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-stone-800 mb-2">
                No properties yet
              </h3>
              <p className="text-stone-400 text-sm">
                Check back soon — new listings are added daily.
              </p>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <hr className="border-stone-200" />
        </div>

        {/* ══════════════════ WHY RENTFINDER ══════════════════ */}
        <section className="bg-gray-600 relative overflow-hidden py-28 px-6 md:px-10">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

          <div className="max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-3">
                  Our Promise
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                  Why Choose
                  <br />
                  RentFinder?
                </h2>
              </div>
              <p className="text-sm text-white/35 font-light leading-relaxed max-w-xs lg:text-right">
                Built to make renting in Nepal transparent, fast, and
                stress-free — for tenants and owners alike.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group bg-stone-950 hover:bg-amber-950/30 p-8 transition-all duration-300 cursor-default hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:bg-amber-500/20 transition-colors duration-300">
                    {f.icon}
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-white mb-3">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/35 font-light leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA ══════════════════ */}
        <section className="relative bg-gray-600 py-32 px-6 md:px-10 text-center overflow-hidden">
          {/* Giant watermark */}
          <div className="bg-text-watermark font-playfair font-black absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            RENT
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-4">
              Get Started Today
            </p>
            <h2 className="font-playfair text-4xl md:text-6xl font-black text-stone-900 leading-tight tracking-tight mb-5">
              Ready to Find
              <br />
              Your <em className="text-amber-500 not-italic">Next Home?</em>
            </h2>
            <p className="text-stone-400 text-base font-light leading-relaxed mb-10">
              Join thousands of tenants who found their perfect place on
              RentFinder — fast, simple, and completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/search")}
                className="bg-stone-900 hover:bg-amber-500 text-white px-9 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/30"
              >
                Browse Properties
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-transparent hover:border-amber-500 hover:text-amber-600 text-stone-700 px-9 py-4 rounded-xl border-2 border-stone-300 text-sm font-semibold transition-all duration-300"
              >
                List Your Property
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
