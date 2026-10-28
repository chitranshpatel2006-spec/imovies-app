import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview | movies | bookings
  const [loading, setLoading] = useState(true);

  // New Movie Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 130,
    rating: 8.5,
    certificate: 'UA 16+',
    releaseDate: new Date().toISOString().split('T')[0],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    director: 'Christopher Nolan',
    cast: 'Actor A, Actor B',
    isNowShowing: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setMovies(moviesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies', newMovie);
      setShowAddModal(false);
      alert('Movie created successfully!');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to add movie: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to remove this movie from catalog?')) return;
    try {
      await api.delete(`/movies/${movieId}`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete movie: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-2">Admin Portal</span>
          <h2 className="text-white fw-bold mb-0">IMovies Administration Dashboard</h2>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
          >
            <i className="bi bi-plus-circle me-1"></i> Add New Movie
          </button>
          <button
            onClick={fetchDashboardData}
            className="btn btn-outline-secondary text-light btn-sm rounded-pill px-3"
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="cinema-card p-3 border-start border-4 border-danger">
            <div className="text-muted small text-uppercase fw-bold">Total Platform Revenue</div>
            <div className="display-6 fw-bold text-white mt-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
            <div className="text-success small mt-2">
              <i className="bi bi-graph-up-arrow me-1"></i> Live Confirmed Bookings
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="cinema-card p-3 border-start border-4 border-warning">
            <div className="text-muted small text-uppercase fw-bold">Total Reservations</div>
            <div className="display-6 fw-bold text-white mt-1">{stats?.totalBookings || 0}</div>
            <div className="text-muted small mt-2">
              <i className="bi bi-ticket-perforated me-1"></i> Customer Orders
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="cinema-card p-3 border-start border-4 border-info">
            <div className="text-muted small text-uppercase fw-bold">Total Seats Sold</div>
            <div className="display-6 fw-bold text-white mt-1">{stats?.totalTicketsSold || 0}</div>
            <div className="text-info small mt-2">
              <i className="bi bi-check2-circle me-1"></i> Real-time Occupancy
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="cinema-card p-3 border-start border-4 border-success">
            <div className="text-muted small text-uppercase fw-bold">Catalog Movies</div>
            <div className="display-6 fw-bold text-white mt-1">{stats?.totalMovies || 0}</div>
            <div className="text-light small mt-2">
              <i className="bi bi-film me-1"></i> Across Screens
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2 border-bottom border-secondary border-opacity-25 pb-3">
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn rounded-pill px-4 btn-sm ${
              activeTab === 'overview' ? 'btn-danger' : 'btn-outline-secondary text-light'
            }`}
          >
            <i className="bi bi-speedometer2 me-1"></i> Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('movies')}
            className={`btn rounded-pill px-4 btn-sm ${
              activeTab === 'movies' ? 'btn-danger' : 'btn-outline-secondary text-light'
            }`}
          >
            <i className="bi bi-film me-1"></i> Manage Movies ({movies.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`btn rounded-pill px-4 btn-sm ${
              activeTab === 'bookings' ? 'btn-danger' : 'btn-outline-secondary text-light'
            }`}
          >
            <i className="bi bi-receipt me-1"></i> All Bookings ({bookings.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="cinema-card p-4 h-100">
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-clock-history text-danger me-2"></i>Recent Cinema Bookings
              </h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="text-secondary small">
                    <tr>
                      <th>Ref ID</th>
                      <th>Customer</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b._id || b.id}>
                        <td className="fw-mono text-danger fw-bold">{b.bookingReference}</td>
                        <td>{b.userDetails?.name || 'Customer'}</td>
                        <td>
                          {b.seats ? b.seats.map((s) => s.seatId).join(', ') : 'N/A'}
                        </td>
                        <td className="text-warning fw-semibold">₹{b.totalAmount}</td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="cinema-card p-4 h-100">
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-gear-fill text-warning me-2"></i>System Architecture
              </h5>
              <ul className="list-unstyled small d-flex flex-column gap-3 text-muted mb-0">
                <li className="d-flex align-items-center justify-content-between p-2 rounded bg-dark">
                  <span>Server Environment</span>
                  <span className="badge bg-success">Express.js Node API</span>
                </li>
                <li className="d-flex align-items-center justify-content-between p-2 rounded bg-dark">
                  <span>Client Stack</span>
                  <span className="badge bg-info text-dark">React.js + Bootstrap 5</span>
                </li>
                <li className="d-flex align-items-center justify-content-between p-2 rounded bg-dark">
                  <span>Auth Engine</span>
                  <span className="badge bg-secondary">JWT + Bcrypt (Salt 10)</span>
                </li>
                <li className="d-flex align-items-center justify-content-between p-2 rounded bg-dark">
                  <span>Seat Reservation</span>
                  <span className="badge bg-danger">Real-time Collision Lock</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Movies */}
      {activeTab === 'movies' && (
        <div className="cinema-card p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead className="text-secondary small">
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id || m.id}>
                    <td>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded"
                        style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-bold text-white">{m.title}</td>
                    <td>{Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}</td>
                    <td>{m.duration} mins</td>
                    <td>
                      <span className="text-warning">
                        <i className="bi bi-star-fill me-1"></i>{m.rating}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${m.isNowShowing ? 'bg-success' : 'bg-secondary'}`}>
                        {m.isNowShowing ? 'Now Showing' : 'Upcoming'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteMovie(m._id || m.id)}
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        title="Delete Movie"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Bookings */}
      {activeTab === 'bookings' && (
        <div className="cinema-card p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead className="text-secondary small">
                <tr>
                  <th>Ref ID</th>
                  <th>Date</th>
                  <th>Movie</th>
                  <th>Customer</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id || b.id}>
                    <td className="fw-mono text-danger fw-bold">{b.bookingReference}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td className="text-white fw-semibold">
                      {b.movieDetails?.title || b.movieId?.title || 'Movie'}
                    </td>
                    <td>{b.userDetails?.name || b.userId?.name || 'Customer'}</td>
                    <td>
                      {b.seats ? b.seats.map((s) => s.seatId).join(', ') : 'N/A'}
                    </td>
                    <td className="text-warning fw-bold">₹{b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">Add New Movie to Catalog</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateMovie}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label text-light small">Movie Title *</label>
                      <input
                        type="text"
                        className="form-control form-cinema"
                        required
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-light small">Certificate</label>
                      <input
                        type="text"
                        className="form-control form-cinema"
                        value={newMovie.certificate}
                        onChange={(e) => setNewMovie({ ...newMovie, certificate: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-light small">Description / Synopsis *</label>
                      <textarea
                        className="form-control form-cinema"
                        rows="3"
                        required
                        value={newMovie.description}
                        onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-light small">Genres (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control form-cinema"
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-light small">Language</label>
                      <input
                        type="text"
                        className="form-control form-cinema"
                        value={newMovie.language}
                        onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-sm-4">
                      <label className="form-label text-light small">Duration (Minutes)</label>
                      <input
                        type="number"
                        className="form-control form-cinema"
                        value={newMovie.duration}
                        onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label text-light small">Rating (0 - 10)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-cinema"
                        value={newMovie.rating}
                        onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label text-light small">Release Date</label>
                      <input
                        type="date"
                        className="form-control form-cinema"
                        value={newMovie.releaseDate}
                        onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-light small">Poster Image URL *</label>
                      <input
                        type="url"
                        className="form-control form-cinema"
                        required
                        value={newMovie.posterUrl}
                        onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-light small">Trailer Embed URL (YouTube embed)</label>
                      <input
                        type="url"
                        className="form-control form-cinema"
                        value={newMovie.trailerUrl}
                        onChange={(e) => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isNowShowingCheck"
                          checked={newMovie.isNowShowing}
                          onChange={(e) => setNewMovie({ ...newMovie, isNowShowing: e.target.checked })}
                        />
                        <label className="form-check-label text-light" htmlFor="isNowShowingCheck">
                          Mark as Now Showing in Theaters
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger">
                    Save Movie
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
