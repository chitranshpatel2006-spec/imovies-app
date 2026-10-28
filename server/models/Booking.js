const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // e.g. "C4"
  row: { type: String, required: true },     // e.g. "C"
  number: { type: Number, required: true },  // e.g. 4
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'premium',
  },
  price: { type: Number, required: true },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  seats: [seatSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  convenienceFee: {
    type: Number,
    default: 40,
  },
  tax: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
