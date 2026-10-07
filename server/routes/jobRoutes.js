const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  createJobRequest,
  getCustomerJobs,
  getJobById,
  cancelJobRequest,
  rescheduleJobRequest
} = require('../controllers/requestController');

const {
  getTechnicianJobs,
  acceptJob,
  updateJobStatus,
  completeJob
} = require('../controllers/jobController');

const { payInvoice } = require('../controllers/invoiceController');
const { submitReview } = require('../controllers/reviewController');
// Technician operational routes (must be before /:id routes to prevent parameter capturing)
router.get('/tech-jobs', protect, authorize('technician'), getTechnicianJobs);

// Customer routes
router.post('/create', protect, authorize('customer'), createJobRequest);
router.get('/my-jobs', protect, authorize('customer'), getCustomerJobs);
router.get('/:id', protect, getJobById); // Mixed access, checked in controller
router.put('/:id/cancel', protect, authorize('customer'), cancelJobRequest);
router.put('/:id/reschedule', protect, authorize('customer'), rescheduleJobRequest);
router.put('/:id/pay', protect, authorize('customer'), payInvoice);
router.put('/:id/review', protect, authorize('customer'), submitReview);

// Other Technician operational routes with /:id
router.put('/:id/accept', protect, authorize('technician'), acceptJob);
router.put('/:id/status', protect, authorize('technician'), updateJobStatus);
router.put('/:id/complete', protect, authorize('technician'), completeJob);

module.exports = router;

