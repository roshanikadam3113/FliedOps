import { apiRequest } from '../utils/api';

export const getJobs = async () => {
  const data = await apiRequest('/jobs/my-jobs', { method: 'GET' });
  if (data && data.success) {
    return data.jobs;
  }
  throw new Error(data?.message || 'Failed to fetch jobs');
};

export const getJobById = async (jobId) => {
  const data = await apiRequest(`/jobs/${jobId}`, { method: 'GET' });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to fetch job details');
};

export const createRequest = async (requestData) => {
  const data = await apiRequest('/jobs/create', {
    method: 'POST',
    body: JSON.stringify(requestData)
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to create job request');
};

export const cancelRequest = async (jobId, cancelReason) => {
  const data = await apiRequest(`/jobs/${jobId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ cancelReason })
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to cancel job request');
};

export const rescheduleRequest = async (jobId, scheduledDate) => {
  const data = await apiRequest(`/jobs/${jobId}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ scheduledDate })
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to reschedule job request');
};

export const payInvoice = async (jobId) => {
  const data = await apiRequest(`/jobs/${jobId}/pay`, { method: 'PUT' });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to pay invoice');
};

export const submitReview = async (jobId, rating, comment) => {
  const data = await apiRequest(`/jobs/${jobId}/review`, {
    method: 'PUT',
    body: JSON.stringify({ rating, comment })
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to submit review');
};

export const updateUserProfile = async (profileData) => {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  if (data && data.success) {
    localStorage.setItem('fieldops_user', JSON.stringify(data.user));
    return data.user;
  }
  throw new Error(data?.message || 'Failed to update profile');
};

export const fetchNotifications = async () => {
  const data = await apiRequest('/notifications', { method: 'GET' });
  if (data && data.success) {
    return data.notifications;
  }
  throw new Error(data?.message || 'Failed to fetch notifications');
};

export const fetchUnreadNotificationCount = async () => {
  const data = await apiRequest('/notifications/unread-count', { method: 'GET' });
  if (data && data.success) {
    return data.count;
  }
  return 0;
};

export const markNotificationRead = async (id) => {
  await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
};

export const markAllNotificationsRead = async () => {
  await apiRequest('/notifications/read-all', { method: 'PATCH' });
};

export const getTechJobs = async () => {
  const data = await apiRequest('/jobs/tech-jobs', { method: 'GET' });
  if (data && data.success) {
    return data.jobs;
  }
  throw new Error(data?.message || 'Failed to fetch technician jobs');
};

export const acceptJob = async (jobId, techUser) => {
  const data = await apiRequest(`/jobs/${jobId}/accept`, { method: 'PUT' });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to accept job');
};

export const updateJobStatus = async (jobId, status) => {
  const data = await apiRequest(`/jobs/${jobId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to update job status');
};

export const completeJob = async (jobId, { serviceNotes, parts }) => {
  const data = await apiRequest(`/jobs/${jobId}/complete`, {
    method: 'PUT',
    body: JSON.stringify({ serviceNotes, parts })
  });
  if (data && data.success) {
    return data.job;
  }
  throw new Error(data?.message || 'Failed to complete job');
};

export const getMyInvoices = async () => {
  const data = await apiRequest('/invoices', { method: 'GET' });
  if (data && data.success) {
    return data.invoices;
  }
  throw new Error(data?.message || 'Failed to fetch invoices');
};

export const getAdminInvoices = async () => {
  const data = await apiRequest('/admin/invoices', { method: 'GET' });
  if (data && data.success) {
    return data.invoices;
  }
  throw new Error(data?.message || 'Failed to fetch admin invoices');
};
