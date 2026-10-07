const inventoryForecastService = require('../services/ai/inventoryForecastService');
const technicianRecommendationService = require('../services/ai/technicianRecommendationService');
const serviceIntelligenceService = require('../services/ai/serviceIntelligenceService');

const getInventoryForecasts = async (req, res, next) => {
  try {
    const forecasts = await inventoryForecastService.getInventoryForecasts();
    res.status(200).json({ success: true, forecasts });
  } catch (error) {
    next(error);
  }
};

const getTechnicianRecommendations = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const recommendations = await technicianRecommendationService.getTechnicianRecommendations(requestId);
    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

const getServiceInsights = async (req, res, next) => {
  try {
    const insights = await serviceIntelligenceService.getServiceInsights();
    res.status(200).json({ success: true, insights });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventoryForecasts,
  getTechnicianRecommendations,
  getServiceInsights
};
