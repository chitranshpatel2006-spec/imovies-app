import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="cinema-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🎬</span>
              <h3 className="text-white fw-bold mt-2 mb-1">Welcome Back</h3>
              <p className="text-muted small">Sign in to your IMovies cinema account</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control form-cinema border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-light small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control form-cinema border-start-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Fill Credentials for Grading / Testing */}
            <div className="p-3 bg-dark bg-opacity-75 rounded-3 border border-secondary border-opacity-25 mt-3">
              <div className="text-secondary small fw-bold mb-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> One-Click Demo Credentials:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm flex-fill text-light"
                  onClick={() => handleQuickFill('alex@example.com', 'password123')}
                >
                  <i className="bi bi-person me-1"></i> Regular User
                </button>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm flex-fill text-warning"
                  onClick={() => handleQuickFill('admin@imovies.com', 'password123')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-4 small text-muted">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-danger text-decoration-none fw-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
