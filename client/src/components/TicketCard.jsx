import React from 'react';

const TicketCard = ({ booking, onCancel }) => {
  const movie = booking.movieId || booking.movieDetails || {};
  const showtime = booking.showtimeId || booking.showtimeDetails || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-container p-4 mx-auto mb-4" style={{ maxWidth: '620px' }}>
      {/* Top Banner Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4">🎬</span>
          <span className="fw-bold brand-font text-white letter-spacing-1">
            <span className="text-danger">I</span>Movies Pass
          </span>
        </div>
        <span
          className={`badge px-3 py-2 rounded-pill fw-semibold ${
            booking.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'
          }`}
        >
          <i
            className={`bi ${
              booking.status === 'CONFIRMED' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'
            } me-1`}
          ></i>
          {booking.status}
        </span>
      </div>

      {/* Movie Main Info */}
      <div className="row g-3 align-items-center">
        <div className="col-4 col-sm-3">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80'}
            alt={movie.title}
            className="img-fluid rounded-3 shadow"
            style={{ objectFit: 'cover', height: '140px', width: '100%' }}
          />
        </div>
        <div className="col-8 col-sm-9">
          <h5 className="text-white fw-bold mb-1">{movie.title || 'Cinema Premiere'}</h5>
          <div className="small text-danger fw-semibold mb-2">
            {showtime.screenType || 'IMAX Laser 3D'} • {movie.language || 'English'}
          </div>
          <div className="small text-muted mb-1">
            <i className="bi bi-geo-alt text-danger me-1"></i>
            {showtime.theaterName || 'IMovies Cineplex'}
          </div>
          <div className="small text-muted">
            <i className="bi bi-pin-map me-1"></i>
            {showtime.location || 'Metropolis Center'}
          </div>
        </div>
      </div>

      {/* Perforated separator */}
      <div className="ticket-perforation"></div>

      {/* Ticket Details Grid */}
      <div className="row g-3 small text-muted mb-3">
        <div className="col-6 col-sm-3">
          <div className="text-uppercase fw-semibold text-secondary" style={{ fontSize: '0.7rem' }}>DATE</div>
          <div className="text-light fw-bold fs-6">{showtime.date || 'Today'}</div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="text-uppercase fw-semibold text-secondary" style={{ fontSize: '0.7rem' }}>SHOWTIME</div>
          <div className="text-light fw-bold fs-6">{showtime.startTime || '07:00 PM'}</div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="text-uppercase fw-semibold text-secondary" style={{ fontSize: '0.7rem' }}>SEATS</div>
          <div className="text-warning fw-bold fs-6">
            {booking.seats ? booking.seats.map((s) => s.seatId).join(', ') : 'N/A'}
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="text-uppercase fw-semibold text-secondary" style={{ fontSize: '0.7rem' }}>TOTAL PAID</div>
          <div className="text-white fw-bold fs-6">₹{booking.totalAmount}</div>
        </div>
      </div>

      {/* Reference & Barcode / QR Simulation */}
      <div className="bg-dark bg-opacity-50 p-3 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border border-secondary border-opacity-25">
        <div>
          <div className="text-uppercase text-secondary fw-semibold" style={{ fontSize: '0.7rem' }}>
            BOOKING REFERENCE ID
          </div>
          <div className="text-white fw-mono fs-5 fw-bold letter-spacing-2">
            {booking.bookingReference}
          </div>
          <div className="text-muted small mt-1">
            Booked on {new Date(booking.bookingDate).toLocaleDateString()}
          </div>
        </div>

        {/* QR Code SVG */}
        <div className="d-flex align-items-center gap-2 bg-white p-2 rounded">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="#000000">
            {/* Simulated Clean QR Code Pattern */}
            <rect x="0" y="0" width="30" height="30" fill="#000"/>
            <rect x="5" y="5" width="20" height="20" fill="#fff"/>
            <rect x="10" y="10" width="10" height="10" fill="#000"/>

            <rect x="70" y="0" width="30" height="30" fill="#000"/>
            <rect x="75" y="5" width="20" height="20" fill="#fff"/>
            <rect x="80" y="10" width="10" height="10" fill="#000"/>

            <rect x="0" y="70" width="30" height="30" fill="#000"/>
            <rect x="5" y="75" width="20" height="20" fill="#fff"/>
            <rect x="10" y="80" width="10" height="10" fill="#000"/>

            <rect x="35" y="10" width="8" height="8" fill="#000"/>
            <rect x="50" y="15" width="8" height="8" fill="#000"/>
            <rect x="35" y="35" width="12" height="12" fill="#000"/>
            <rect x="55" y="40" width="10" height="10" fill="#000"/>
            <rect x="75" y="55" width="8" height="8" fill="#000"/>
            <rect x="35" y="70" width="10" height="10" fill="#000"/>
            <rect x="55" y="75" width="15" height="10" fill="#000"/>
          </svg>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
        <button onClick={handlePrint} className="btn btn-outline-light btn-sm rounded-pill px-3">
          <i className="bi bi-printer me-1"></i> Print / Save Ticket
        </button>

        {booking.status === 'CONFIRMED' && onCancel && (
          <button
            onClick={() => onCancel(booking._id || booking.id)}
            className="btn btn-outline-danger btn-sm rounded-pill px-3"
          >
            <i className="bi bi-x-circle me-1"></i> Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
