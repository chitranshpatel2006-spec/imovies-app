const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theaterName: {
    type: String,
    required: true,
    default: 'IMovies Cineplex - Screen 1',
  },
  location: {
    type: String,
    default: 'Downtown Grand Plaza',
  },
  screenType: {
    type: String, // IMAX 3D, Dolby Atmos, Standard 2D, 4DX
    default: 'IMAX Laser 3D',
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  startTime: {
    type: String, // e.g. "14:30" or "07:00 PM"
    required: true,
  },
  ticketPrice: {
    standard: { type: Number, default: 250 },
    premium: { type: Number, default: 350 },
    vip: { type: Number, default: 500 },
  },
  totalSeats: {
    type: Number,
    default: 60,
  },
  // Row A-F, Col 1-10
  bookedSeats: {
    type: [String], // Array of seat IDs like ["A1", "A2", "C5"]
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);
