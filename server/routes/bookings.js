const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const memoryStore = require('../config/inMemoryStore');
const { auth } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Reserve seats and create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, showtimeId, seats, subtotal, convenienceFee, tax, totalAmount } = req.body;

    if (!movieId || !showtimeId || !seats || !seats.length) {
      return res.status(400).json({ message: 'Movie, showtime, and at least one selected seat are required.' });
    }

    if (getMongoStatus()) {
      const showtime = await Showtime.findById(showtimeId);
      if (!showtime) {
        return res.status(404).json({ message: 'Showtime not found' });
      }

      const requestedSeatIds = seats.map((s) => s.seatId);
      const conflict = requestedSeatIds.some((sId) => showtime.bookedSeats.includes(sId));
      if (conflict) {
        return res.status(400).json({ message: 'One or more selected seats have already been booked.' });
      }

      // Add to booked seats
      showtime.bookedSeats.push(...requestedSeatIds);
      await showtime.save();

      const bookingRef = 'IMV-' + Math.floor(100000 + Math.random() * 900000);
      const booking = new Booking({
        bookingReference: bookingRef,
        userId: req.user.id,
        movieId,
        showtimeId,
        seats,
        subtotal: Number(subtotal),
        convenienceFee: Number(convenienceFee) || 40,
        tax: Number(tax) || 0,
        totalAmount: Number(totalAmount),
        status: 'CONFIRMED',
      });
      await booking.save();

      const populated = await Booking.findById(booking._id)
        .populate('movieId')
        .populate('showtimeId')
        .populate('userId', 'name email phone');

      return res.status(201).json(populated);
    } else {
      try {
        const booking = memoryStore.createBooking({
          userId: req.user.id,
          movieId,
          showtimeId,
          seats,
          subtotal: Number(subtotal),
          convenienceFee: Number(convenienceFee) || 40,
          tax: Number(tax) || 0,
          totalAmount: Number(totalAmount),
        });
        return res.status(201).json(booking);
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    }
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: 'Error processing booking', error: err.message });
  }
});

// @route   GET /api/bookings/my
// @desc    Get all bookings made by the currently logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    if (getMongoStatus()) {
      const bookings = await Booking.find({ userId: req.user.id })
        .populate('movieId')
        .populate('showtimeId')
        .sort({ bookingDate: -1 });
      return res.json(bookings);
    } else {
      const bookings = memoryStore.getUserBookings(req.user.id);
      return res.json(bookings);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your bookings', error: err.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking ticket by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const booking = await Booking.findById(id)
        .populate('movieId')
        .populate('showtimeId')
        .populate('userId', 'name email phone');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check ownership unless admin
      if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to view this booking' });
      }

      return res.json(booking);
    } else {
      const booking = memoryStore.bookings.find((b) => b._id === id || b.id === id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to view this booking' });
      }
      return res.json(memoryStore.populateBooking(booking));
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving booking details', error: err.message });
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel an existing booking and release seats
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
      }

      if (booking.status === 'CANCELLED') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      booking.status = 'CANCELLED';
      await booking.save();

      // Release seats in Showtime
      const showtime = await Showtime.findById(booking.showtimeId);
      if (showtime) {
        const seatIds = booking.seats.map((s) => s.seatId);
        showtime.bookedSeats = showtime.bookedSeats.filter((sId) => !seatIds.includes(sId));
        await showtime.save();
      }

      return res.json({ message: 'Booking cancelled successfully', booking });
    } else {
      const updated = memoryStore.cancelBooking(id, req.user.role === 'admin' ? null : req.user.id);
      if (!updated) {
        return res.status(404).json({ message: 'Booking not found or not owned by user' });
      }
      return res.json({ message: 'Booking cancelled successfully', booking: updated });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
});

module.exports = router;
