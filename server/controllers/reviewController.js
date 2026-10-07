const Review = require('../models/Review');
const Job = require('../models/Job');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { notifyUser } = require('../services/notificationService');
const { JOB_STATUS, NOTIFICATION_EVENTS } = require('../utils/constants');
const { aggregateJobData } = require('./requestController');

const submitReview = async (req, res, next) => {
  try {
    const requestId = req.params.id; // Frontend passes jobId which is ServiceRequest ID
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Please provide a rating star between 1 and 5' });
    }

    const job = await Job.findOne({ serviceRequest: requestId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this request' });
    }

    if (job.status !== JOB_STATUS.COMPLETED) {
      return res.status(400).json({ success: false, message: 'Can only submit reviews for completed services' });
    }

    const existingReview = await Review.findOne({ job: job._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this service' });
    }

    const review = new Review({
      job: job._id,
      customer: userId,
      technician: job.technician,
      rating: Number(rating),
      comment: comment || ''
    });
    await review.save();

    // Update Technician Rating
    if (job.technician) {
      const tech = await User.findById(job.technician);
      if (tech) {
        const currentTotal = tech.totalRatings || 1;
        const currentRating = tech.rating || 4.8;
        const newTotal = currentTotal + 1;
        const newAvgRating = ((currentRating * currentTotal) + Number(rating)) / newTotal;
        tech.rating = Number(newAvgRating.toFixed(1));
        tech.totalRatings = newTotal;
        await tech.save();
      }
    }

    const request = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();

    await notifyUser(req.app, {
      userId,
      title: 'Review Submitted',
      message: `Thank you for reviewing service "${request.title}".`,
      type: 'review',
      relatedEntity: 'Review',
      relatedEntityId: review._id,
      channels: ['inApp']
    });

    const aggregated = await aggregateJobData(request);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  submitReview
};
