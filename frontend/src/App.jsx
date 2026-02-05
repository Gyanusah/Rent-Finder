// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Pages
// import Home from "./pages/Home";
// import Search from "./pages/Search";
// import PropertyDetails from "./pages/PropertyDetails";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Wishlist from "./pages/Wishlist";
// import Dashboard from "./pages/Dashboard";
// import PropertyForm from "./pages/PropertyForm";

// function AppRoutes() {
//   const { isOwner, isAuthenticated } = useAuth();

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/search" element={<Search />} />
//           <Route path="/property/:id" element={<PropertyDetails />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected Routes */}
//           <Route
//             path="/wishlist"
//             element={
//               <ProtectedRoute isAllowed={isAuthenticated} fallback={<Login />}>
//                 <Wishlist />
//               </ProtectedRoute>
//             }
//           />

//           {/* Owner Routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/add-property"
//             element={
//               <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
//                 <PropertyForm />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/edit-property/:propertyId"
//             element={
//               <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
//                 <PropertyForm />
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 Route */}
//           <Route
//             path="*"
//             element={
//               <div className="text-center py-12">
//                 <h1 className="text-4xl font-bold text-gray-800">
//                   404 - Page Not Found
//                 </h1>
//               </div>
//             }
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import PropertyForm from "./pages/PropertyForm";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function AppRoutes() {
  const { isOwner, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Home /> : <Login />}
          />

          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute isAllowed={isAuthenticated} fallback={<Login />}>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAllowed={isAuthenticated} fallback={<Login />}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAllowed={isAdmin} fallback={<Home />}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-property"
            element={
              <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
                <PropertyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-property/:propertyId"
            element={
              <ProtectedRoute isAllowed={isOwner} fallback={<Home />}>
                <PropertyForm />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
