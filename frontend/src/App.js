import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Accueil from "./pages/Accueil";
import Contact from "./pages/Contact";
import Apropos from "./pages/Apropos";
import Taches from "./pages/Taches";
import AdminTaches from "./pages/AdminTaches";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

// Components
import ErrorBoundary from "./components/ErrorBoundary";

// Helper to check login
const isLoggedIn = () => !!localStorage.getItem("access");

// Private Route wrapper
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Admin Route wrapper
function AdminRoute({ children }) {
  const access = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_staff") === "true";
  return access && isAdmin ? children : <Navigate to="/taches" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
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
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;