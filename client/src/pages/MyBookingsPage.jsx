import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketCard from '../components/TicketCard';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      setError('Failed to fetch your bookings list.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your reserved seats.')) {
      return;
    }
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <div>
          <h2 className="text-white fw-bold mb-1">
            <i className="bi bi-ticket-perforated text-danger me-2"></i>My Bookings & Passes
          </h2>
          <p className="text-muted small mb-0">View, download, or manage your cinema reservations</p>
        </div>
        <Link to="/movies" className="btn btn-outline-danger btn-sm rounded-pill px-3">
          <i className="bi bi-plus-lg me-1"></i> Book Another Movie
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading your tickets...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="cinema-card text-center p-5 my-4">
          <div className="fs-1 text-muted mb-3">
            <i className="bi bi-ticket-detailed"></i>
          </div>
          <h4 className="text-white fw-bold">No Bookings Found</h4>
          <p className="text-muted small mb-4">
            You haven't reserved any movie tickets yet. Explore movies now showing!
          </p>
          <Link to="/movies" className="btn btn-danger rounded-pill px-4">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {bookings.map((booking) => (
            <TicketCard
              key={booking._id || booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
