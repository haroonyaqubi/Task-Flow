import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Accueil from "./pages/accueil";
import Taches from "./pages/Taches";   // ✅ Fixed casing
import AdminTaches from "./pages/AdminTaches";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/contact";
import Apropos from "./pages/Apropos";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Helper to check login
const isLoggedIn = () => !!localStorage.getItem("access");

// Private Route wrapper
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Admin Route wrapper
function AdminRoute({ children }) {
  const access = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_staff") === "true"; // stored in login
  return access && isAdmin ? children : <Navigate to="/taches" replace />;
}

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apropos" element={<Apropos />} />

            {/* Auth Routes */}
            <Route path="/login" element={isLoggedIn() ? <Navigate to="/taches" /> : <Login />} />
            <Route path="/register" element={isLoggedIn() ? <Navigate to="/taches" /> : <Register />} />

            {/* Protected Routes */}
            <Route
              path="/taches"
              element={
                <PrivateRoute>
                  <Taches />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-taches"
              element={
                <AdminRoute>
                  <AdminTaches />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
