const JobRequest = require('../models/JobRequest');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper to check MongoDB connection status
const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Mock In-Memory Technicians matching the Auth demo users
const demoTechnicians = {
  demo_tech_1: {
    _id: 'demo_tech_1',
    name: 'Rahul Sharma',
    email: 'rahul@fieldops.com',
    role: 'technician',
    phone: '+91 98123 45678',
    specialty: 'AC & HVAC',
    rating: 4.9
  }
};

// Pre-populated demo jobs for the customer (Roshani Kadam: demo_cust_1)
const inMemoryJobs = [
  {
    _id: 'job_demo_1',
    customer: 'demo_cust_1',
    title: 'AC Cooling Leakage & Servicing',
    description: 'AC unit in bedroom is dripping water from the indoor fan blower and not cooling efficiently.',
    category: 'AC & HVAC',
    status: 'in-progress',
    urgency: 'high',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-26 at 11:30 AM',
    technician: demoTechnicians.demo_tech_1,
    invoice: {
      amount: 1800,
      isPaid: false
    },
    review: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    _id: 'job_demo_2',
    customer: 'demo_cust_1',
    title: 'Kitchen Tap Leakage Repair',
    description: 'The kitchen sink tap is dripping constantly even when turned off tightly. Water is pooling under the cabinet.',
    category: 'Plumbing',
    status: 'completed',
    urgency: 'medium',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-24 at 09:30 AM',
    technician: demoTechnicians.demo_tech_1,
    invoice: {
      amount: 850,
      isPaid: true,
      paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    review: {
      rating: 5,
      comment: 'Excellent work by Rahul! He arrived right on time and replaced the washer in 15 minutes. Very polite.',
      createdAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    _id: 'job_demo_3',
    customer: 'demo_cust_1',
    title: 'Power Outage in Living Room Socket Line',
    description: 'A sudden spark occurred in the main TV wall socket line, now all sockets in the living room have lost power.',
    category: 'Electrical',
    status: 'pending',
    urgency: 'critical',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-25 at 04:00 PM',
    technician: null,
    invoice: {
      amount: 0,
      isPaid: false
    },
    review: null,
    createdAt: new Date()
  }
];

// @desc    Create new service request
// @route   POST /api/jobs/create
// @access  Private (Customer only)
const createJobRequest = async (req, res) => {
  try {
    const { title, description, category, urgency, location, scheduledDate } = req.body;

    if (!title || !description || !location || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const customerId = req.user._id;

    if (isDbConnected()) {
      const job = await JobRequest.create({
        customer: customerId,
        title,
        description,
        category: category || 'General Maintenance',
        urgency: urgency || 'medium',
        location,
        scheduledDate,
        invoice: { amount: 0, isPaid: false }
      });

      return res.status(201).json({ success: true, job });
    } else {
      const newJob = {
        _id: `job_${Date.now()}`,
        customer: customerId,
        title,
        description,
        category: category || 'General Maintenance',
        status: 'pending',
        urgency: urgency || 'medium',
        location,
        scheduledDate,
        technician: null,
        invoice: { amount: 0, isPaid: false },
        review: null,
        createdAt: new Date()
      };

      inMemoryJobs.push(newJob);
      return res.status(201).json({ success: true, job: newJob });
    }
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating request' });
  }
};

// @desc    Get all jobs for logged-in customer
// @route   GET /api/jobs/my-jobs
// @access  Private (Customer only)
const getCustomerJobs = async (req, res) => {
  try {
    const customerId = req.user._id;

    if (isDbConnected()) {
      const jobs = await JobRequest.find({ customer: customerId })
        .populate('technician', 'name email phone specialty rating')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, jobs });
    } else {
      // Return filtered in-memory jobs
      const jobs = inMemoryJobs
        .filter(j => j.customer === customerId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ success: true, jobs });
    }
  } catch (error) {
    console.error('Fetch customer jobs error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching service requests' });
  }
};

// @desc    Pay service request invoice (Mock checkout)
// @route   PUT /api/jobs/:id/pay
// @access  Private (Customer only)
const payInvoice = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (isDbConnected()) {
      const job = await JobRequest.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      job.invoice.isPaid = true;
      job.invoice.paidAt = new Date();
      await job.save();

      return res.status(200).json({ success: true, job });
    } else {
      const jobIndex = inMemoryJobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      inMemoryJobs[jobIndex].invoice.isPaid = true;
      inMemoryJobs[jobIndex].invoice.paidAt = new Date();

      return res.status(200).json({ success: true, job: inMemoryJobs[jobIndex] });
    }
  } catch (error) {
    console.error('Pay invoice error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing payment' });
  }
};

// @desc    Submit rating and review feedback for a completed job
// @route   PUT /api/jobs/:id/review
// @access  Private (Customer only)
const submitReview = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Please provide a rating star between 1 and 5' });
    }

    if (isDbConnected()) {
      const job = await JobRequest.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      job.review = {
        rating,
        comment: comment || '',
        createdAt: new Date()
      };
      await job.save();

      return res.status(200).json({ success: true, job });
    } else {
      const jobIndex = inMemoryJobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      inMemoryJobs[jobIndex].review = {
        rating,
        comment: comment || '',
        createdAt: new Date()
      };

      return res.status(200).json({ success: true, job: inMemoryJobs[jobIndex] });
    }
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting review' });
  }
};

// @desc    Get all jobs for technician (assigned to him or pending)
// @route   GET /api/jobs/tech-jobs
// @access  Private (Technician only)
const getTechnicianJobs = async (req, res) => {
  try {
    const techId = req.user._id;

    if (isDbConnected()) {
      const jobs = await JobRequest.find({
        $or: [{ technician: techId }, { status: 'pending' }]
      })
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, jobs });
    } else {
      const jobs = inMemoryJobs
        .filter(j => (j.technician && (j.technician === techId || j.technician._id === techId)) || j.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ success: true, jobs });
    }
  } catch (error) {
    console.error('Fetch technician jobs error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching technician jobs' });
  }
};

// @desc    Accept a pending job request
// @route   PUT /api/jobs/:id/accept
// @access  Private (Technician only)
const acceptJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const techId = req.user._id;
    const techName = req.user.name || 'Rahul Sharma';

    if (isDbConnected()) {
      const job = await JobRequest.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      if (job.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Job is already accepted or assigned' });
      }

      job.technician = techId;
      job.status = 'assigned';
      await job.save();

      return res.status(200).json({ success: true, job });
    } else {
      const jobIndex = inMemoryJobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      if (inMemoryJobs[jobIndex].status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Job is already accepted or assigned' });
      }

      inMemoryJobs[jobIndex].technician = {
        _id: techId,
        name: techName,
        email: req.user.email,
        phone: req.user.phone || '+91 98123 45678',
        specialty: req.user.specialty || 'HVAC Specialist',
        rating: 4.9
      };
      inMemoryJobs[jobIndex].status = 'assigned';

      return res.status(200).json({ success: true, job: inMemoryJobs[jobIndex] });
    }
  } catch (error) {
    console.error('Accept job error:', error);
    return res.status(500).json({ success: false, message: 'Server error accepting job' });
  }
};

// @desc    Update job status (e.g. to in-progress)
// @route   PUT /api/jobs/:id/status
// @access  Private (Technician only)
const updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;

    if (!['assigned', 'in-progress'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update for technician' });
    }

    if (isDbConnected()) {
      const job = await JobRequest.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      job.status = status;
      await job.save();

      return res.status(200).json({ success: true, job });
    } else {
      const jobIndex = inMemoryJobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      inMemoryJobs[jobIndex].status = status;
      return res.status(200).json({ success: true, job: inMemoryJobs[jobIndex] });
    }
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating job status' });
  }
};

// @desc    Complete job with service notes and parts
// @route   PUT /api/jobs/:id/complete
// @access  Private (Technician only)
const completeJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { serviceNotes, parts } = req.body;

    // Calculate final invoice amount
    // Base service charge is 500 INR
    let partsAmount = 0;
    const loggedParts = parts || [];
    loggedParts.forEach(p => {
      partsAmount += (p.price || 0) * (p.quantity || 1);
    });
    const totalAmount = 500 + partsAmount;

    if (isDbConnected()) {
      const job = await JobRequest.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      job.status = 'completed';
      job.serviceNotes = serviceNotes || '';
      job.invoice = {
        amount: totalAmount,
        isPaid: false,
        parts: loggedParts
      };

      await job.save();
      return res.status(200).json({ success: true, job });
    } else {
      const jobIndex = inMemoryJobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      inMemoryJobs[jobIndex].status = 'completed';
      inMemoryJobs[jobIndex].serviceNotes = serviceNotes || '';
      inMemoryJobs[jobIndex].invoice = {
        amount: totalAmount,
        isPaid: false,
        parts: loggedParts
      };

      return res.status(200).json({ success: true, job: inMemoryJobs[jobIndex] });
    }
  } catch (error) {
    console.error('Complete job error:', error);
    return res.status(500).json({ success: false, message: 'Server error completing job' });
  }
};

module.exports = {
  createJobRequest,
  getCustomerJobs,
  payInvoice,
  submitReview,
  getTechnicianJobs,
  acceptJob,
  updateJobStatus,
  completeJob
};
