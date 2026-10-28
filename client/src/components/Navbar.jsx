import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-secondary border-opacity-25 py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="fs-3">🎬</span>
          <span className="fw-bold fs-4 text-white letter-spacing-1">
            <span className="text-danger">I</span>Movies
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium" to="/movies">
                <i className="bi bi-film me-1"></i> Movies
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-light fw-medium" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* User Auth Buttons */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-danger"></i>
                  <span className="small fw-semibold">{user.name}</span>
                  {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li className="px-3 py-2 small text-muted border-bottom border-secondary border-opacity-25">
                    Signed in as<br />
                    <strong className="text-light">{user.email}</strong>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-2"></i>My Tickets
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning" to="/admin">
                        <i className="bi bi-gear me-2"></i>Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary border-opacity-25" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-danger rounded-pill px-4 btn-sm fw-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
