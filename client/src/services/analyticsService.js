import { apiRequest } from '../utils/api';

export const getAnalyticsOverview = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/overview?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch overview analytics');
};

export const getOperationsAnalytics = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/operations?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch operations analytics');
};

export const getTechnicianAnalytics = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/technicians?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch technician analytics');
};

export const getCustomerAnalytics = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/customers?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch customer analytics');
};

export const getFinanceAnalytics = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/finance?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch finance analytics');
};

export const getInventoryAnalytics = async (range, customStart, customEnd) => {
  let url = `/admin/analytics/inventory?range=${range}`;
  if (range === 'custom' && customStart && customEnd) {
    url += `&startDate=${customStart}&endDate=${customEnd}`;
  }
  const data = await apiRequest(url, { method: 'GET' });
  if (data && data.success) return data.data;
  throw new Error(data?.message || 'Failed to fetch inventory analytics');
};
