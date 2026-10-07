const User = require('../../models/User');
const Job = require('../../models/Job');
const ServiceRequest = require('../../models/ServiceRequest');

/**
 * Analyzes active workload, availability, and skills to recommend technicians for a given service request.
 */
const getTechnicianRecommendations = async (requestId) => {
  const request = await ServiceRequest.findById(requestId);
  if (!request) throw new Error('Service Request not found');

  const allTechs = await User.find({ role: 'technician', isActive: true });
  
  // Find active jobs for all technicians
  const activeJobsAgg = await Job.aggregate([
    { $match: { status: { $in: ['assigned', 'in-progress'] } } },
    { $group: { _id: '$technician', count: { $sum: 1 } } }
  ]);
  
  const activeJobsMap = {};
  activeJobsAgg.forEach(item => {
    activeJobsMap[item._id.toString()] = item.count;
  });

  const recommendations = [];

  for (const tech of allTechs) {
    const activeCount = activeJobsMap[tech._id.toString()] || 0;
    
    // Base score out of 100
    let score = 50; 
    let reasons = [];

    // 1. Availability Status
    if (tech.availabilityStatus === 'AVAILABLE') {
      score += 20;
      reasons.push('Currently marked as available');
    } else if (tech.availabilityStatus === 'OFFLINE') {
      score -= 30;
      reasons.push('Currently offline');
    } else {
      score -= 10;
      reasons.push('Currently marked as busy');
    }

    // 2. Active Workload
    if (activeCount === 0) {
      score += 20;
      reasons.push('Zero active jobs (high availability)');
    } else if (activeCount === 1) {
      score += 10;
      reasons.push('Only 1 active job');
    } else if (activeCount > 3) {
      score -= 20;
      reasons.push(`High current workload (${activeCount} active jobs)`);
    } else {
      reasons.push(`Moderate workload (${activeCount} active jobs)`);
    }

    // 3. Specialty / Skill Match (Assuming ServiceRequest.category corresponds to specialty)
    // E.g., AC Repair, Plumbing, Electrical vs General Maintenance
    if (tech.specialty && request.category && tech.specialty.toLowerCase().includes(request.category.toLowerCase())) {
      score += 10;
      reasons.push('Strong specialty match for this category');
    }

    // Normalize score 0-100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    recommendations.push({
      technician: {
        _id: tech._id,
        name: tech.name,
        specialty: tech.specialty,
        rating: tech.rating
      },
      matchScore: score,
      activeJobs: activeCount,
      reason: reasons.join(' + ')
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};

module.exports = {
  getTechnicianRecommendations
};
