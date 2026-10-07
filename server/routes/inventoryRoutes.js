const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getInventory,
  getPartById,
  createPart,
  updatePart,
  adjustStock,
  getTransactions,
  getAvailableParts,
  addPartToJob
} = require('../controllers/inventoryController');

// All routes are protected
router.use(protect);

// TECHNICIAN ROUTES
router.get('/available', authorize('technician', 'admin'), getAvailableParts);
router.post('/job/:jobId/add-part', authorize('technician'), addPartToJob);

// ADMIN ROUTES
router.get('/', authorize('admin'), getInventory);
router.get('/transactions', authorize('admin'), getTransactions);
router.get('/:id', authorize('admin'), getPartById);
router.post('/', authorize('admin'), createPart);
router.patch('/:id', authorize('admin'), updatePart);
router.patch('/:id/stock', authorize('admin'), adjustStock);

module.exports = router;
