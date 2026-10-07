const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getOverview,
  getOperations,
  getTechnicians,
  getCustomers,
  getFinance,
  getInventory
} = require('../controllers/analyticsController');

// All analytics routes require admin privileges
router.use(protect, authorize('admin'));

router.get('/overview', getOverview);
router.get('/operations', getOperations);
router.get('/technicians', getTechnicians);
router.get('/customers', getCustomers);
router.get('/finance', getFinance);
router.get('/inventory', getInventory);

module.exports = router;
