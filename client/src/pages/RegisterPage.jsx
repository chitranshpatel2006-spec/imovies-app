import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="cinema-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🎟️</span>
              <h3 className="text-white fw-bold mt-2 mb-1">Create an Account</h3>
              <p className="text-muted small">Join IMovies for fast seat reservations and exclusive passes</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-cinema"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-light small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-cinema"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-light small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control form-cinema"
                    placeholder="+1 555-0100"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-light small fw-semibold">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-cinema"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-light small fw-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-cinema"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema w-100 py-2 fw-semibold mb-3 rounded-pill"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-3 small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-danger text-decoration-none fw-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
