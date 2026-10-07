const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Job = require('../models/Job');
const Invoice = require('../models/Invoice');
const { notifyUser } = require('../services/notificationService');
const { REQUEST_STATUS, JOB_STATUS, NOTIFICATION_EVENTS } = require('../utils/constants');
const { emitSocketEvent } = require('./requestController');

const getOverview = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const pendingRequests = await ServiceRequest.countDocuments({ status: REQUEST_STATUS.PENDING });
    const assignedJobs = await Job.countDocuments({ status: JOB_STATUS.ASSIGNED });
    const activeJobs = await Job.countDocuments({ status: { $in: [JOB_STATUS.ON_THE_WAY, JOB_STATUS.ARRIVED, JOB_STATUS.IN_PROGRESS] } });
    const completedJobs = await Job.countDocuments({ status: JOB_STATUS.COMPLETED });
    const cancelledJobs = await Job.countDocuments({ status: JOB_STATUS.CANCELLED });
    
    // Invoices
    const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });
    const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
    const invoices = await Invoice.find();
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingInvoiceAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidInvoiceAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Attention Required counts
    const unassignedRequests = await ServiceRequest.countDocuments({ assignedTechnician: null, status: { $nin: ['completed', 'cancelled'] } });
    
    // Inventory
    const Part = require('../models/Part');
    const lowStockItems = await Part.countDocuments({
      $expr: { $lte: ['$stockQuantity', '$minimumStock'] },
      isActive: true
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalTechnicians,
        pendingRequests,
        unassignedRequests,
        assignedJobs,
        activeJobs,
        completedJobs,
        cancelledJobs,
        pendingInvoices,
        paidInvoices,
        totalInvoiceAmount,
        pendingInvoiceAmount,
        paidInvoiceAmount,
        lowStockItems
      }
    });

  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, customers });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

const createTechnician = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialty, location } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const technician = await User.create({
      name,
      email,
      password,
      role: 'technician',
      phone: phone || '',
      specialty: specialty || 'General Maintenance',
      location: location || '',
      isActive: true,
      availabilityStatus: 'AVAILABLE'
    });

    const techObj = technician.toObject();
    delete techObj.password;

    res.status(201).json({ success: true, technician: techObj });
  } catch (error) {
    next(error);
  }
};

const getTechnicians = async (req, res, next) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select('-password').sort({ createdAt: -1 });
    
    // Add current job count manually
    const techniciansWithJobs = await Promise.all(technicians.map(async (tech) => {
      const activeJobCount = await Job.countDocuments({
        technician: tech._id,
        status: { $in: [JOB_STATUS.ASSIGNED, JOB_STATUS.ON_THE_WAY, JOB_STATUS.ARRIVED, JOB_STATUS.IN_PROGRESS] }
      });
      return {
        ...tech.toObject(),
        activeJobCount
      };
    }));

    res.status(200).json({ success: true, technicians: techniciansWithJobs });
  } catch (error) {
    next(error);
  }
};

const getTechnicianById = async (req, res, next) => {
  try {
    const technician = await User.findOne({ _id: req.params.id, role: 'technician' }).select('-password');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    res.status(200).json({ success: true, technician });
  } catch (error) {
    next(error);
  }
};

const updateTechnicianStatus = async (req, res, next) => {
  try {
    const { isActive, availabilityStatus } = req.body;
    const technician = await User.findOne({ _id: req.params.id, role: 'technician' });
    
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    if (typeof isActive !== 'undefined') {
      technician.isActive = isActive;
    }
    
    if (availabilityStatus) {
      const validStatuses = ['AVAILABLE', 'BUSY', 'OFFLINE'];
      if (!validStatuses.includes(availabilityStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid availability status' });
      }
      technician.availabilityStatus = availabilityStatus;
    }

    await technician.save();

    const techObj = technician.toObject();
    delete techObj.password;

    res.status(200).json({ success: true, technician: techObj });
  } catch (error) {
    next(error);
  }
};

const getServiceRequests = async (req, res, next) => {
  try {
    const { status, assigned } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (assigned === 'true') {
      query.assignedTechnician = { $ne: null };
    } else if (assigned === 'false') {
      query.assignedTechnician = null;
    }

    const requests = await ServiceRequest.find(query)
      .populate('customer', 'name email phone location')
      .populate('assignedTechnician', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const { status, technician } = req.query;
    let query = {};

    if (status) query.status = status;
    if (technician) query.technician = technician;

    const jobs = await Job.find(query)
      .populate('customer', 'name email phone location')
      .populate('technician', 'name email phone')
      .populate('serviceRequest', 'title description category urgency location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

const assignJob = async (req, res, next) => {
  try {
    const { technicianId } = req.body;
    const { id } = req.params; // ServiceRequest ID

    if (!technicianId) {
      return res.status(400).json({ success: false, message: 'Please provide technicianId' });
    }

    // 1. Verify Technician
    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ success: false, message: 'Valid technician not found' });
    }
    if (!technician.isActive) {
      return res.status(400).json({ success: false, message: 'Technician is currently inactive' });
    }

    // 2. Verify Request
    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'ServiceRequest not found' });
    }

    if (request.status === REQUEST_STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Cannot assign cancelled request' });
    }

    // Instructor rule: matching area and specialty
    if (technician.location.toLowerCase() !== request.location.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Technician area must match the request location' });
    }
    const requestCategory = request.category || 'General Maintenance';
    if (technician.specialty.toLowerCase() !== requestCategory.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Technician specialty must match the request category' });
    }

    // 3. Find if Job already exists
    let job = await Job.findOne({ serviceRequest: id });
    if (job) {
      if (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.CANCELLED) {
        return res.status(400).json({ success: false, message: 'Job is already completed or cancelled' });
      }
      
      // Overwrite assignment
      job.technician = technicianId;
      job.status = JOB_STATUS.ASSIGNED;
      job.statusHistory.push({ status: 'assigned', note: `Reassigned to technician ${technician.name} by Admin`, timestamp: new Date() });
      await job.save();
    } else {
      // Create new Job
      job = new Job({
        serviceRequest: id,
        customer: request.customer,
        technician: technicianId,
        scheduledDate: request.scheduledDate || request.preferredDate || new Date().toISOString(),
        status: JOB_STATUS.ASSIGNED,
        statusHistory: [{ status: 'assigned', note: `Job assigned to ${technician.name} by Admin`, timestamp: new Date() }]
      });
      await job.save();
    }

    // Update ServiceRequest
    request.assignedTechnician = technicianId;
    request.status = REQUEST_STATUS.ASSIGNED;
    request.statusHistory.push({ status: 'assigned', note: `Assigned to technician ${technician.name} by Admin`, timestamp: new Date() });
    await request.save();

    // 4. Notifications
    await notifyUser(req.app, {
      userId: technicianId,
      title: 'New Job Assigned',
      message: `You have been assigned to service request "${request.title}".`,
      type: 'dispatch',
      relatedEntity: 'Job',
      relatedEntityId: job._id,
      channels: ['inApp', 'email', 'sms']
    });

    await notifyUser(req.app, {
      userId: request.customer,
      title: 'Technician Assigned',
      message: `Technician ${technician.name} has been assigned to your service request.`,
      type: 'dispatch',
      relatedEntity: 'Job',
      relatedEntityId: job._id,
      channels: ['inApp', 'email', 'sms']
    });

    // If sockets are active
    emitSocketEvent(req, technicianId, 'newJobAssigned', job);
    emitSocketEvent(req, request.customer, 'technicianAssigned', request);

    res.status(200).json({ success: true, job, request });
  } catch (error) {
    next(error);
  }
};

const getAdminInvoices = async (req, res, next) => {
  try {
    const { status, customer, date } = req.query;
    let query = {};

    if (status) query.status = status;
    if (customer) query.customer = customer;
    if (date) {
      // Basic date filtering (if date is YYYY-MM-DD)
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.issuedAt = { $gte: startDate, $lt: endDate };
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email phone location')
      .populate({
        path: 'job',
        populate: [
          { path: 'technician', select: 'name email phone' },
          { path: 'serviceRequest', select: 'title category location scheduledDate' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
