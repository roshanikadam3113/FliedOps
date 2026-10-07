const mongoose = require('mongoose');
const { INVOICE_STATUS } = require('../utils/constants');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceCharge: {
      type: Number,
      default: 500
    },
    parts: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 }
      }
    ],
    partsTotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(INVOICE_STATUS),
      default: INVOICE_STATUS.PENDING
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ job: 1 });
invoiceSchema.index({ status: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
