import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-top border-secondary border-opacity-25 bg-black py-5 text-secondary">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h5 className="text-white brand-font mb-3 d-flex align-items-center gap-2">
              <span>🎬</span>
              <span><span className="text-danger">I</span>Movies Platform</span>
            </h5>
            <p className="small text-muted">
              Premium next-generation cinema ticketing with real-time seat reservation, dynamic showtimes, and contactless digital passes.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3">
              <a href="#github" className="text-secondary text-decoration-none hover-white"><i className="bi bi-github"></i></a>
              <a href="#twitter" className="text-secondary text-decoration-none hover-white"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary text-decoration-none hover-white"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" className="text-secondary text-decoration-none hover-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-light fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/movies" className="text-muted text-decoration-none">Now Showing</Link></li>
              <li><Link to="/movies?filter=upcoming" className="text-muted text-decoration-none">Upcoming</Link></li>
              <li><Link to="/movies?genre=Sci-Fi" className="text-muted text-decoration-none">IMAX Laser</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-light fw-bold mb-3">System Tech</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><i className="bi bi-check2 text-danger me-1"></i> React.js + Bootstrap 5</li>
              <li><i className="bi bi-check2 text-danger me-1"></i> Express.js REST API</li>
              <li><i className="bi bi-check2 text-danger me-1"></i> MongoDB & Mongoose</li>
              <li><i className="bi bi-check2 text-danger me-1"></i> JWT Token Authentication</li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="text-light fw-bold mb-3">Customer Support</h6>
            <p className="small text-muted mb-2">Need assistance with your booking or refund?</p>
            <div className="small text-light">
              <i className="bi bi-envelope text-danger me-2"></i>support@imovies.internal<br />
              <i className="bi bi-telephone text-danger me-2"></i>+1 (800) 555-IMOV
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-0">© {new Date().getFullYear()} IMovies Cinema Network. All rights reserved.</p>
          <p className="mb-0">Designed for Seamless Cinema Reservations</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
