import { apiRequest } from '../utils/api';

// Admin Overview
export const getAdminOverview = async () => {
  return await apiRequest('/admin/overview', { method: 'GET' });
};

// Requests
export const getAdminRequests = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/admin/requests${query ? `?${query}` : ''}`, { method: 'GET' });
};

// Jobs
export const getAdminJobs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/admin/jobs${query ? `?${query}` : ''}`, { method: 'GET' });
};

export const assignJob = async (requestId, technicianId) => {
  return await apiRequest(`/admin/jobs/${requestId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ technicianId })
  });
};

// Technicians
export const getAdminTechnicians = async () => {
  return await apiRequest('/admin/technicians', { method: 'GET' });
};

export const getAdminTechnicianById = async (id) => {
  return await apiRequest(`/admin/technicians/${id}`, { method: 'GET' });
};

export const createTechnician = async (technicianData) => {
  return await apiRequest('/admin/technicians', {
    method: 'POST',
    body: JSON.stringify(technicianData)
  });
};

export const updateTechnicianStatus = async (id, statusData) => {
  return await apiRequest(`/admin/technicians/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData)
  });
};

// Customers
export const getAdminCustomers = async () => {
  return await apiRequest('/admin/customers', { method: 'GET' });
};

export const getAdminCustomerById = async (id) => {
  return await apiRequest(`/admin/customers/${id}`, { method: 'GET' });
};

// Invoices
export const getAdminInvoices = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/admin/invoices${query ? '?' + query : ''}`, { method: 'GET' });
};
