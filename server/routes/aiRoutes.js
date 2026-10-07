const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getInventoryForecasts,
  getTechnicianRecommendations,
  getServiceInsights
} = require('../controllers/aiController');

// All AI endpoints are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/inventory-forecast', getInventoryForecasts);
router.get('/technician-recommendations/:requestId', getTechnicianRecommendations);
router.get('/service-insights', getServiceInsights);

module.exports = router;
