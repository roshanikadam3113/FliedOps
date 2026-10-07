import { apiRequest } from '../utils/api';

export const getInventoryForecasts = async () => {
  const data = await apiRequest('/admin/ai/inventory-forecast', { method: 'GET' });
  if (data && data.success) return data.forecasts;
  throw new Error(data?.message || 'Failed to fetch inventory forecasts');
};

export const getTechnicianRecommendations = async (requestId) => {
  const data = await apiRequest(`/admin/ai/technician-recommendations/${requestId}`, { method: 'GET' });
  if (data && data.success) return data.recommendations;
  throw new Error(data?.message || 'Failed to fetch technician recommendations');
};

export const getServiceInsights = async () => {
  const data = await apiRequest('/admin/ai/service-insights', { method: 'GET' });
  if (data && data.success) return data.insights;
  throw new Error(data?.message || 'Failed to fetch service insights');
};
