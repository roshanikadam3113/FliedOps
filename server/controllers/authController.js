const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Helper to format database/validation errors for user-friendly responses.
 * Parses MongoDB duplicate key errors and Mongoose validation errors.
 * 
 * @param {Error} error - The error object thrown during execution
 * @returns {string} - A clean, user-friendly error message
 */
const formatError = (error) => {
  // Handle MongoDB Duplicate Key Error (e.g., duplicate email)
  if (error.code === 11000) {
    if (error.keyValue && error.keyValue.email) {
      return 'An account with this email address already exists';
    }
    return 'A user with these details already exists';
  }
  // Handle Mongoose Validation Errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return messages.join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Helper to generate a JWT token for authentication.
 * 
 * @param {string} id - The user ID to encode in the payload
 * @returns {string} - The signed JWT token (valid for 30 days)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user in the system
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialty, location } = req.body;

    // 1. Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    
    // 2. Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 3. Check for existing user
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 4. Force registration role to 'customer' for security
    // (Technicians/Admins must be created via secure Admin endpoints)
    let assignedRole = 'customer';

    // 5. Create the new user record in the database
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      phone: phone || '',
      specialty: specialty || 'General Maintenance',
      location: location || 'Kolhapur',
      // If role is expanded in the future, these defaults apply
      ...(assignedRole === 'technician' ? { isActive: true, availabilityStatus: 'AVAILABLE' } : {})
    });

    // 6. Return the newly created user and a JWT token
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
          rating: user.rating,
          notificationPreferences: user.notificationPreferences
        },
        token
      });
    }
  } catch (error) {
    const statusCode = (error.code === 11000 || error.name === 'ValidationError') ? 400 : 500;
    res.status(statusCode);
    next(new Error(formatError(error)));
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // 2. Fetch user and explicitly select the password field for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // 3. Verify password hash
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // Return user profile and token
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
          rating: user.rating,
          notificationPreferences: user.notificationPreferences
        },
        token
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    const statusCode = (error.name === 'ValidationError') ? 400 : 500;
    res.status(statusCode);
    next(new Error(formatError(error)));
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is hydrated by the authMiddleware protecting this route
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
          rating: user.rating,
          notificationPreferences: user.notificationPreferences
        }
      });
    }
    return res.status(404).json({ success: false, message: 'User profile not found' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Update user profile and/or password
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, currentPassword, newPassword, notificationPreferences } = req.body;
    const userId = req.user._id;

    // Fetch user with password to allow for password change validation
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 1. Update basic profile fields if provided
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    
    // 2. Deep merge notification preferences
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    // 3. Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide your current password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
      }
      user.password = newPassword;
    }

    // 4. Save changes to DB
    await user.save();

    // 5. Return updated profile
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
        rating: user.rating,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
