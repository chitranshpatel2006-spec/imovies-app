const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const Showtime = require('../models/Showtime');
const memoryStore = require('../config/inMemoryStore');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/showtimes/movie/:movieId
// @desc    Get showtimes for a specific movie with optional date filter
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    if (getMongoStatus()) {
      let query = { movieId };
      if (date) query.date = date;
      const showtimes = await Showtime.find(query).sort({ date: 1, startTime: 1 });
      return res.json(showtimes);
    } else {
      const showtimes = memoryStore.getShowtimesForMovie(movieId, date);
      return res.json(showtimes);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving showtimes', error: err.message });
  }
});

// @route   GET /api/showtimes/:id
// @desc    Get specific showtime details (including seat availability)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const showtime = await Showtime.findById(id).populate('movieId');
      if (!showtime) {
        return res.status(404).json({ message: 'Showtime not found' });
      }
      return res.json(showtime);
    } else {
      const showtime = memoryStore.getShowtimeById(id);
      if (!showtime) {
        return res.status(404).json({ message: 'Showtime not found' });
      }
      return res.json(showtime);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching showtime', error: err.message });
  }
});

// @route   POST /api/showtimes
// @desc    Add a new showtime (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { movieId, theaterName, location, screenType, date, startTime, ticketPrice, totalSeats } = req.body;

    if (!movieId || !date || !startTime) {
      return res.status(400).json({ message: 'Movie, date, and startTime are required.' });
    }

    const payload = {
      movieId,
      theaterName: theaterName || 'IMovies Cineplex - Screen 1',
      location: location || 'Metropolis Mall, City Center',
      screenType: screenType || 'IMAX Laser 3D',
      date,
      startTime,
      ticketPrice: ticketPrice || { standard: 220, premium: 320, vip: 450 },
      totalSeats: totalSeats || 60,
      bookedSeats: [],
    };

    if (getMongoStatus()) {
      const showtime = new Showtime(payload);
      await showtime.save();
      return res.status(201).json(showtime);
    } else {
      const showtime = memoryStore.createShowtime(payload);
      return res.status(201).json(showtime);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating showtime', error: err.message });
  }
});

// @route   DELETE /api/showtimes/:id
// @desc    Delete a showtime (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getMongoStatus()) {
      const resS = await Showtime.findByIdAndDelete(id);
      deleted = !!resS;
    } else {
      deleted = memoryStore.deleteShowtime(id);
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json({ message: 'Showtime removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting showtime', error: err.message });
  }
});

module.exports = router;
