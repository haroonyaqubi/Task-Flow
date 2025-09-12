import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

import Accueil from './pages/accueil';
import Taches from './pages/taches';
import Contact from './pages/contact';
import Apropos from './pages/Apropos';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminTaches from './pages/AdminTaches';
import logo from './images/logo.png';

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
                {/* Logo + Brand */}
                <Link className="navbar-brand d-flex align-items-center text-white" to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="me-2"
                    />
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
                        <li className="nav-item"><Link className="nav-link text-white" to="/taches">Taches</Link></li>
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

function Footer() {
    return (
        <footer style={{ backgroundColor: '#7C3AED' }} className="text-white mt-auto pt-2">
            <div className="container text-center">
                {/* Logo */}
                <img src={logo} alt="Logo" width="60" height="60" className="mb-3" />

                {/* Navigation Links in a Row */}
                <div className="mb-3 d-flex justify-content-center gap-4">
                    <Link to="/" className="text-white text-decoration-none">Accueil</Link>
                    <Link to="/taches" className="text-white text-decoration-none">Taches</Link>
                    <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
                    <Link to="/Apropos" className="text-white text-decoration-none">A propos</Link>
                </div>

                {/* Social Media Icons in a Row */}
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

                {/* White Line */}
                <hr className="border-light" />

                {/* Copyright */}
                <p className="mb-0 pb-3">
                    © {new Date().getFullYear()} Task Flow — Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}


function PrivateRoute({ children }) {
    const isLoggedIn = !!localStorage.getItem('access');
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}


function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Accueil />} />

                        <Route
                            path="/taches"
                            element={
                                <PrivateRoute>
                                    <Taches />
                                </PrivateRoute>}/>



                        <Route path="/contact" element={<Contact />} />
                        <Route path="/Apropos" element={<Apropos />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin-taches" element={<AdminTaches />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;



