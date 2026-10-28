const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const memoryStore = require('../config/inMemoryStore');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies_db';
  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB connected for seeding.');

    // Clear existing collections
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Seed Users
    const users = await User.insertMany(memoryStore.users);
    console.log(`Seeded ${users.length} users (Admin: admin@imovies.com / password123, User: alex@example.com / password123)`);

    // 2. Seed Movies
    const movies = await Movie.insertMany(memoryStore.movies);
    console.log(`Seeded ${movies.length} movies.`);

    // 3. Seed Showtimes
    const showtimes = await Showtime.insertMany(memoryStore.showtimes);
    console.log(`Seeded ${showtimes.length} showtimes.`);

    // 4. Seed Bookings
    const bookings = await Booking.insertMany(memoryStore.bookings);
    console.log(`Seeded ${bookings.length} initial bookings.`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
