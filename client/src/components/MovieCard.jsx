import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="card cinema-card h-100">
      <div className="movie-poster-wrap">
        <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge badge-rating px-2 py-1 rounded-pill small">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {movie.rating ? movie.rating.toFixed(1) : '8.5'}
          </span>
        </div>
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-danger bg-opacity-90 px-2 py-1 rounded small">
            {movie.certificate || 'UA'}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title text-white fw-bold mb-1 text-truncate" title={movie.title}>
          {movie.title}
        </h6>

        <div className="d-flex align-items-center gap-2 small text-muted mb-2">
          <span><i className="bi bi-clock me-1"></i>{movie.duration} min</span>
          <span>•</span>
          <span>{movie.language}</span>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {movie.genre && movie.genre.slice(0, 2).map((g, idx) => (
            <span key={idx} className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 small">
              {g}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <Link to={`/movie/${movie._id || movie.id}`} className="btn btn-danger w-100 btn-sm rounded-pill fw-semibold">
            <i className="bi bi-ticket-perforated me-1"></i> Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
