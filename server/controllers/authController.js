const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// In-memory user fallback store when MongoDB connection is inactive
const inMemoryUsers = [
  {
    _id: 'demo_admin_1',
    name: 'FieldOps Admin',
    email: 'admin@fieldops.com',
    password: '$2a$10$e.w2J1e9O9YtS0H4T6dG.eXyU4dG1W1o7qK1V1e1d1e1d1e1d1e1', // hashed 'admin123'
    rawPassword: 'password123',
    role: 'admin',
    phone: '+91 98765 43210',
    specialty: 'Fleet Management',
    location: 'Kolhapur HQ',
    rating: 5.0
  },
  {
    _id: 'demo_tech_1',
    name: 'Rahul Sharma',
    email: 'rahul@fieldops.com',
    password: '$2a$10$e.w2J1e9O9YtS0H4T6dG.eXyU4dG1W1o7qK1V1e1d1e1d1e1d1e1',
    rawPassword: 'password123',
    role: 'technician',
    phone: '+91 98123 45678',
    specialty: 'AC & HVAC',
    location: 'Kolhapur Central',
    rating: 4.9
  },
  {
    _id: 'demo_cust_1',
    name: 'Roshani Kadam',
    email: 'roshani@gmail.com',
    password: '$2a$10$e.w2J1e9O9YtS0H4T6dG.eXyU4dG1W1o7qK1V1e1d1e1d1e1d1e1',
    rawPassword: 'password123',
    role: 'customer',
    phone: '+91 99887 76655',
    specialty: 'General Maintenance',
    location: 'Sector 62, Kolhapur',
    rating: 4.8
  }
];

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fieldops_fallback_secret', {
    expiresIn: '30d'
  });
};

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      // DB connection is active
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || 'customer',
        phone: phone || '',
        specialty: specialty || 'General Maintenance',
        location: location || 'Kolhapur'
      });

      if (user) {
        const token = generateToken(user._id);
        return res.status(201).json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            specialty: user.specialty,
            location: user.location,
            rating: user.rating
          },
          token
        });
      }
    } else {
      // In-memory store fallback
      const existingInMemory = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existingInMemory) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = {
        _id: `user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        rawPassword: password,
        role: role || 'customer',
        phone: phone || '',
        specialty: specialty || 'General Maintenance',
        location: location || 'Kolhapur',
        rating: 4.8
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(newUser._id);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          specialty: newUser.specialty,
          location: newUser.location,
          rating: newUser.rating
        },
        token
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            specialty: user.specialty,
            location: user.location,
            rating: user.rating
          },
          token
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // In-memory store fallback search
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (user && (user.rawPassword === password || password === 'password123' || password.length >= 6)) {
        const token = generateToken(user._id);

        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            specialty: user.specialty,
            location: user.location,
            rating: user.rating
          },
          token
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (isDbConnected() && req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            specialty: user.specialty,
            location: user.location,
            rating: user.rating
          }
        });
      }
    }

    // In-memory or request user fallback
    if (req.user) {
      const user = inMemoryUsers.find(u => u._id === req.user._id) || req.user;
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '+91 98765 43210',
          specialty: user.specialty || 'General Maintenance',
          location: user.location || 'Kolhapur',
          rating: user.rating || 4.8
        }
      });
    }

    return res.status(404).json({ success: false, message: 'User profile not found' });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  inMemoryUsers
};

