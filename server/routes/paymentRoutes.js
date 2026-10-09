const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// Razorpay flows
router.post('/invoices/:id/pay', protect, authorize('customer'), createOrder);
router.post('/verify', protect, authorize('customer'), verifyPayment);

module.exports = router;
