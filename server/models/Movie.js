const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Movie synopsis/description is required'],
  },
  genre: {
    type: [String],
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: 'English',
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  rating: {
    type: Number, // 0 - 10
    default: 8.5,
  },
  certificate: {
    type: String, // U/A, A, PG-13, R
    default: 'UA 16+',
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  backdropUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  director: {
    type: String,
    default: '',
  },
  cast: {
    type: [String],
    default: [],
  },
  isNowShowing: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
