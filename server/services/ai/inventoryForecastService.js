const InventoryTransaction = require('../../models/InventoryTransaction');
const Part = require('../../models/Part');

/**
 * Generates an inventory forecast and stockout risk for all parts.
 * Uses the past 90 days of STOCK_OUT transactions.
 */
const getInventoryForecasts = async () => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Aggregate total consumption over last 90 days per part
  const consumptionAgg = await InventoryTransaction.aggregate([
    { 
      $match: { 
        type: 'STOCK_OUT', 
        createdAt: { $gte: ninetyDaysAgo } 
      } 
    },
    {
      $group: {
        _id: '$part',
        totalConsumed: { $sum: '$quantity' }
      }
    }
  ]);

  const consumptionMap = {};
  consumptionAgg.forEach(item => {
    consumptionMap[item._id.toString()] = item.totalConsumed;
  });

  const parts = await Part.find({ isActive: true });
  const forecasts = [];

  for (const part of parts) {
    const historicalUsage = consumptionMap[part._id.toString()] || 0;
    
    // If not enough data
    if (historicalUsage < 5) {
      forecasts.push({
        part: {
          _id: part._id,
          name: part.name,
          partNumber: part.partNumber
        },
        currentStock: part.stockQuantity,
        historicalUsage,
        predictedDemand: null,
        riskLevel: 'UNKNOWN',
        recommendation: 'Insufficient historical data to generate an accurate 30-day demand forecast. Please continue monitoring manually.',
        confidence: 'LOW'
      });
      continue;
    }

    // Daily run rate over 90 days
    const dailyRunRate = historicalUsage / 90;
    const predicted30DayDemand = Math.ceil(dailyRunRate * 30);

    let riskLevel = 'LOW';
    let recommendation = '';

    if (part.stockQuantity === 0) {
      riskLevel = 'HIGH';
      recommendation = `Part is currently out of stock. Immediate replenishment of at least ${predicted30DayDemand + part.minimumStock} units recommended to cover 30-day forecast and minimum stock.`;
    } else if (part.stockQuantity < predicted30DayDemand) {
      riskLevel = 'HIGH';
      const deficit = predicted30DayDemand - part.stockQuantity;
      recommendation = `High stockout risk. Expected 30-day demand (${predicted30DayDemand}) exceeds current stock (${part.stockQuantity}). Consider replenishing approximately ${deficit + part.minimumStock} units.`;
    } else if (part.stockQuantity < (predicted30DayDemand * 1.5)) {
      riskLevel = 'MEDIUM';
      recommendation = `Moderate stockout risk. Stock is sufficient for expected 30-day demand (${predicted30DayDemand}), but falls below the 45-day safety threshold. Consider ordering soon.`;
    } else {
      riskLevel = 'LOW';
      recommendation = `Stock levels are healthy. Current stock (${part.stockQuantity}) safely covers the predicted 30-day demand (${predicted30DayDemand}). No immediate action required.`;
    }

    forecasts.push({
      part: {
        _id: part._id,
        name: part.name,
        partNumber: part.partNumber
      },
      currentStock: part.stockQuantity,
      historicalUsage,
      predictedDemand: predicted30DayDemand,
      riskLevel,
      recommendation,
      confidence: historicalUsage > 20 ? 'HIGH' : 'MEDIUM'
    });
  }

  // Sort: HIGH risk first, then MEDIUM, then LOW, then UNKNOWN
  const riskOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'UNKNOWN': 4 };
  forecasts.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

  return forecasts;
};

module.exports = {
  getInventoryForecasts
};
