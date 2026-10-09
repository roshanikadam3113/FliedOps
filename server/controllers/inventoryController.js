const Part = require('../models/Part');
const InventoryTransaction = require('../models/InventoryTransaction');
const Job = require('../models/Job');
const mongoose = require('mongoose');

// =======================
// ADMIN INVENTORY APIs
// =======================

const getInventory = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    
    if (status === 'low-stock') {
      query.$expr = { $lte: ['$stockQuantity', '$minimumStock'] };
      query.isActive = true;
    } else if (status === 'out-of-stock') {
      query.stockQuantity = 0;
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'in-stock') {
      query.stockQuantity = { $gt: 0 };
      query.isActive = true;
    } else {
      // all active by default if not specified or all if specified
      if (status !== 'all') {
         query.isActive = true;
      }
    }

    const parts = await Part.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, parts });
  } catch (error) {
    next(error);
  }
};

const getPartById = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }
    res.status(200).json({ success: true, part });
  } catch (error) {
    next(error);
  }
};

const createPart = async (req, res, next) => {
  try {
    const { name, partNumber, description, category, unitPrice, initialStock, minimumStock, unit } = req.body;
    
    if (!name || !partNumber || unitPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide name, partNumber and unitPrice' });
    }

    if (unitPrice < 0 || (initialStock !== undefined && initialStock < 0) || (minimumStock !== undefined && minimumStock < 0)) {
      return res.status(400).json({ success: false, message: 'Price and stock cannot be negative' });
    }

    const exists = await Part.findOne({ partNumber });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Part number already exists' });
    }

    const stockQuantity = initialStock || 0;

    const part = new Part({
      name,
      partNumber,
      description,
      category,
      unitPrice,
      stockQuantity,
      minimumStock,
      unit
    });
    
    await part.save();

    if (stockQuantity > 0) {
      await InventoryTransaction.create({
        part: part._id,
        type: 'STOCK_IN',
        quantity: stockQuantity,
        previousStock: 0,
        newStock: stockQuantity,
        reason: 'Initial Stock',
        performedBy: req.user._id
      });
    }

    res.status(201).json({ success: true, part });
  } catch (error) {
    next(error);
  }
};

const updatePart = async (req, res, next) => {
  try {
    const { name, description, category, unitPrice, minimumStock, unit, isActive } = req.body;
    const part = await Part.findById(req.params.id);
    
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }

    if (unitPrice !== undefined && unitPrice < 0) return res.status(400).json({ success: false, message: 'Invalid price' });
    if (minimumStock !== undefined && minimumStock < 0) return res.status(400).json({ success: false, message: 'Invalid min stock' });

    if (name !== undefined) part.name = name;
    if (description !== undefined) part.description = description;
    if (category !== undefined) part.category = category;
    if (unitPrice !== undefined) part.unitPrice = unitPrice;
    if (minimumStock !== undefined) part.minimumStock = minimumStock;
    if (unit !== undefined) part.unit = unit;
    if (isActive !== undefined) part.isActive = isActive;

    await part.save();
    res.status(200).json({ success: true, part });
  } catch (error) {
    next(error);
  }
};

const adjustStock = async (req, res, next) => {
  try {
    const { adjustment, reason } = req.body;
    // adjustment can be positive (STOCK_IN) or negative (ADJUSTMENT out)
    if (adjustment === undefined || adjustment === 0) {
      return res.status(400).json({ success: false, message: 'Invalid adjustment amount' });
    }

    // Use transaction for atomic stock adjustment if replica set is available, else use findOneAndUpdate with condition
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const part = await Part.findById(req.params.id).session(session);
      if (!part) {
        throw new Error('Part not found');
      }

      if (!part.isActive) {
        throw new Error('Cannot adjust stock for inactive part');
      }

      const previousStock = part.stockQuantity;
      const newStock = previousStock + adjustment;

      if (newStock < 0) {
        throw new Error('Stock cannot become negative');
      }

      part.stockQuantity = newStock;
      await part.save({ session });

      const type = adjustment > 0 ? 'STOCK_IN' : 'ADJUSTMENT';
      const absQuantity = Math.abs(adjustment);

      const transaction = new InventoryTransaction({
        part: part._id,
        type,
        quantity: absQuantity,
        previousStock,
        newStock,
        reason: reason || 'Manual adjustment',
        performedBy: req.user._id
      });
      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ success: true, part, transaction });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      if (err.message === 'Part not found') return res.status(404).json({ success: false, message: err.message });
      if (err.message === 'Stock cannot become negative' || err.message === 'Cannot adjust stock for inactive part') {
        return res.status(400).json({ success: false, message: err.message });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { partId } = req.query;
    const query = partId ? { part: partId } : {};
    const transactions = await InventoryTransaction.find(query)
      .populate('part', 'name partNumber')
      .populate('performedBy', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

// =======================
// TECHNICIAN INVENTORY APIs
// =======================

const getAvailableParts = async (req, res, next) => {
  try {
    const parts = await Part.find({ isActive: true, stockQuantity: { $gt: 0 } })
      .select('-minimumStock -createdAt -updatedAt') // hide admin specifics
      .sort({ name: 1 });
    res.status(200).json({ success: true, parts });
  } catch (error) {
    next(error);
  }
};

const addPartToJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const { partId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const job = await Job.findOne({ $or: [{ _id: jobId }, { serviceRequest: jobId }] }).session(session);
      if (!job) throw new Error('Job not found');

      if (job.technician.toString() !== req.user._id.toString()) {
        throw new Error('Forbidden');
      }

      if (['completed', 'cancelled'].includes(job.status)) {
        throw new Error('Cannot add parts to completed or cancelled job');
      }

      const part = await Part.findById(partId).session(session);
      if (!part) throw new Error('Part not found');
      if (!part.isActive) throw new Error('Part is inactive');

      if (part.stockQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Deduct stock
      const previousStock = part.stockQuantity;
      part.stockQuantity -= quantity;
      const newStock = part.stockQuantity;
      await part.save({ session });

      // Create transaction
      const transaction = new InventoryTransaction({
        part: part._id,
        type: 'STOCK_OUT',
        quantity,
        previousStock,
        newStock,
        reason: 'Consumed in job',
        job: job._id,
        performedBy: req.user._id
      });
      await transaction.save({ session });

      // Add to job partsUsed
      // check if part already in partsUsed to merge or just push new
      const existingPartIndex = job.partsUsed.findIndex(p => p.part.toString() === part._id.toString());
      if (existingPartIndex !== -1) {
        job.partsUsed[existingPartIndex].quantity += quantity;
        job.partsUsed[existingPartIndex].total = job.partsUsed[existingPartIndex].quantity * job.partsUsed[existingPartIndex].unitPrice;
      } else {
        job.partsUsed.push({
          part: part._id,
          name: part.name,
          quantity,
          unitPrice: part.unitPrice,
          total: quantity * part.unitPrice
        });
      }

      await job.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Return the aggregated job format that the frontend expects
      const { aggregateJobData } = require('./requestController');
      const ServiceRequest = require('../models/ServiceRequest');
      const requestLean = await ServiceRequest.findById(job.serviceRequest).populate('assignedTechnician').lean();
      const aggregated = await aggregateJobData(requestLean);

      res.status(200).json({ success: true, job: aggregated });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      if (err.message === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });
      if (err.message === 'Insufficient stock' || err.message === 'Cannot add parts to completed or cancelled job') {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (err.message === 'Part not found' || err.message === 'Job not found') {
         return res.status(404).json({ success: false, message: err.message });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  getPartById,
  createPart,
  updatePart,
  adjustStock,
  getTransactions,
  getAvailableParts,
  addPartToJob
};
