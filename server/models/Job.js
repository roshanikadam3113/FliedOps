const mongoose = require('mongoose');
const { JOB_STATUS } = require('../utils/constants');

const jobSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    scheduledDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.ASSIGNED
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    serviceNotes: {
      type: String,
      default: ''
    },
    startedAt: {
      type: Date
    },
    partsUsed: [
      {
        part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 }
      }
    ],
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

jobSchema.index({ technician: 1 });
jobSchema.index({ customer: 1 });
jobSchema.index({ serviceRequest: 1 });
jobSchema.index({ status: 1 });

module.exports = mongoose.model('Job', jobSchema);
