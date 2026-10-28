import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMatrix from '../components/SeatMatrix';

const MAX_SEATS = 6;
const CONVENIENCE_FEE = 40;
const TAX_RATE = 0.05; // 5% GST

const SeatBookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowtimeDetails();
  }, [showtimeId]);

  const fetchShowtimeDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/showtimes/${showtimeId}`);
      setShowtime(res.data);
    } catch (err) {
      console.error('Failed to load showtime:', err);
      setError('Unable to load showtime details.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seatObj) => {
    const exists = selectedSeats.some((s) => s.seatId === seatObj.seatId);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seatObj.seatId));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        alert(`You can select up to ${MAX_SEATS} seats per transaction.`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatObj]);
    }
  };

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const totalAmount = selectedSeats.length > 0 ? subtotal + CONVENIENCE_FEE + tax : 0;

  const handleConfirmBooking = async () => {
    if (!user) {
      alert('Please log in or create an account to finalize your ticket reservation.');
      navigate('/login', { state: { from: `/book/${showtimeId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');

      const payload = {
        movieId: showtime.movieId._id || showtime.movieId.id || showtime.movieId,
        showtimeId: showtime._id || showtime.id,
        seats: selectedSeats,
        subtotal,
        convenienceFee: CONVENIENCE_FEE,
        tax,
        totalAmount,
      };

      const res = await api.post('/bookings', payload);
      navigate(`/confirmation/${res.data._id || res.data.id}`);
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Booking transaction failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading seats...</span>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white">Showtime Not Found</h4>
        <Link to="/movies" className="btn btn-danger mt-3">Back to Movies</Link>
      </div>
    );
  }

  const movie = showtime.movieId || {};

  return (
    <div className="container py-4">
      {/* Top Breadcrumb & Info */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <Link to={`/movie/${movie._id || movie.id}`} className="text-muted small text-decoration-none mb-1 d-inline-block">
            <i className="bi bi-chevron-left me-1"></i> Back to Movie
          </Link>
          <h3 className="text-white fw-bold mb-1">{movie.title || 'Selected Movie'}</h3>
          <div className="small text-danger fw-semibold">
            {showtime.theaterName} • {showtime.screenType}
          </div>
        </div>

        <div className="mt-3 mt-md-0 text-md-end">
          <div className="text-light fw-bold fs-5">
            <i className="bi bi-calendar3 me-2 text-warning"></i>
            {showtime.date} at {showtime.startTime}
          </div>
          <div className="small text-muted">{showtime.location}</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="row g-4">
        {/* Left: Seat Matrix */}
        <div className="col-12 col-lg-8">
          <div className="cinema-card p-4">
            <h5 className="text-white fw-bold mb-1 text-center">Select Your Seats</h5>
            <p className="text-muted small text-center mb-4">Click on available seats to reserve (Max {MAX_SEATS} seats)</p>

            <SeatMatrix
              showtime={showtime}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />
          </div>
        </div>

        {/* Right: Booking Summary Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="cinema-card p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="text-white fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              <i className="bi bi-receipt text-danger me-2"></i>Booking Summary
            </h5>

            <div className="mb-3">
              <div className="small text-muted mb-1">Selected Seats ({selectedSeats.length}):</div>
              {selectedSeats.length === 0 ? (
                <div className="text-secondary small fst-italic">No seats selected yet</div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span key={s.seatId} className="badge bg-danger px-2 py-1 fs-6">
                      {s.seatId} <span className="small opacity-75">({s.type.toUpperCase()})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-secondary border-opacity-25 my-3" />

            {/* Price Breakdown */}
            <div className="small d-flex flex-column gap-2 mb-3">
              <div className="d-flex justify-content-between text-muted">
                <span>Tickets Subtotal</span>
                <span className="text-light fw-semibold">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Convenience Fee</span>
                <span className="text-light fw-semibold">₹{selectedSeats.length > 0 ? CONVENIENCE_FEE : 0}</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Integrated GST (5%)</span>
                <span className="text-light fw-semibold">₹{tax}</span>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25 my-3" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-white fw-bold fs-5">Total Payable</span>
              <span className="text-warning fw-bold fs-4">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              className="btn btn-danger w-100 py-3 rounded-3 fw-bold fs-6 shadow transition"
            >
              {bookingLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing Reservation...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2"></i>
                  Proceed to Checkout ({selectedSeats.length})
                </>
              )}
            </button>

            <div className="text-center small text-muted mt-3">
              <i className="bi bi-shield-lock me-1"></i> 100% Secure Checkout & Instant Digital Pass
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
