import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Thriller', 'Fantasy', 'Mystery'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Spanish', 'Japanese'];

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;
      if (search) params.search = search;

      const res = await api.get('/movies', { params });
      setMovies(res.data);
    } catch (err) {
      console.error('Error fetching movies catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="text-white fw-bold mb-1">Explore Cinema Catalog</h2>
        <p className="text-muted small">Search and filter movies by title, genre, and audio format</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="cinema-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-cinema border-start-0"
                placeholder="Search movies by title, director, or cast..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-cinema"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="All">All Genres</option>
              {GENRES.filter((g) => g !== 'All').map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select
              className="form-select form-cinema"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="All">All Languages</option>
              {LANGUAGES.filter((l) => l !== 'All').map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2">
            <button type="submit" className="btn btn-danger w-100 fw-semibold rounded-3">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
        <span>Showing <strong className="text-white">{movies.length}</strong> movies</span>
        {(selectedGenre !== 'All' || selectedLanguage !== 'All' || search) && (
          <button
            className="btn btn-link text-danger p-0 small text-decoration-none"
            onClick={() => {
              setSelectedGenre('All');
              setSelectedLanguage('All');
              setSearch('');
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="cinema-card text-center p-5 my-4">
          <i className="bi bi-camera-reels fs-1 text-muted mb-3 d-block"></i>
          <h4 className="text-white">No movies match your criteria</h4>
          <p className="text-muted small">Try searching with a different term or resetting the filters.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.map((movie) => (
            <div key={movie._id || movie.id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
