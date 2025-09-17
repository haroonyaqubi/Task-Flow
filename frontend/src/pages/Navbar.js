// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };
  const isLoggedIn = !!localStorage.getItem('access');

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#7C3AED' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-white" to="/">
          <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
        </Link>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link text-white" to="/">Accueil</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/Taches">Taches</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/contact">Contact</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/Apropos">A propos</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Connexion</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/register">S'inscrire</Link>
            </li>
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
