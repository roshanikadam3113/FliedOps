const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema(
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
      enum: ['AC & HVAC', 'Electrical', 'Plumbing', 'RO Service', 'CCTV Installation', 'General Maintenance'],
      default: 'General Maintenance'
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
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
    scheduledDate: {
      type: String,
      required: [true, 'Please select a preferred service date']
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    serviceNotes: {
      type: String,
      default: ''
    },
    invoice: {
      amount: {
        type: Number,
        default: 0
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAt: {
        type: Date
      },
      parts: [
        {
          name: String,
          price: Number,
          quantity: Number
        }
      ]
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        default: ''
      },
      createdAt: {
        type: Date
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobRequest', jobRequestSchema);
