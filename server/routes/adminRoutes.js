const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getOverview,
  getCustomers,
  getCustomerById,
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnicianStatus,
  getServiceRequests,
  getJobs,
  assignJob,
  getAdminInvoices
} = require('../controllers/adminController');

// All Admin routes are protected and restricted to 'admin' role
router.use(protect);
router.use(authorize('admin'));

// Admin Overview
router.get('/overview', getOverview);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

// Technicians
router.post('/technicians', createTechnician);
router.get('/technicians', getTechnicians);
router.get('/technicians/:id', getTechnicianById);
router.patch('/technicians/:id/status', updateTechnicianStatus);

// Requests & Jobs
router.get('/requests', getServiceRequests);
router.get('/jobs', getJobs);
router.patch('/jobs/:id/assign', assignJob);

// Invoices
router.get('/invoices', getAdminInvoices);

module.exports = router;
