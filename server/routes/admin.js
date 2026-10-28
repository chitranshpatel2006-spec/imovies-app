const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const memoryStore = require('../config/inMemoryStore');
const { auth, adminOnly } = require('../middleware/auth');

// All routes here require admin access
router.use(auth, adminOnly);

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics (total revenue, bookings, movies, showtimes)
router.get('/stats', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const [totalUsers, totalMovies, totalShowtimes, bookings] = await Promise.all([
        User.countDocuments(),
        Movie.countDocuments(),
        Showtime.countDocuments(),
        Booking.find(),
      ]);

      const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

      return res.json({
        totalBookings: bookings.length,
        totalRevenue,
        totalTicketsSold,
        totalMovies,
        totalShowtimes,
        activeUsers: totalUsers,
      });
    } else {
      const stats = memoryStore.getStats();
      return res.json(stats);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admin stats', error: err.message });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all user bookings for admin management
router.get('/bookings', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const bookings = await Booking.find()
        .populate('movieId')
        .populate('showtimeId')
        .populate('userId', 'name email phone')
        .sort({ bookingDate: -1 });
      return res.json(bookings);
    } else {
      const bookings = memoryStore.getAllBookings();
      return res.json(bookings);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving all bookings', error: err.message });
  }
});

module.exports = router;
