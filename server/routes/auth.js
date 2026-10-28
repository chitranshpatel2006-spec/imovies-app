const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getMongoStatus } = require('../config/db');
const User = require('../models/User');
const memoryStore = require('../config/inMemoryStore');
const { auth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026_secured';

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (getMongoStatus()) {
      let existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
      });
      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      });
    } else {
      // In-memory mode
      const existingUser = memoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = memoryStore.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    let user;
    if (getMongoStatus()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = memoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in user info
router.get('/me', auth, async (req, res) => {
  try {
    let user;
    if (getMongoStatus()) {
      user = await User.findById(req.user.id).select('-password');
    } else {
      user = memoryStore.findUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

module.exports = router;
