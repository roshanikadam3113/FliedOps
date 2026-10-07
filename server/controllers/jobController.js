const Job = require('../models/Job');
const ServiceRequest = require('../models/ServiceRequest');
const Invoice = require('../models/Invoice');
const { notifyUser } = require('../services/notificationService');
const { JOB_STATUS, INVOICE_STATUS, REQUEST_STATUS, NOTIFICATION_EVENTS } = require('../utils/constants');
const { aggregateJobData, aggregateMultipleJobData, emitSocketEvent } = require('./requestController');

const getTechnicianJobs = async (req, res, next) => {
  try {
    const techId = req.user._id;

    // A technician sees jobs assigned to them OR pending requests
    const pendingRequests = await ServiceRequest.find({ status: REQUEST_STATUS.PENDING })
      .populate('customer', 'name email phone location')
      .lean();
      
    const techJobs = await Job.find({ technician: techId })
      .populate({
        path: 'serviceRequest',
        populate: { path: 'customer', select: 'name email phone location' }
      })
      .lean();

    // Map them all to the unified frontend format
    const aggregatedPending = pendingRequests.map(r => ({
      ...r,
      _id: r._id,
      invoice: { amount: 0, serviceCharge: 500, partsTotal: 0, tax: 0, isPaid: false },
      review: null
    }));

    const validServiceRequests = techJobs.map(j => j.serviceRequest).filter(Boolean);
    const accurateAssigned = await aggregateMultipleJobData(validServiceRequests);

    const jobs = [...aggregatedPending, ...accurateAssigned]
        .map(job => ({ ...job, status: job.status ? job.status.toLowerCase() : '' }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const acceptJob = async (req, res, next) => {
  try {
    const requestId = req.params.id; // Frontend passes jobId which is now ServiceRequest ID
    const techId = req.user._id;
    const techName = req.user.name;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    if (request.status !== REQUEST_STATUS.PENDING) {
      return res.status(400).json({ success: false, message: 'Request is already accepted or assigned' });
    }

    // Instructor rule: matching area and specialty
    if (req.user.location.toLowerCase() !== request.location.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Your area must match the request location' });
    }
    const requestCategory = request.category || 'General Maintenance';
    if (req.user.specialty.toLowerCase() !== requestCategory.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Your specialty must match the request category' });
    }

    request.assignedTechnician = techId;
    request.status = REQUEST_STATUS.ASSIGNED;
    request.statusHistory.push({ status: 'assigned', note: `Assigned to technician ${techName}`, timestamp: new Date() });
    await request.save();

    // Create the Job entity
    const job = new Job({
      serviceRequest: request._id,
      customer: request.customer,
      technician: techId,
      scheduledDate: request.scheduledDate,
      status: JOB_STATUS.ASSIGNED,
      statusHistory: [{ status: 'assigned', note: `Job assigned to ${techName}`, timestamp: new Date() }]
    });
    await job.save();

    await notifyUser(req.app, {
      userId: request.customer,
      title: 'Technician Assigned',
      message: `Technician ${techName} has been assigned to your service request "${request.title}".`,
      type: 'dispatch',
      relatedEntity: 'Job',
      relatedEntityId: job._id,
      channels: ['inApp', 'email', 'sms']
    });

    const aggregated = await aggregateJobData(request.toObject());
    emitSocketEvent(req, request.customer, 'technicianAssigned', aggregated);
    emitSocketEvent(req, request.customer, 'serviceStatusUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body; // on-the-way, arrived, in-progress

    const job = await Job.findOne({ serviceRequest: requestId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.technician.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    if (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Cannot update a completed or cancelled job' });
    }

    const validStatuses = [JOB_STATUS.ASSIGNED, JOB_STATUS.ON_THE_WAY, JOB_STATUS.ARRIVED, JOB_STATUS.IN_PROGRESS];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update for technician' });
    }

    job.status = status;
    job.statusHistory.push({ status, note: `Status updated to ${status}`, timestamp: new Date() });
    
    if (status === JOB_STATUS.IN_PROGRESS && !job.startedAt) {
      job.startedAt = new Date();
    }
    
    await job.save();

    // Also update request visually if needed, though aggregated object pulls from Job
    const request = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();

    const statusLabels = {
      [JOB_STATUS.ON_THE_WAY]: 'Technician On the Way',
      [JOB_STATUS.ARRIVED]: 'Technician Arrived',
      [JOB_STATUS.IN_PROGRESS]: 'Service Started'
    };
    
    let channels = ['inApp'];
    if (status === JOB_STATUS.ON_THE_WAY) channels.push('sms');

    await notifyUser(req.app, {
      userId: job.customer,
      title: statusLabels[status] || 'Status Updated',
      message: `Status for service "${request.title}" updated to ${status.replace('-', ' ')}.`,
      type: 'status',
      relatedEntity: 'Job',
      relatedEntityId: job._id,
      channels
    });

    const aggregated = await aggregateJobData(request);
    emitSocketEvent(req, job.customer, 'serviceStatusUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const completeJob = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const { serviceNotes, parts } = req.body;

    const job = await Job.findOne({ serviceRequest: requestId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.technician.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this job' });
    }

    if (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Job is already completed or cancelled' });
    }

    let partsAmount = 0;
    const loggedParts = job.partsUsed || [];
    const invoiceParts = loggedParts.map(p => {
      partsAmount += p.total;
      return {
        name: p.name,
        price: p.unitPrice,
        quantity: p.quantity
      };
    });
    const serviceCharge = 500;
    const totalAmount = serviceCharge + partsAmount;

    job.status = JOB_STATUS.COMPLETED;
    job.serviceNotes = serviceNotes || '';
    job.completedAt = new Date();
    job.statusHistory.push({ status: 'completed', note: 'Service completed by technician', timestamp: new Date() });
    await job.save();

    // Update ServiceRequest status as well to avoid inconsistency
    await ServiceRequest.findByIdAndUpdate(requestId, { status: REQUEST_STATUS.ASSIGNED }); // Or COMPLETED if you want

    // Generate Invoice
    const existingInvoice = await Invoice.findOne({ job: job._id });
    if (existingInvoice) {
      return res.status(400).json({ success: false, message: 'Invoice already exists for this job' });
    }

    // Generate unique human-readable invoice number
    // Format: INV-YYYY-XXXXXX
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let nextNumber = '000001';
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      if (parts.length === 3) {
        const lastCount = parseInt(parts[2], 10);
        if (!isNaN(lastCount)) {
          nextNumber = (lastCount + 1).toString().padStart(6, '0');
        }
      }
    }
    const currentYear = new Date().getFullYear();
    const invoiceNumber = `INV-${currentYear}-${nextNumber}`;

    const invoice = new Invoice({
      invoiceNumber,
      job: job._id,
      customer: job.customer,
      serviceCharge,
      parts: invoiceParts,
      partsTotal: partsAmount,
      tax: 0,
      totalAmount,
      status: INVOICE_STATUS.PENDING
    });
    await invoice.save();

    const request = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();

    await notifyUser(req.app, {
      userId: job.customer,
      title: 'Service Completed & Invoice Generated',
      message: `Your service "${request.title}" has been completed. Invoice total: ₹${totalAmount}.`,
      type: 'billing',
      relatedEntity: 'Invoice',
      relatedEntityId: invoice._id,
      channels: ['inApp', 'email', 'sms']
    });

    const aggregated = await aggregateJobData(request);
    emitSocketEvent(req, job.customer, 'invoiceGenerated', aggregated);
    emitSocketEvent(req, job.customer, 'serviceStatusUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  getTechnicianJobs,
  acceptJob,
  updateJobStatus,
  completeJob
};
