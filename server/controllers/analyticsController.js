const ServiceRequest = require('../models/ServiceRequest');
const Job = require('../models/Job');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const InventoryTransaction = require('../models/InventoryTransaction');
const Part = require('../models/Part');
const Review = require('../models/Review');
const { REQUEST_STATUS, JOB_STATUS, INVOICE_STATUS, PAYMENT_STATUS } = require('../utils/constants');

// Helper to parse date range
const parseDateRange = (req) => {
  const { range, startDate, endDate } = req.query;
  const match = {};

  if (range && range !== 'all') {
    const now = new Date();
    let start = new Date();
    if (range === '7d') start.setDate(now.getDate() - 7);
    else if (range === '30d') start.setDate(now.getDate() - 30);
    else if (range === '90d') start.setDate(now.getDate() - 90);
    else if (range === '6m') start.setMonth(now.getMonth() - 6);
    else if (range === '1y') start.setFullYear(now.getFullYear() - 1);
    else if (range === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt = { $gte: start, $lte: end };
      return match;
    }
    match.createdAt = { $gte: start };
  }
  return match;
};

// @desc    Get analytics overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
const getOverview = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    const totalRequests = await ServiceRequest.countDocuments(dateMatch);
    const completedJobs = await Job.countDocuments({ ...dateMatch, status: JOB_STATUS.COMPLETED });
    const activeJobs = await Job.countDocuments({ 
      ...dateMatch, 
      status: { $in: [JOB_STATUS.ASSIGNED, JOB_STATUS.ON_THE_WAY, JOB_STATUS.ARRIVED, JOB_STATUS.IN_PROGRESS] } 
    });
    const cancelledRequests = await ServiceRequest.countDocuments({ ...dateMatch, status: REQUEST_STATUS.CANCELLED });
    
    // Invoices based on createdAt
    const paidInvoicesAggregation = await Invoice.aggregate([
      { $match: { ...dateMatch, status: INVOICE_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalPaid = paidInvoicesAggregation.length > 0 ? paidInvoicesAggregation[0].total : 0;

    const pendingInvoicesAggregation = await Invoice.aggregate([
      { $match: { ...dateMatch, status: INVOICE_STATUS.PENDING } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalPending = pendingInvoicesAggregation.length > 0 ? pendingInvoicesAggregation[0].total : 0;

    const reviewsAgg = await Review.aggregate([
      { $match: dateMatch },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = reviewsAgg.length > 0 ? reviewsAgg[0].avgRating : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        completedJobs,
        activeJobs,
        cancelledRequests,
        totalPaid,
        totalPending,
        avgRating: Number(avgRating.toFixed(1))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get operations analytics
// @route   GET /api/admin/analytics/operations
// @access  Private/Admin
const getOperations = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    // Requests by Status
    const requestsByStatus = await ServiceRequest.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Requests by Category
    const requestsByCategory = await ServiceRequest.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Requests Over Time (Daily)
    const requestsOverTime = await ServiceRequest.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Job Completion Time
    const completedJobsList = await Job.find({ ...dateMatch, status: JOB_STATUS.COMPLETED, completedAt: { $exists: true }, startedAt: { $exists: true } }).lean();
    let avgCompletionTimeMinutes = null;
    if (completedJobsList.length > 0) {
      let totalMinutes = 0;
      completedJobsList.forEach(job => {
        const diff = new Date(job.completedAt) - new Date(job.startedAt);
        totalMinutes += diff / (1000 * 60);
      });
      avgCompletionTimeMinutes = totalMinutes / completedJobsList.length;
    }

    res.status(200).json({
      success: true,
      data: {
        requestsByStatus: requestsByStatus.map(r => ({ status: r._id, count: r.count })),
        requestsByCategory: requestsByCategory.map(r => ({ category: r._id, count: r.count })),
        requestsOverTime: requestsOverTime.map(r => ({ date: r._id, count: r.count })),
        avgCompletionTimeMinutes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get technician analytics
// @route   GET /api/admin/analytics/technicians
// @access  Private/Admin
const getTechnicians = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    const technicians = await User.find({ role: 'technician' }).select('name rating totalRatings availabilityStatus').lean();

    const techIds = technicians.map(t => t._id);

    // Active Jobs per tech
    const activeJobs = await Job.aggregate([
      { $match: { ...dateMatch, technician: { $in: techIds }, status: { $in: [JOB_STATUS.ASSIGNED, JOB_STATUS.ON_THE_WAY, JOB_STATUS.ARRIVED, JOB_STATUS.IN_PROGRESS] } } },
      { $group: { _id: '$technician', count: { $sum: 1 } } }
    ]);

    // Completed Jobs per tech
    const completedJobs = await Job.aggregate([
      { $match: { ...dateMatch, technician: { $in: techIds }, status: JOB_STATUS.COMPLETED } },
      { $group: { _id: '$technician', count: { $sum: 1 } } }
    ]);

    // Cancelled Jobs per tech
    const cancelledJobs = await Job.aggregate([
      { $match: { ...dateMatch, technician: { $in: techIds }, status: JOB_STATUS.CANCELLED } },
      { $group: { _id: '$technician', count: { $sum: 1 } } }
    ]);

    const activeJobsMap = activeJobs.reduce((acc, curr) => ({ ...acc, [curr._id.toString()]: curr.count }), {});
    const completedJobsMap = completedJobs.reduce((acc, curr) => ({ ...acc, [curr._id.toString()]: curr.count }), {});
    const cancelledJobsMap = cancelledJobs.reduce((acc, curr) => ({ ...acc, [curr._id.toString()]: curr.count }), {});

    const technicianMetrics = technicians.map(tech => ({
      _id: tech._id,
      name: tech.name,
      rating: tech.rating,
      availabilityStatus: tech.availabilityStatus,
      activeJobs: activeJobsMap[tech._id.toString()] || 0,
      completedJobs: completedJobsMap[tech._id.toString()] || 0,
      cancelledJobs: cancelledJobsMap[tech._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        technicianMetrics
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer analytics
// @route   GET /api/admin/analytics/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    const totalCustomers = await User.countDocuments({ role: 'customer', ...dateMatch });

    // Requests per customer
    const requestsPerCustomer = await ServiceRequest.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$customer', count: { $sum: 1 } } }
    ]);

    const activeCustomersCount = requestsPerCustomer.length;
    const repeatCustomersCount = requestsPerCustomer.filter(r => r.count > 1).length;

    // Ratings Distribution
    const ratingsDistribution = await Review.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomersCount,
        repeatCustomersCount,
        ratingsDistribution: ratingsDistribution.map(r => ({ rating: r._id, count: r.count }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get finance analytics
// @route   GET /api/admin/analytics/finance
// @access  Private/Admin
const getFinance = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    const invoiceStatusAgg = await Invoice.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$status', totalAmount: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const financeSummary = {
      invoiced: { amount: 0, count: 0 },
      paid: { amount: 0, count: 0 },
      pending: { amount: 0, count: 0 },
      cancelled: { amount: 0, count: 0 }
    };

    invoiceStatusAgg.forEach(statusData => {
      if (statusData._id === INVOICE_STATUS.PENDING) {
        financeSummary.pending.amount = statusData.totalAmount;
        financeSummary.pending.count = statusData.count;
      } else if (statusData._id === INVOICE_STATUS.PAID) {
        financeSummary.paid.amount = statusData.totalAmount;
        financeSummary.paid.count = statusData.count;
      } else if (statusData._id === INVOICE_STATUS.CANCELLED) {
        financeSummary.cancelled.amount = statusData.totalAmount;
        financeSummary.cancelled.count = statusData.count;
      }
      financeSummary.invoiced.amount += statusData.totalAmount;
      financeSummary.invoiced.count += statusData.count;
    });

    const paymentTrend = await Payment.aggregate([
      { $match: { ...dateMatch, status: PAYMENT_STATUS.SUCCESS } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        financeSummary,
        paymentTrend: paymentTrend.map(p => ({ date: p._id, amount: p.totalAmount }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory analytics
// @route   GET /api/admin/analytics/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const dateMatch = parseDateRange(req);

    // Current Inventory Value
    const parts = await Part.find().lean();
    let currentInventoryValue = 0;
    const lowStockParts = [];
    const outOfStockParts = [];

    parts.forEach(p => {
      currentInventoryValue += p.quantity * p.price;
      if (p.quantity === 0) outOfStockParts.push(p.name);
      else if (p.quantity <= p.minStockLevel) lowStockParts.push(p.name);
    });

    // Most Consumed Parts (from Jobs)
    const jobs = await Job.find({ ...dateMatch, 'partsUsed.0': { $exists: true } }).lean();
    const partsConsumptionMap = {};
    
    jobs.forEach(job => {
      job.partsUsed.forEach(p => {
        if (!partsConsumptionMap[p.part]) {
          partsConsumptionMap[p.part] = { quantity: 0, jobs: 0 };
        }
        partsConsumptionMap[p.part].quantity += p.quantity;
        partsConsumptionMap[p.part].jobs += 1;
      });
    });

    // We need to map part ObjectIds to actual names. 
    // We can fetch the part names based on keys of partsConsumptionMap
    const partIds = Object.keys(partsConsumptionMap);
    const consumedPartsInfo = await Part.find({ _id: { $in: partIds } }).lean();
    const partNameMap = consumedPartsInfo.reduce((acc, curr) => ({ ...acc, [curr._id.toString()]: curr.name }), {});

    const mostConsumedParts = Object.keys(partsConsumptionMap).map(id => ({
      name: partNameMap[id] || 'Unknown Part',
      quantity: partsConsumptionMap[id].quantity,
      jobs: partsConsumptionMap[id].jobs
    })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // Inventory Transactions (Stock In/Out activity)
    const stockInTx = await InventoryTransaction.countDocuments({ ...dateMatch, type: 'IN' });
    const stockOutTx = await InventoryTransaction.countDocuments({ ...dateMatch, type: 'OUT' });

    res.status(200).json({
      success: true,
      data: {
        currentInventoryValue,
        lowStockParts,
        outOfStockParts,
        mostConsumedParts,
        stockInTx,
        stockOutTx
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getOperations,
  getTechnicians,
  getCustomers,
  getFinance,
  getInventory
};
