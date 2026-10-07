const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getInvoices,
  getInvoiceById
} = require('../controllers/invoiceController');

// All invoice routes are protected
router.use(protect);

// Customer routes
router.get('/', authorize('customer'), getInvoices);
router.get('/:id', authorize('customer'), getInvoiceById);

module.exports = router;
