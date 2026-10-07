import { apiRequest } from '../utils/api';

// Admin APIs
export const getInventory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const data = await apiRequest(`/inventory?${query}`, { method: 'GET' });
  if (data && data.success) return data.parts;
  throw new Error(data?.message || 'Failed to fetch inventory');
};

export const createPart = async (partData) => {
  const data = await apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(partData)
  });
  if (data && data.success) return data.part;
  throw new Error(data?.message || 'Failed to create part');
};

export const updatePart = async (id, partData) => {
  const data = await apiRequest(`/inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(partData)
  });
  if (data && data.success) return data.part;
  throw new Error(data?.message || 'Failed to update part');
};

export const adjustStock = async (id, adjustment, reason) => {
  const data = await apiRequest(`/inventory/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ adjustment, reason })
  });
  if (data && data.success) return data;
  throw new Error(data?.message || 'Failed to adjust stock');
};

export const getTransactions = async (partId = '') => {
  const query = partId ? `?partId=${partId}` : '';
  const data = await apiRequest(`/inventory/transactions${query}`, { method: 'GET' });
  if (data && data.success) return data.transactions;
  throw new Error(data?.message || 'Failed to fetch transactions');
};

// Technician APIs
export const getAvailableParts = async () => {
  const data = await apiRequest('/inventory/available', { method: 'GET' });
  if (data && data.success) return data.parts;
  throw new Error(data?.message || 'Failed to fetch available parts');
};

export const addPartToJob = async (jobId, partId, quantity) => {
  const data = await apiRequest(`/inventory/job/${jobId}/add-part`, {
    method: 'POST',
    body: JSON.stringify({ partId, quantity })
  });
  if (data && data.success) return data.job;
  throw new Error(data?.message || 'Failed to add part to job');
};
