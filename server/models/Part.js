const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    partNumber: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      default: 'General'
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    minimumStock: {
      type: Number,
      default: 5,
      min: 0
    },
    unit: {
      type: String,
      default: 'pcs'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

partSchema.index({ partNumber: 1 });
partSchema.index({ isActive: 1 });

module.exports = mongoose.model('Part', partSchema);
