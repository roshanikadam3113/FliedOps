const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createCheckoutSession } = require('../controllers/paymentController');

router.post('/invoices/:id/pay', protect, authorize('customer'), createCheckoutSession);

module.exports = router;
