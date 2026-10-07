const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const { notifyUser } = require('../services/notificationService');
const { INVOICE_STATUS } = require('../utils/constants');

const createCheckoutSession = async (req, res, next) => {
  try {
    const { id } = req.params; // invoice ID
    const invoice = await Invoice.findById(id).populate('customer');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status === INVOICE_STATUS.PAID) {
      return res.status(400).json({ success: false, message: 'Invoice is already paid' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: invoice.customer.email,
      line_items: [
        {
          price_data: {
            currency: 'usd', // or 'inr' if testing Indian
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `Payment for FieldOps Service`,
            },
            unit_amount: Math.round(invoice.totalAmount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/customer/invoices?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/customer/invoices?canceled=true`,
      metadata: {
        invoiceId: invoice._id.toString(),
        customerId: invoice.customer._id.toString()
      }
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Note: To use webhook signatures, you need a webhook secret from Stripe dashboard
    // If testing without a webhook secret, you can parse req.body directly, but using constructEvent is secure.
    // For this implementation, we will assume STRIPE_WEBHOOK_SECRET is in .env, or we just trust the body in dev mode.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    if (session.metadata && session.metadata.invoiceId) {
      try {
        const invoice = await Invoice.findById(session.metadata.invoiceId);
        if (invoice && invoice.status !== INVOICE_STATUS.PAID) {
          invoice.status = INVOICE_STATUS.PAID;
          await invoice.save();

          // Create payment record
          await Payment.create({
            invoice: invoice._id,
            customer: invoice.customer,
            job: invoice.job,
            amount: session.amount_total / 100, // convert back from cents
            method: 'Credit Card (Stripe)',
            transactionId: session.payment_intent,
            status: 'completed'
          });

          // Notify Customer
          await notifyUser(req.app, {
            userId: invoice.customer,
            title: 'Payment Received',
            message: `Your payment of $${(session.amount_total / 100).toFixed(2)} for Invoice ${invoice.invoiceNumber} was successful.`,
            type: 'billing',
            relatedEntity: 'Invoice',
            relatedEntityId: invoice._id,
            channels: ['inApp']
          });
        }
      } catch (err) {
        console.error("Error updating invoice on webhook:", err);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
};
