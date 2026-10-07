const Job = require('../../models/Job');
const ServiceRequest = require('../../models/ServiceRequest');
const User = require('../../models/User');

/**
 * Derives operational intelligence from historical data.
 */
const getServiceInsights = async () => {
  // 1. Top categories
  const categoriesAgg = await ServiceRequest.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // 2. Average completion time (for completed jobs)
  const completionTimeAgg = await Job.aggregate([
    { $match: { status: 'completed', startedAt: { $ne: null }, completedAt: { $ne: null } } },
    {
      $project: {
        durationMs: { $subtract: ['$completedAt', '$startedAt'] }
      }
    },
    {
      $group: {
        _id: null,
        avgDurationMs: { $avg: '$durationMs' }
      }
    }
  ]);
  
  let avgDurationHours = 0;
  if (completionTimeAgg.length > 0) {
    avgDurationHours = (completionTimeAgg[0].avgDurationMs / (1000 * 60 * 60)).toFixed(1);
  }

  // 3. Technicians with highest workload (all time completed)
  const topTechsAgg = await Job.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$technician', completedJobs: { $sum: 1 } } },
    { $sort: { completedJobs: -1 } },
    { $limit: 3 }
  ]);
  
  const topTechs = [];
  for (const item of topTechsAgg) {
    const tech = await User.findById(item._id).select('name');
    if (tech) {
      topTechs.push({
        name: tech.name,
        completedJobs: item.completedJobs
      });
    }
  }

  // 4. Most frequently used parts (from Job.partsUsed)
  const topPartsAgg = await Job.aggregate([
    { $unwind: '$partsUsed' },
    { $group: { _id: '$partsUsed.name', totalUsed: { $sum: '$partsUsed.quantity' } } },
    { $sort: { totalUsed: -1 } },
    { $limit: 5 }
  ]);

  return {
    topCategories: categoriesAgg.map(c => ({ category: c._id || 'General', count: c.count })),
    averageCompletionTimeHours: avgDurationHours,
    topTechnicians: topTechs,
    topParts: topPartsAgg.map(p => ({ partName: p._id, totalUsed: p.totalUsed }))
  };
};

module.exports = {
  getServiceInsights
};
