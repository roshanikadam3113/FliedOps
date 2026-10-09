const mongoose = require('mongoose');
const { REQUEST_STATUS } = require('../utils/constants');

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a service request title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description of the request']
    },
    category: {
      type: String,
      default: 'General Maintenance'
    },
    serviceType: {
      type: String,
      default: 'Standard Repair'
    },
    contactPhone: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    cancelReason: {
      type: String,
      default: ''
    },
    rescheduledDate: {
      type: String,
      default: ''
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    location: {
      type: String,
      required: [true, 'Please provide the service location']
    },
    fullAddress: {
      type: String,
      required: [true, 'Please provide the full exact address']
    },
    scheduledDate: {
      type: String,
      required: [true, 'Please select a preferred service date']
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
serviceRequestSchema.index({ customer: 1 });
serviceRequestSchema.index({ assignedTechnician: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
