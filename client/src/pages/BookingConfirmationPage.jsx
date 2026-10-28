import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import TicketCard from '../components/TicketCard';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data);
    } catch (err) {
      console.error('Failed to load booking:', err);
      setError('Could not retrieve booking confirmation details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your reserved seats.')) {
      return;
    }
    try {
      const res = await api.post(`/bookings/${bookingId}/cancel`);
      setBooking(res.data.booking);
      alert('Booking has been cancelled and seats released.');
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading confirmation...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white mb-3">Booking Confirmation</h4>
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px' }}>
          {error || 'Booking details could not be found.'}
        </div>
        <Link to="/my-bookings" className="btn btn-outline-light mt-3">View My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div className="display-4 text-success mb-2">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h2 className="text-white fw-bold mb-1">Booking Confirmed!</h2>
        <p className="text-muted small">
          Your cinema seats have been reserved successfully. Present your digital pass at the entrance.
        </p>
      </div>

      {/* Render the Ticket Pass */}
      <TicketCard booking={booking} onCancel={handleCancel} />

      <div className="text-center mt-4 d-flex justify-content-center gap-3">
        <Link to="/my-bookings" className="btn btn-outline-light rounded-pill px-4">
          <i className="bi bi-ticket-perforated me-2"></i> View All My Tickets
        </Link>
        <Link to="/" className="btn btn-danger rounded-pill px-4">
          <i className="bi bi-house me-2"></i> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
