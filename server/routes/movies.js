const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const Movie = require('../models/Movie');
const memoryStore = require('../config/inMemoryStore');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/movies
// @desc    Get all movies with optional filter & search
router.get('/', async (req, res) => {
  try {
    const { genre, search, language, nowShowing } = req.query;

    if (getMongoStatus()) {
      let query = {};
      if (genre) query.genre = { $in: [new RegExp(genre, 'i')] };
      if (language) query.language = new RegExp(language, 'i');
      if (nowShowing !== undefined) query.isNowShowing = nowShowing === 'true';
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const movies = await Movie.find(query).sort({ releaseDate: -1 });
      return res.json(movies);
    } else {
      let movies = memoryStore.getMovies({ genre, search });
      if (language) {
        movies = movies.filter((m) => m.language.toLowerCase() === language.toLowerCase());
      }
      if (nowShowing !== undefined) {
        const flag = nowShowing === 'true';
        movies = movies.filter((m) => Boolean(m.isNowShowing) === flag);
      }
      return res.json(movies);
    }
  } catch (err) {
    console.error('Fetch movies error:', err);
    res.status(500).json({ message: 'Error retrieving movies', error: err.message });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let movie;
    if (getMongoStatus()) {
      movie = await Movie.findById(id);
    } else {
      movie = memoryStore.getMovieById(id);
    }

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie details', error: err.message });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      language,
      duration,
      rating,
      certificate,
      releaseDate,
      posterUrl,
      backdropUrl,
      trailerUrl,
      director,
      cast,
      isNowShowing,
    } = req.body;

    if (!title || !description || !posterUrl) {
      return res.status(400).json({ message: 'Title, description, and posterUrl are required.' });
    }

    const movieData = {
      title,
      description,
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map((g) => g.trim()) : ['General']),
      language: language || 'English',
      duration: Number(duration) || 120,
      rating: Number(rating) || 8.0,
      certificate: certificate || 'U/A',
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      trailerUrl: trailerUrl || '',
      director: director || '',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map((c) => c.trim()) : []),
      isNowShowing: isNowShowing !== undefined ? Boolean(isNowShowing) : true,
    };

    if (getMongoStatus()) {
      const movie = new Movie(movieData);
      await movie.save();
      return res.status(201).json(movie);
    } else {
      const movie = memoryStore.createMovie(movieData);
      return res.status(201).json(movie);
    }
  } catch (err) {
    console.error('Create movie error:', err);
    res.status(500).json({ message: 'Error creating movie', error: err.message });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let updated;
    if (getMongoStatus()) {
      updated = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updated = memoryStore.updateMovie(id, req.body);
    }

    if (!updated) {
      return res.status(404).json({ message: 'Movie not found for update' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating movie', error: err.message });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;
    if (getMongoStatus()) {
      const resM = await Movie.findByIdAndDelete(id);
      deleted = !!resM;
    } else {
      deleted = memoryStore.deleteMovie(id);
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found for deletion' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting movie', error: err.message });
  }
});

module.exports = router;
