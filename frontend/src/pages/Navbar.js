import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

function Navbar() {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    // Redirect to login page
    navigate('/login');
  };

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('access');

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#7C3AED' }}>
      <div className="container">
        {/* Logo/Brand */}
        <Link className="navbar-brand d-flex align-items-center text-white" to="/">
          <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
        </Link>

        {/* Mobile menu button */}
        <button className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left side links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link text-white" to="/">Accueil</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/taches">Tâches</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/contact">Contact</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/apropos">À propos</Link></li>
          </ul>

          {/* Right side links (login/register/logout) */}
          <ul className="navbar-nav ms-auto">
            {/* Show login link only if not logged in */}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Connexion</Link>
              </li>
            )}

            {/* Always show register link */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/register">S'inscrire</Link>
            </li>

            {/* Show logout button only if logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;