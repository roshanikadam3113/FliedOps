const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');
const Job = require('../models/Job');
const { notifyUser } = require('../services/notificationService');
const { INVOICE_STATUS, PAYMENT_STATUS, NOTIFICATION_EVENTS } = require('../utils/constants');
const { aggregateJobData, emitSocketEvent } = require('./requestController');

const getInvoices = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const invoices = await Invoice.find({ customer: userId })
      .populate({
        path: 'job',
        populate: [
          { path: 'technician', select: 'name phone' },
          { path: 'serviceRequest', select: 'title category scheduledDate' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const invoiceId = req.params.id;

    const invoice = await Invoice.findById(invoiceId)
      .populate('customer', 'name email phone location')
      .populate({
        path: 'job',
        populate: [
          { path: 'technician', select: 'name phone email' },
          { path: 'serviceRequest', select: 'title category description scheduledDate location' }
        ]
      });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.customer._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this invoice' });
    }

    const payment = await Payment.findOne({ invoice: invoiceId, status: PAYMENT_STATUS.SUCCESS });

    res.status(200).json({ success: true, invoice, payment });
  } catch (error) {
    next(error);
  }
};

const payInvoice = async (req, res, next) => {
  try {
    const requestId = req.params.id; // Frontend passes jobId which is ServiceRequest ID
    const userId = req.user._id;

    const job = await Job.findOne({ serviceRequest: requestId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const invoice = await Invoice.findOne({ job: job._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this invoice' });
    }

    if (invoice.status === INVOICE_STATUS.PAID) {
      return res.status(400).json({ success: false, message: 'Invoice is already paid' });
    }

    if (invoice.status === INVOICE_STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Invoice is cancelled' });
    }

    // Double payment protection
    const existingPayment = await Payment.findOne({ invoice: invoice._id, status: PAYMENT_STATUS.SUCCESS });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Payment already recorded' });
    }

    // Update invoice status
    invoice.status = INVOICE_STATUS.PAID;
    await invoice.save();

    // Create payment record
    const payment = new Payment({
      paymentId: `PAY-${Date.now()}`,
      invoice: invoice._id,
      customer: userId,
      amount: invoice.totalAmount,
      method: 'online',
      status: PAYMENT_STATUS.SUCCESS,
      paidAt: new Date()
    });
    await payment.save();

    const request = await ServiceRequest.findById(requestId).populate('assignedTechnician').lean();

    await notifyUser(req.app, {
      userId,
      title: 'Payment Successful',
      message: `Invoice for "${request.title}" (₹${invoice.totalAmount}) was paid successfully.`,
      type: 'billing',
      relatedEntity: 'Payment',
      relatedEntityId: payment._id,
      channels: ['inApp', 'email']
    });

    const aggregated = await aggregateJobData(request);
    emitSocketEvent(req, userId, 'paymentUpdated', aggregated);

    return res.status(200).json({ success: true, job: aggregated });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  payInvoice
};
