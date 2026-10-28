const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with automatic fallback to in-memory store if offline)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
  const { getMongoStatus } = require('./config/db');
  res.json({
    status: 'ONLINE',
    platform: 'IMovies Cinema Platform API',
    version: '1.0.0',
    databaseMode: getMongoStatus() ? 'MongoDB Cluster' : 'In-Memory High-Speed Store',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('IMovies Cinema Reservation API is running. Access API endpoints at /api/*');
});

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    message: 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  🎬 IMovies Backend Server running on port ${PORT}`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  🎟️  API Base:     http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
