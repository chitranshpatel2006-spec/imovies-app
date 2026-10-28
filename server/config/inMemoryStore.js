const bcrypt = require('bcryptjs');

// Pre-generated seed data for standalone operation
const initialUsers = [
  {
    _id: 'u10000000000000000000001',
    name: 'Admin Director',
    email: 'admin@imovies.com',
    // password: password123
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    phone: '+1 555-0199',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'u20000000000000000000002',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    // password: password123
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    phone: '+1 555-0142',
    createdAt: new Date().toISOString(),
  },
];

const initialMovies = [
  {
    _id: 'm10000000000000000000001',
    title: 'Interstellar: Beyond Horizons',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    rating: 8.9,
    certificate: 'UA 13+',
    releaseDate: '2026-10-15',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    isNowShowing: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'm20000000000000000000002',
    title: 'Cyber City: Neo Tokyo 2099',
    description: 'In a dystopian metropolis ruled by synthetic conglomerates, a rogue digital detective uncovers a conspiracy that threatens to rewrite human consciousness.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 142,
    rating: 8.6,
    certificate: 'A 18+',
    releaseDate: '2026-10-20',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Ana de Armas', 'Harrison Ford', 'Sylvia Hoeks'],
    isNowShowing: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'm30000000000000000000003',
    title: 'Shadow of the Colossus',
    description: 'An ancient warrior journeys through a forgotten continent with his loyal steed to challenge sixteen titanic beasts in order to resurrect a lost maiden.',
    genre: ['Fantasy', 'Adventure', 'Mythology'],
    language: 'English',
    duration: 155,
    rating: 8.8,
    certificate: 'UA 16+',
    releaseDate: '2026-10-18',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/41PTANtZFW0',
    director: 'Guillermo del Toro',
    cast: ['Alexander Skarsgård', 'Anya Taylor-Joy', 'Willem Dafoe'],
    isNowShowing: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'm40000000000000000000004',
    title: 'The Crimson Symphony',
    description: 'A prodigy violinist unravels a century-old murder mystery encoded within the lost scores of an eccentric Italian maestro.',
    genre: ['Mystery', 'Drama', 'Music'],
    language: 'English',
    duration: 128,
    rating: 8.2,
    certificate: 'U/A',
    releaseDate: '2026-10-22',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/8hP9D6kZseM',
    director: 'Damien Chazelle',
    cast: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser'],
    isNowShowing: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'm50000000000000000000005',
    title: 'Galactic Horizon: Odyssey',
    description: 'The first manned expedition into the Andromeda galaxy discovers remnants of a civilization that transcended the physical realm million years ago.',
    genre: ['Sci-Fi', 'Space', 'Thriller'],
    language: 'English',
    duration: 160,
    rating: 8.7,
    certificate: 'UA 13+',
    releaseDate: '2026-11-05',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/2LqzF5WauAw',
    director: 'Ridley Scott',
    cast: ['Matt Damon', 'Jessica Chastain', 'Kristen Wiig'],
    isNowShowing: false, // Upcoming
    createdAt: new Date().toISOString(),
  },
];

// Today and upcoming dates in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

const initialShowtimes = [
  // Interstellar
  {
    _id: 's10000000000000000000001',
    movieId: 'm10000000000000000000001',
    theaterName: 'IMovies Cineplex - Audi 1 (Laser IMAX)',
    location: 'Metropolis Mall, City Center',
    screenType: 'IMAX Laser 3D',
    date: today,
    startTime: '10:30 AM',
    ticketPrice: { standard: 220, premium: 320, vip: 450 },
    totalSeats: 60,
    bookedSeats: ['A3', 'A4', 'B5', 'C6', 'D7'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 's10000000000000000000002',
    movieId: 'm10000000000000000000001',
    theaterName: 'IMovies Cineplex - Audi 1 (Laser IMAX)',
    location: 'Metropolis Mall, City Center',
    screenType: 'IMAX Laser 3D',
    date: today,
    startTime: '02:45 PM',
    ticketPrice: { standard: 240, premium: 350, vip: 500 },
    totalSeats: 60,
    bookedSeats: ['C1', 'C2', 'E4', 'E5'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 's10000000000000000000003',
    movieId: 'm10000000000000000000001',
    theaterName: 'IMovies Prime - Audi 4 (Dolby 7.1)',
    location: 'Grand Galleria, West Wing',
    screenType: 'Dolby Atmos 4K',
    date: today,
    startTime: '07:15 PM',
    ticketPrice: { standard: 260, premium: 380, vip: 550 },
    totalSeats: 60,
    bookedSeats: ['B1', 'B2', 'B3', 'F5', 'F6'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 's10000000000000000000004',
    movieId: 'm10000000000000000000001',
    theaterName: 'IMovies Cineplex - Audi 1 (Laser IMAX)',
    location: 'Metropolis Mall, City Center',
    screenType: 'IMAX Laser 3D',
    date: tomorrow,
    startTime: '01:00 PM',
    ticketPrice: { standard: 220, premium: 320, vip: 450 },
    totalSeats: 60,
    bookedSeats: [],
    createdAt: new Date().toISOString(),
  },
  // Cyber City
  {
    _id: 's20000000000000000000001',
    movieId: 'm20000000000000000000002',
    theaterName: 'IMovies Prime - Audi 2 (4DX Motion)',
    location: 'Grand Galleria, West Wing',
    screenType: '4DX Motion Cinema',
    date: today,
    startTime: '11:15 AM',
    ticketPrice: { standard: 280, premium: 390, vip: 550 },
    totalSeats: 60,
    bookedSeats: ['D1', 'D2', 'D3'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 's20000000000000000000002',
    movieId: 'm20000000000000000000002',
    theaterName: 'IMovies Cineplex - Audi 3',
    location: 'Metropolis Mall, City Center',
    screenType: 'Dolby Atmos 4K',
    date: today,
    startTime: '06:00 PM',
    ticketPrice: { standard: 240, premium: 340, vip: 480 },
    totalSeats: 60,
    bookedSeats: ['A1', 'A2'],
    createdAt: new Date().toISOString(),
  },
  // Shadow of the Colossus
  {
    _id: 's30000000000000000000001',
    movieId: 'm30000000000000000000003',
    theaterName: 'IMovies Cineplex - Audi 2',
    location: 'Metropolis Mall, City Center',
    screenType: 'Dolby Atmos 4K',
    date: today,
    startTime: '03:30 PM',
    ticketPrice: { standard: 200, premium: 300, vip: 420 },
    totalSeats: 60,
    bookedSeats: ['B6', 'B7'],
    createdAt: new Date().toISOString(),
  },
  // The Crimson Symphony
  {
    _id: 's40000000000000000000001',
    movieId: 'm40000000000000000000004',
    theaterName: 'IMovies Prime - Audi 3',
    location: 'Grand Galleria, West Wing',
    screenType: 'Dolby Atmos 4K',
    date: today,
    startTime: '05:00 PM',
    ticketPrice: { standard: 210, premium: 310, vip: 440 },
    totalSeats: 60,
    bookedSeats: [],
    createdAt: new Date().toISOString(),
  },
];

const initialBookings = [
  {
    _id: 'b10000000000000000000001',
    bookingReference: 'IMV-849201',
    userId: 'u20000000000000000000002',
    movieId: 'm10000000000000000000001',
    showtimeId: 's10000000000000000000001',
    seats: [
      { seatId: 'A3', row: 'A', number: 3, type: 'vip', price: 450 },
      { seatId: 'A4', row: 'A', number: 4, type: 'vip', price: 450 },
    ],
    subtotal: 900,
    convenienceFee: 40,
    tax: 45,
    totalAmount: 985,
    status: 'CONFIRMED',
    bookingDate: new Date(Date.now() - 3600000).toISOString(),
  },
];

class InMemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.movies = [...initialMovies];
    this.showtimes = [...initialShowtimes];
    this.bookings = [...initialBookings];
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.users.find((u) => u._id === id || u.id === id);
  }
  createUser(userData) {
    const newUser = {
      _id: 'u' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8),
      role: 'user',
      createdAt: new Date().toISOString(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Movies
  getMovies(filter = {}) {
    let list = [...this.movies];
    if (filter.genre) {
      list = list.filter((m) => m.genre.some((g) => g.toLowerCase() === filter.genre.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return list;
  }
  getMovieById(id) {
    return this.movies.find((m) => m._id === id || m.id === id);
  }
  createMovie(data) {
    const newMovie = {
      _id: 'm' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8),
      createdAt: new Date().toISOString(),
      rating: 8.5,
      ...data,
    };
    this.movies.unshift(newMovie);
    return newMovie;
  }
  updateMovie(id, data) {
    const index = this.movies.findIndex((m) => m._id === id || m.id === id);
    if (index === -1) return null;
    this.movies[index] = { ...this.movies[index], ...data };
    return this.movies[index];
  }
  deleteMovie(id) {
    const index = this.movies.findIndex((m) => m._id === id || m.id === id);
    if (index === -1) return false;
    this.movies.splice(index, 1);
    return true;
  }

  // Showtimes
  getShowtimesForMovie(movieId, date) {
    return this.showtimes.filter((s) => {
      const matchMovie = (s.movieId === movieId || (s.movieId._id && s.movieId._id === movieId));
      if (!matchMovie) return false;
      if (date && s.date !== date) return false;
      return true;
    });
  }
  getShowtimeById(id) {
    const st = this.showtimes.find((s) => s._id === id || s.id === id);
    if (!st) return null;
    const movie = this.getMovieById(st.movieId);
    return { ...st, movieId: movie || st.movieId };
  }
  createShowtime(data) {
    const newShowtime = {
      _id: 's' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8),
      bookedSeats: [],
      totalSeats: 60,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.showtimes.push(newShowtime);
    return newShowtime;
  }
  deleteShowtime(id) {
    const index = this.showtimes.findIndex((s) => s._id === id || s.id === id);
    if (index === -1) return false;
    this.showtimes.splice(index, 1);
    return true;
  }

  // Bookings
  createBooking({ userId, movieId, showtimeId, seats, subtotal, convenienceFee, tax, totalAmount }) {
    const showtime = this.showtimes.find((s) => s._id === showtimeId || s.id === showtimeId);
    if (!showtime) throw new Error('Showtime not found');

    const seatIds = seats.map((s) => s.seatId);
    const alreadyBooked = seatIds.some((sId) => showtime.bookedSeats.includes(sId));
    if (alreadyBooked) {
      throw new Error('One or more selected seats have already been booked by another user');
    }

    // Add to showtime booked seats
    showtime.bookedSeats.push(...seatIds);

    const ref = 'IMV-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      _id: 'b' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8),
      bookingReference: ref,
      userId,
      movieId,
      showtimeId,
      seats,
      subtotal,
      convenienceFee: convenienceFee || 40,
      tax: tax || 0,
      totalAmount,
      status: 'CONFIRMED',
      bookingDate: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);
    return this.populateBooking(newBooking);
  }

  populateBooking(b) {
    const movie = this.getMovieById(b.movieId);
    const showtime = this.getShowtimeById(b.showtimeId);
    const user = this.findUserById(b.userId);
    return {
      ...b,
      movieDetails: movie,
      showtimeDetails: showtime,
      userDetails: user ? { name: user.name, email: user.email } : null,
    };
  }

  getUserBookings(userId) {
    return this.bookings
      .filter((b) => b.userId === userId)
      .map((b) => this.populateBooking(b));
  }

  getAllBookings() {
    return this.bookings.map((b) => this.populateBooking(b));
  }

  cancelBooking(bookingId, userId) {
    const booking = this.bookings.find(
      (b) => (b._id === bookingId || b.id === bookingId) && (userId ? b.userId === userId : true)
    );
    if (!booking) return null;
    if (booking.status === 'CANCELLED') return booking;

    booking.status = 'CANCELLED';
    // Free up seats in showtime
    const showtime = this.showtimes.find((s) => s._id === booking.showtimeId || s.id === booking.showtimeId);
    if (showtime) {
      const seatIds = booking.seats.map((s) => s.seatId);
      showtime.bookedSeats = showtime.bookedSeats.filter((sId) => !seatIds.includes(sId));
    }
    return this.populateBooking(booking);
  }

  getStats() {
    const totalBookings = this.bookings.length;
    const confirmedBookings = this.bookings.filter((b) => b.status === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);
    const totalMovies = this.movies.length;
    const totalShowtimes = this.showtimes.length;

    return {
      totalBookings,
      totalRevenue,
      totalTicketsSold,
      totalMovies,
      totalShowtimes,
      activeUsers: this.users.length,
    };
  }
}

const memoryStore = new InMemoryStore();
module.exports = memoryStore;
