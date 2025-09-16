// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#7C3AED' }} className="text-white mt-auto pt-2">
      <div className="container text-center">
        <img src={logo} alt="Logo" width="60" height="60" className="mb-3" />
        <div className="mb-3 d-flex justify-content-center gap-4">
          <Link to="/" className="text-white text-decoration-none">Accueil</Link>
          <Link to="/taches" className="text-white text-decoration-none">Taches</Link>
          <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
          <Link to="/Apropos" className="text-white text-decoration-none">A propos</Link>
        </div>
        <div className="mb-3 d-flex justify-content-center gap-4">
          <a href="https://facebook.com" className="text-white" target="_blank" rel="noreferrer">
            <i className="bi bi-facebook fs-4"></i>
          </a>
          <a href="https://twitter.com" className="text-white" target="_blank" rel="noreferrer">
            <i className="bi bi-twitter fs-4"></i>
          </a>
          <a href="https://linkedin.com" className="text-white" target="_blank" rel="noreferrer">
            <i className="bi bi-linkedin fs-4"></i>
          </a>
          <a href="https://instagram.com" className="text-white" target="_blank" rel="noreferrer">
            <i className="bi bi-instagram fs-4"></i>
          </a>
        </div>
        <hr className="border-light" />
        <p className="mb-0 pb-3">© {new Date().getFullYear()} Task Flow — Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
