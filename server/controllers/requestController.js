const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Job = require('../models/Job');
const Invoice = require('../models/Invoice');
const Review = require('../models/Review');
const { notifyUser } = require('../services/notificationService');
const { REQUEST_STATUS, JOB_STATUS, NOTIFICATION_EVENTS } = require('../utils/constants');

const emitSocketEvent = (req, roomOrUser, eventName, payload) => {
  try {
    const io = req.app.get('io');
    if (io) {
      io.to(roomOrUser.toString()).emit(eventName, payload);
    }
  } catch (err) {
    console.error('Socket emit error:', err);
  }
};

// Map separate entities to the unified format the frontend expects
const aggregateJobData = async (serviceRequest) => {
  const job = await Job.findOne({ serviceRequest: serviceRequest._id }).lean();
  let invoice = null;
  let review = null;
  
  if (job) {
    invoice = await Invoice.findOne({ job: job._id }).lean();
    review = await Review.findOne({ job: job._id }).lean();
  }

  // Create unified object similar to old JobRequest for frontend compatibility
  return {
    ...serviceRequest,
    _id: serviceRequest._id,
    technician: serviceRequest.assignedTechnician, // Could be populated
    status: job ? job.status : serviceRequest.status, // Technician status takes over visually in frontend
    serviceNotes: job ? job.serviceNotes : '',
    invoice: invoice ? {
      amount: invoice.totalAmount,
      serviceCharge: invoice.serviceCharge,
      partsTotal: invoice.partsTotal,
      tax: invoice.tax,
      isPaid: invoice.status === 'paid',
      parts: invoice.parts
    } : { amount: 0, serviceCharge: 500, partsTotal: 0, tax: 0, isPaid: false },
    review: review ? {
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    } : null
  };
};

const createJobRequest = async (req, res, next) => {
  try {
    const { title, description, category, serviceType, urgency, location, scheduledDate, contactPhone, image } = req.body;

    if (!title || !description || !location || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const customerId = req.user._id;

    // Find a matching technician based on location and specialty
    const matchingTechnician = await User.findOne({
      role: 'technician',
      isActive: true,
      availabilityStatus: 'AVAILABLE',
      location: { $regex: new RegExp(`^${location}$`, 'i') },
      specialty: { $regex: new RegExp(`^${category || 'General Maintenance'}$`, 'i') }
    });

    const initialStatus = matchingTechnician ? REQUEST_STATUS.ASSIGNED : REQUEST_STATUS.PENDING;
    const initialNote = matchingTechnician 
        ? `Service request created and auto-assigned to ${matchingTechnician.name}` 
        : 'Service request created by customer';

    const request = await ServiceRequest.create({
      customer: customerId,
      title,
      description,
      category: category || 'General Maintenance',
      serviceType: serviceType || 'Standard Maintenance',
      contactPhone: contactPhone || req.user.phone || '',
      image: image || '',
      urgency: urgency || 'medium',
      location,
      scheduledDate,
      status: initialStatus,
      assignedTechnician: matchingTechnician ? matchingTechnician._id : null,
      statusHistory: [{ status: initialStatus, note: initialNote, timestamp: new Date() }]
    });

    if (matchingTechnician) {
      // Create the Job entity as well
      const job = new Job({
        serviceRequest: request._id,
        customer: request.customer,
        technician: matchingTechnician._id,
        scheduledDate: request.scheduledDate,
        status: JOB_STATUS.ASSIGNED,
        statusHistory: [{ status: 'assigned', note: `Job auto-assigned to ${matchingTechnician.name}`, timestamp: new Date() }]
      });
      await job.save();

      // Notify technician
      await notifyUser(req.app, {
        userId: matchingTechnician._id,
        title: 'New Job Assigned',
        message: `You have been auto-assigned to a new service request "${request.title}".`,
        type: 'dispatch',
        relatedEntity: 'Job',
        relatedEntityId: job._id,
        channels: ['inApp', 'email', 'sms']
      });

      emitSocketEvent(req, matchingTechnician._id, 'newJobAssigned', job);
    }

    await notifyUser(req.app, {
      userId: customerId,
      title: 'Service Request Created',
      message: `Your request #${request._id.toString().slice(-6).toUpperCase()} ("${request.title}") has been received.${matchingTechnician ? ' A technician has been auto-assigned.' : ''}`,
      type: 'request',
      relatedEntity: 'ServiceRequest',
      relatedEntityId: request._id,
      channels: ['inApp', 'email']
    });

    const aggregated = await aggregateJobData(request.toObject());
    emitSocketEvent(req, customerId, 'serviceStatusUpdated', aggregated);

    return res.status(201).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const aggregateMultipleJobData = async (serviceRequests) => {
  const requestIds = serviceRequests.map(req => req._id);
  
  const jobs = await Job.find({ serviceRequest: { $in: requestIds } }).lean();
  const jobIds = jobs.map(j => j._id);
  
  const [invoices, reviews] = await Promise.all([
    Invoice.find({ job: { $in: jobIds } }).lean(),
    Review.find({ job: { $in: jobIds } }).lean()
  ]);

  const jobMap = jobs.reduce((acc, job) => {
    acc[job.serviceRequest.toString()] = job;
    return acc;
  }, {});

  const invoiceMap = invoices.reduce((acc, inv) => {
    acc[inv.job.toString()] = inv;
    return acc;
  }, {});

  const reviewMap = reviews.reduce((acc, rev) => {
    acc[rev.job.toString()] = rev;
    return acc;
  }, {});

  return serviceRequests.map(serviceRequest => {
    const job = jobMap[serviceRequest._id.toString()];
    let invoice = null;
    let review = null;
    
    if (job) {
      invoice = invoiceMap[job._id.toString()];
      review = reviewMap[job._id.toString()];
    }

    return {
      ...serviceRequest,
      _id: serviceRequest._id,
      technician: serviceRequest.assignedTechnician,
      status: job ? job.status : serviceRequest.status,
      serviceNotes: job ? job.serviceNotes : '',
      invoice: invoice ? {
        amount: invoice.totalAmount,
        serviceCharge: invoice.serviceCharge,
        partsTotal: invoice.partsTotal,
        tax: invoice.tax,
        isPaid: invoice.status === 'paid',
        parts: invoice.parts
      } : { amount: 0, serviceCharge: 500, partsTotal: 0, tax: 0, isPaid: false },
      review: review ? {
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      } : null
    };
  });
};

const getCustomerJobs = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    const requests = await ServiceRequest.find({ customer: customerId })
      .populate('assignedTechnician', 'name email phone specialty rating location')
      .sort({ createdAt: -1 })
      .lean();

    const jobs = await aggregateMultipleJobData(requests);
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const request = await ServiceRequest.findById(requestId)
      .populate('customer', 'name email phone location')
      .populate('assignedTechnician', 'name email phone specialty rating location')
      .lean();

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (userRole === 'customer' && request.customer._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    if (userRole === 'technician') {
      const isAssigned = request.assignedTechnician && request.assignedTechnician._id.toString() === userId.toString();
      const isPending = request.status === 'pending';
      if (!isAssigned && !isPending) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
      }
    }

    const aggregated = await aggregateJobData(request);
    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const cancelJobRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;
    const { cancelReason } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (request.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    const job = await Job.findOne({ serviceRequest: requestId });
    if (job && ['completed', 'in-progress'].includes(job.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel request because service is already ${job.status}` });
    }

    request.status = REQUEST_STATUS.CANCELLED;
    request.cancelReason = cancelReason || 'Cancelled by customer';
    request.statusHistory.push({ status: 'cancelled', note: request.cancelReason, timestamp: new Date() });
    await request.save();

    if (job) {
      job.status = 'cancelled';
      job.statusHistory.push({ status: 'cancelled', note: 'Request cancelled by customer', timestamp: new Date() });
      await job.save();
    }

    await notifyUser(req.app, {
      userId,
      title: 'Service Request Cancelled',
      message: `Your request "${request.title}" has been cancelled.`,
      type: 'request',
      relatedEntity: 'ServiceRequest',
      relatedEntityId: request._id,
      channels: ['inApp']
    });

    const requestLean = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();
    const aggregated = await aggregateJobData(requestLean);
    emitSocketEvent(req, userId, 'serviceStatusUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const rescheduleJobRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;
    const { scheduledDate } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({ success: false, message: 'Please provide a new scheduled date and time' });
    }

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (request.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this request' });
    }

    const job = await Job.findOne({ serviceRequest: requestId });
    if (job && ['completed', 'in-progress'].includes(job.status)) {
      return res.status(400).json({ success: false, message: `Cannot reschedule request because service is already ${job.status}` });
    }

    request.rescheduledDate = scheduledDate;
    request.scheduledDate = scheduledDate;
    request.statusHistory.push({ status: request.status, note: `Rescheduled to ${scheduledDate}`, timestamp: new Date() });
    await request.save();

    if (job) {
      job.scheduledDate = scheduledDate;
      job.statusHistory.push({ status: job.status, note: `Rescheduled to ${scheduledDate}`, timestamp: new Date() });
      await job.save();
    }

    await notifyUser(req.app, {
      userId,
      title: 'Service Request Rescheduled',
      message: `Your request "${request.title}" was rescheduled to ${scheduledDate}.`,
      type: 'request',
      relatedEntity: 'ServiceRequest',
      relatedEntityId: request._id,
      channels: ['inApp']
    });

    const requestLean = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();
    const aggregated = await aggregateJobData(requestLean);
    emitSocketEvent(req, userId, 'serviceStatusUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  createJobRequest,
  getCustomerJobs,
  getJobById,
  cancelJobRequest,
  rescheduleJobRequest,
  aggregateJobData,
  aggregateMultipleJobData,
  emitSocketEvent
};
