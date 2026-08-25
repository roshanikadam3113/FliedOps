const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createJobRequest,
  getCustomerJobs,
  payInvoice,
  submitReview,
  getTechnicianJobs,
  acceptJob,
  updateJobStatus,
  completeJob
} = require('../controllers/jobController');

// All routes here require authentication
router.post('/create', protect, createJobRequest);
router.get('/my-jobs', protect, getCustomerJobs);
router.put('/:id/pay', protect, payInvoice);
router.put('/:id/review', protect, submitReview);

// Technician operational routes
router.get('/tech-jobs', protect, getTechnicianJobs);
router.put('/:id/accept', protect, acceptJob);
router.put('/:id/status', protect, updateJobStatus);
router.put('/:id/complete', protect, completeJob);

module.exports = router;
