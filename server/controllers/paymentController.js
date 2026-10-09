const Razorpay = require('razorpay');
const crypto = require('crypto');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const { notifyUser } = require('../services/notificationService');
const { INVOICE_STATUS } = require('../utils/constants');

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

const createOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // invoice ID
    const invoice = await Invoice.findById(id).populate('customer');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status === INVOICE_STATUS.PAID) {
      return res.status(400).json({ success: false, message: 'Invoice is already paid' });
    }

    const options = {
      amount: Math.round(invoice.totalAmount * 100), // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice._id.toString(),
        customerId: invoice.customer._id.toString()
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({ 
      success: true, 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      customer: {
        name: invoice.customer.name,
        email: invoice.customer.email,
        phone: invoice.customer.phone || ''
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;

    // Verify the signature to ensure the request is genuinely from Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log('Signature mismatch!', { expectedSignature, razorpay_signature, secret: process.env.RAZORPAY_KEY_SECRET });
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Payment is verified, update the database
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status !== INVOICE_STATUS.PAID) {
      invoice.status = INVOICE_STATUS.PAID;
      await invoice.save();

      await Payment.create({
        paymentId: `PAY-${Date.now()}`,
        invoice: invoice._id,
        customer: invoice.customer,
        job: invoice.job,
        amount: invoice.totalAmount,
        method: 'Razorpay (UPI/Card)',
        transactionReference: razorpay_payment_id,
        status: 'success',
        paidAt: new Date()
      });

      await notifyUser(req.app, {
        userId: invoice.customer,
        title: 'Payment Received',
        message: `Your payment of ₹${invoice.totalAmount} for Invoice ${invoice.invoiceNumber} was successfully processed via Razorpay.`,
        type: 'billing',
        relatedEntity: 'Invoice',
        relatedEntityId: invoice._id,
        channels: ['inApp']
      });
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
