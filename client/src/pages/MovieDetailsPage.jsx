import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  // Available dates for booking
  const dates = [
    { label: 'Today', date: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'Day After', date: new Date(Date.now() + 172800000).toISOString().split('T')[0] },
  ];

  useEffect(() => {
    setSelectedDate(dates[0].date);
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShowtimes();
    }
  }, [selectedDate, movie]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await api.get(`/showtimes/movie/${id}`, {
        params: { date: selectedDate },
      });
      setShowtimes(res.data);
    } catch (err) {
      console.error('Error fetching showtimes:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading details...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Movie not found</h3>
        <Link to="/movies" className="btn btn-danger mt-3">Back to Catalog</Link>
      </div>
    );
  }

  // Group showtimes by theater
  const showtimesByTheater = showtimes.reduce((acc, st) => {
    const key = st.theaterName || 'IMovies Cineplex';
    if (!acc[key]) acc[key] = [];
    acc[key].push(st);
    return acc;
  }, {});

  return (
    <div>
      {/* Backdrop Header */}
      <div
        className="position-relative py-5 border-bottom border-secondary border-opacity-25"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,25,0.7), #0b0f19), url(${movie.backdropUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '380px',
        }}
      >
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger">{movie.certificate || 'UA 16+'}</span>
                <span className="badge bg-secondary bg-opacity-50 text-light">{movie.language}</span>
                {movie.genre && movie.genre.map((g) => (
                  <span key={g} className="badge bg-dark border border-secondary border-opacity-25">{g}</span>
                ))}
              </div>

              <h1 className="display-5 fw-bold text-white mb-2">{movie.title}</h1>

              <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                <span className="text-warning fw-bold fs-6">
                  <i className="bi bi-star-fill me-1"></i>{movie.rating ? movie.rating.toFixed(1) : '8.5'}/10
                </span>
                <span>•</span>
                <span><i className="bi bi-clock me-1"></i>{movie.duration} mins</span>
                <span>•</span>
                <span>Released: {new Date(movie.releaseDate).toLocaleDateString()}</span>
              </div>

              <p className="text-light text-opacity-90 lead fs-6 mb-4" style={{ maxWidth: '750px' }}>
                {movie.description}
              </p>

              {movie.director && (
                <div className="small text-muted mb-2">
                  <strong className="text-light">Director:</strong> {movie.director}
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="small text-muted mb-4">
                  <strong className="text-light">Starring:</strong> {movie.cast.join(', ')}
                </div>
              )}

              <div className="d-flex gap-3">
                {movie.trailerUrl && (
                  <button
                    className="btn btn-outline-light rounded-pill px-4"
                    onClick={() => setShowTrailer(true)}
                  >
                    <i className="bi bi-play-circle me-2"></i> Watch Trailer
                  </button>
                )}
                <a href="#showtimesSection" className="btn btn-danger rounded-pill px-4 fw-semibold">
                  <i className="bi bi-ticket-perforated me-2"></i> Select Showtime
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">{movie.title} - Official Trailer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowTrailer(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={movie.trailerUrl}
                    title="Movie Trailer"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showtimes & Theaters Section */}
      <div id="showtimesSection" className="container py-5">
        <h3 className="text-white fw-bold mb-3">
          <i className="bi bi-calendar-event text-danger me-2"></i>Select Date & Showtime
        </h3>

        {/* Date Selector Pills */}
        <div className="d-flex gap-3 mb-4 overflow-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`btn px-4 py-2 rounded-3 text-start transition ${
                selectedDate === d.date
                  ? 'btn-danger shadow'
                  : 'btn-outline-secondary text-light'
              }`}
            >
              <div className="small opacity-75">{d.label}</div>
              <div className="fw-bold">{new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
            </button>
          ))}
        </div>

        {/* Showtimes List */}
        {Object.keys(showtimesByTheater).length === 0 ? (
          <div className="cinema-card p-4 text-center">
            <p className="text-muted mb-0">No showtimes available for this date. Please pick another date.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {Object.entries(showtimesByTheater).map(([theater, slots]) => (
              <div key={theater} className="cinema-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">
                      <i className="bi bi-buildings text-danger me-2"></i>{theater}
                    </h5>
                    <div className="small text-muted">
                      <i className="bi bi-geo-alt me-1"></i>{slots[0].location || 'City Center Mall'}
                    </div>
                  </div>
                  <div className="mt-2 mt-md-0">
                    <span className="badge bg-secondary bg-opacity-25 border border-secondary border-opacity-25 text-info">
                      <i className="bi bi-badge-hd me-1"></i>{slots[0].screenType || 'Digital 4K'}
                    </span>
                  </div>
                </div>

                {/* Showtime Pills */}
                <div className="d-flex flex-wrap gap-3">
                  {slots.map((slot) => {
                    const bookedCount = (slot.bookedSeats || []).length;
                    const availableCount = (slot.totalSeats || 60) - bookedCount;
                    const isSoldOut = availableCount <= 0;

                    return (
                      <button
                        key={slot._id || slot.id}
                        disabled={isSoldOut}
                        onClick={() => navigate(`/book/${slot._id || slot.id}`)}
                        className={`btn p-3 rounded-3 text-start position-relative transition ${
                          isSoldOut
                            ? 'btn-outline-secondary opacity-50'
                            : 'btn-outline-light hover-danger'
                        }`}
                        style={{ minWidth: '150px' }}
                      >
                        <div className="fw-bold fs-6 text-white">{slot.startTime}</div>
                        <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                          {slot.screenType}
                        </div>
                        <div className="mt-2 small d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                          <span className={availableCount < 10 ? 'text-danger' : 'text-success'}>
                            {isSoldOut ? 'Sold Out' : `${availableCount} seats left`}
                          </span>
                          <span className="text-warning fw-semibold">₹{slot.ticketPrice?.standard || 220}+</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
