const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Fast check if it's a demo token
      if (token.startsWith('demo_jwt_token_')) {
        const role = token.split('_')[3];
        const demoUsers = {
          admin: { _id: 'demo_admin_1', name: 'FieldOps Admin', email: 'admin@fieldops.com', role: 'admin', location: 'Kolhapur HQ' },
          technician: { _id: 'demo_tech_1', name: 'Rahul Sharma', email: 'rahul@fieldops.com', role: 'technician', specialty: 'AC & HVAC', rating: 4.9 },
          customer: { _id: 'demo_cust_1', name: 'Roshani Kadam', email: 'roshani@gmail.com', role: 'customer', location: 'Sector 62, Kolhapur' }
        };
        req.user = demoUsers[role] || demoUsers.customer;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fieldops_fallback_secret');
      
      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Look up in memory users
        const { inMemoryUsers } = require('../controllers/authController');
        req.user = inMemoryUsers.find(u => u._id === decoded.id);
      }
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Grant access to specific user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
