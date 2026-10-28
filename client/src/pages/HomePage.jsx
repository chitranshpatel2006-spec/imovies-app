import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Thriller', 'Fantasy'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      const res = await api.get('/movies', { params });
      setMovies(res.data);
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMovie = movies.find((m) => m.isNowShowing) || movies[0];
  const nowShowing = movies.filter((m) => m.isNowShowing);
  const upcoming = movies.filter((m) => !m.isNowShowing);

  return (
    <div className="container py-4">
      {/* Featured Hero Banner */}
      {featuredMovie && (
        <div
          className="hero-banner shadow-lg mb-5"
          style={{
            backgroundImage: `url(${featuredMovie.backdropUrl || featuredMovie.posterUrl})`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase fw-bold letter-spacing-1">
              <i className="bi bi-fire me-1"></i> Featured Premiere
            </span>
            <h1 className="display-4 fw-black text-white mb-2">{featuredMovie.title}</h1>
            <div className="d-flex align-items-center gap-3 text-light small mb-3">
              <span className="badge bg-warning text-dark fw-bold">
                <i className="bi bi-star-fill me-1"></i>{featuredMovie.rating}
              </span>
              <span>{featuredMovie.duration} mins</span>
              <span>•</span>
              <span>{featuredMovie.language}</span>
              <span>•</span>
              <span className="text-secondary">{featuredMovie.certificate || 'UA 16+'}</span>
            </div>
            <p className="text-light text-opacity-80 line-clamp-3 mb-4" style={{ maxWidth: '520px' }}>
              {featuredMovie.description}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to={`/movie/${featuredMovie._id || featuredMovie.id}`} className="btn btn-cinema btn-lg px-4 rounded-pill">
                <i className="bi bi-ticket-perforated me-2"></i> Book Tickets Now
              </Link>
              <Link to="/movies" className="btn btn-outline-light btn-lg px-4 rounded-pill">
                <i className="bi bi-compass me-2"></i> Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter Chips */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1">
            <i className="bi bi-film text-danger me-2"></i>Now Showing in Theaters
          </h3>
          <p className="text-muted small mb-0">Select your favorite movie and reserve your preferred seats instantly</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`btn btn-sm rounded-pill px-3 transition ${
                selectedGenre === g
                  ? 'btn-danger'
                  : 'btn-outline-secondary text-light border-opacity-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
        </div>
      ) : nowShowing.length === 0 ? (
        <div className="cinema-card text-center p-5 my-4">
          <i className="bi bi-camera-reels fs-1 text-muted mb-3 d-block"></i>
          <h5 className="text-white">No movies found in this genre</h5>
          <p className="text-muted small">Try selecting another genre or view all movies.</p>
          <button className="btn btn-danger btn-sm rounded-pill" onClick={() => setSelectedGenre('All')}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
          {nowShowing.map((movie) => (
            <div key={movie._id || movie.id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Releases Section */}
      {upcoming.length > 0 && (
        <div className="mt-5 pt-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-white fw-bold mb-0">
              <i className="bi bi-hourglass-split text-warning me-2"></i>Coming Soon
            </h3>
            <Link to="/movies" className="text-danger text-decoration-none small fw-semibold">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {upcoming.map((movie) => (
              <div key={movie._id || movie.id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why IMovies Value Props */}
      <div className="row g-4 mt-5 pt-4 text-center">
        <div className="col-12 col-md-4">
          <div className="cinema-card p-4 h-100">
            <div className="fs-1 text-danger mb-3">
              <i className="bi bi-grid-3x3-gap"></i>
            </div>
            <h5 className="text-white fw-bold">Live Seat Matrix</h5>
            <p className="text-muted small mb-0">
              Interactive visual layout with real-time seat locking to guarantee your chosen view without collisions.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="cinema-card p-4 h-100">
            <div className="fs-1 text-warning mb-3">
              <i className="bi bi-shield-check"></i>
            </div>
            <h5 className="text-white fw-bold">Instant E-Ticket Passes</h5>
            <p className="text-muted small mb-0">
              Receive scannable digital passes with QR codes immediately upon confirmation with zero paperwork.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="cinema-card p-4 h-100">
            <div className="fs-1 text-info mb-3">
              <i className="bi bi-film"></i>
            </div>
            <h5 className="text-white fw-bold">Premium Audi Formats</h5>
            <p className="text-muted small mb-0">
              Experience the best in IMAX Laser, 4DX motion seats, and Dolby Atmos surround sound across screens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
