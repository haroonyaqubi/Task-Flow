import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Accueil from "./pages/Accueil";
import Taches from "./pages/Taches";
import AdminTaches from "./pages/AdminTaches";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Apropos from "./pages/Apropos";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

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
  return access && isAdmin ? children : <Navigate to="/Taches" replace />;
}

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Apropos" element={<Apropos />} />

            {/* Auth Routes */}
            <Route path="/login" element={isLoggedIn() ? <Navigate to="/Taches" /> : <Login />} />
            <Route path="/register" element={isLoggedIn() ? <Navigate to="/Taches" /> : <Register />} />

            {/* Protected Routes */}
            <Route
              path="/Taches"
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
