import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Contact from "./pages/Contact";
import Apropos from "./pages/Apropos";
import Taches from "./pages/Taches";
import AdminTaches from "./pages/AdminTaches";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import ErrorBoundary from "./components/ErrorBoundary";


const isLoggedIn = () => !!localStorage.getItem("access");

// PrivateRoute
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Admin Route
function AdminRoute({ children }) {
  const access = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_staff") === "true";
  return access && isAdmin ? children : <Navigate to="/taches" replace />;
}



// Main App component
function App() {
  return (
    // Wrap everything in ErrorBoundary to catch crashes
    <ErrorBoundary>
      <Router>
        {/* Flex container for sticky footer */}
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          {/* Main content area */}
          <main className="flex-grow-1">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Accueil />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apropos" element={<Apropos />} />

              {/* Auth routes - redirect if already logged in */}
              <Route path="/login" element={isLoggedIn() ? <Navigate to="/taches" /> : <Login />} />
              <Route path="/register" element={isLoggedIn() ? <Navigate to="/taches" /> : <Register />} />

              {/* Protected routes - require login */}
              <Route path="/taches" element={<PrivateRoute><Taches /></PrivateRoute>}/>

              {/* Admin-only route */}
              <Route path="/admin-taches" element={<AdminRoute><AdminTaches /></AdminRoute>}/>

              {/* Fallback route - redirect to home if page not found */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer - appears on every page */}
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;


