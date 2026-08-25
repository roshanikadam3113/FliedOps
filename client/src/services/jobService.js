import { apiRequest } from '../utils/api';

// Pre-populated demo jobs for the customer (Roshani Kadam: demo_cust_1)
const defaultDemoJobs = [
  {
    _id: 'job_demo_1',
    customer: 'demo_cust_1',
    title: 'AC Cooling Leakage & Servicing',
    description: 'AC unit in bedroom is dripping water from the indoor fan blower and not cooling efficiently.',
    category: 'AC & HVAC',
    status: 'in-progress',
    urgency: 'high',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-26 at 11:30 AM',
    technician: {
      _id: 'demo_tech_1',
      name: 'Rahul Sharma',
      email: 'rahul@fieldops.com',
      role: 'technician',
      phone: '+91 98123 45678',
      specialty: 'AC & HVAC',
      rating: 4.9
    },
    invoice: {
      amount: 1800,
      isPaid: false
    },
    review: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'job_demo_2',
    customer: 'demo_cust_1',
    title: 'Kitchen Tap Leakage Repair',
    description: 'The kitchen sink tap is dripping constantly even when turned off tightly. Water is pooling under the cabinet.',
    category: 'Plumbing',
    status: 'completed',
    urgency: 'medium',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-24 at 09:30 AM',
    technician: {
      _id: 'demo_tech_1',
      name: 'Rahul Sharma',
      email: 'rahul@fieldops.com',
      role: 'technician',
      phone: '+91 98123 45678',
      specialty: 'AC & HVAC',
      rating: 4.9
    },
    invoice: {
      amount: 850,
      isPaid: true,
      paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    review: {
      rating: 5,
      comment: 'Excellent work by Rahul! He arrived right on time and replaced the washer in 15 minutes. Very polite.',
      createdAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000).toISOString()
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'job_demo_3',
    customer: 'demo_cust_1',
    title: 'Power Outage in Living Room Socket Line',
    description: 'A sudden spark occurred in the main TV wall socket line, now all sockets in the living room have lost power.',
    category: 'Electrical',
    status: 'pending',
    urgency: 'critical',
    location: 'Sector 62, Kolhapur',
    scheduledDate: '2026-08-25 at 04:00 PM',
    technician: null,
    invoice: {
      amount: 0,
      isPaid: false
    },
    review: null,
    createdAt: new Date().toISOString()
  }
];

// Helper to initialize local storage jobs if empty
const getLocalJobs = () => {
  const localJobs = localStorage.getItem('fieldops_local_jobs');
  if (!localJobs) {
    localStorage.setItem('fieldops_local_jobs', JSON.stringify(defaultDemoJobs));
    return defaultDemoJobs;
  }
  return JSON.parse(localJobs);
};

const saveLocalJobs = (jobs) => {
  localStorage.setItem('fieldops_local_jobs', JSON.stringify(jobs));
};

export const getJobs = async () => {
  try {
    const data = await apiRequest('/jobs/my-jobs', { method: 'GET' });
    if (data && data.success) {
      // Sync local storage for consistency when offline
      saveLocalJobs(data.jobs);
      return data.jobs;
    }
  } catch (error) {
    console.warn('API connection inactive, falling back to local/demo persistent store:', error.message);
  }

  // Fallback: filter local storage jobs matching current customer
  const savedUser = localStorage.getItem('fieldops_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const customerId = currentUser?._id || 'demo_cust_1';

  const localJobs = getLocalJobs();
  return localJobs.filter(j => j.customer === customerId);
};

export const createRequest = async (requestData) => {
  try {
    const data = await apiRequest('/jobs/create', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API create inactive, saving to local store:', error.message);
  }

  const savedUser = localStorage.getItem('fieldops_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const customerId = currentUser?._id || 'demo_cust_1';

  // Local fallback save
  const localJobs = getLocalJobs();
  const newJob = {
    _id: `job_loc_${Date.now()}`,
    customer: customerId,
    title: requestData.title,
    description: requestData.description,
    category: requestData.category || 'General Maintenance',
    status: 'pending',
    urgency: requestData.urgency || 'medium',
    location: requestData.location,
    scheduledDate: requestData.scheduledDate,
    technician: null,
    invoice: {
      amount: 0,
      isPaid: false
    },
    review: null,
    createdAt: new Date().toISOString()
  };

  localJobs.unshift(newJob);
  saveLocalJobs(localJobs);
  return newJob;
};

export const payInvoice = async (jobId) => {
  try {
    const data = await apiRequest(`/jobs/${jobId}/pay`, { method: 'PUT' });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API invoice payment inactive, updating local store:', error.message);
  }

  const localJobs = getLocalJobs();
  const jobIndex = localJobs.findIndex(j => j._id === jobId);
  if (jobIndex !== -1) {
    localJobs[jobIndex].invoice.isPaid = true;
    localJobs[jobIndex].invoice.paidAt = new Date().toISOString();
    saveLocalJobs(localJobs);
    return localJobs[jobIndex];
  }
  return null;
};

export const submitReview = async (jobId, rating, comment) => {
  try {
    const data = await apiRequest(`/jobs/${jobId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment })
    });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API review submission inactive, updating local store:', error.message);
  }

  const localJobs = getLocalJobs();
  const jobIndex = localJobs.findIndex(j => j._id === jobId);
  if (jobIndex !== -1) {
    localJobs[jobIndex].review = {
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };
    saveLocalJobs(localJobs);
    return localJobs[jobIndex];
  }
  return null;
};

export const getTechJobs = async () => {
  try {
    const data = await apiRequest('/jobs/tech-jobs', { method: 'GET' });
    if (data && data.success) {
      return data.jobs;
    }
  } catch (error) {
    console.warn('API tech connection inactive, falling back to local persistent store:', error.message);
  }
  
  // Fallback: filter local storage jobs matching current tech or pending
  const savedUser = localStorage.getItem('fieldops_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const techId = currentUser?._id || 'demo_tech_1';

  const localJobs = getLocalJobs();
  return localJobs.filter(j => 
    j.status === 'pending' || 
    (j.technician && (j.technician === techId || j.technician._id === techId))
  );
};

export const acceptJob = async (jobId, techUser) => {
  try {
    const data = await apiRequest(`/jobs/${jobId}/accept`, { method: 'PUT' });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API accept job inactive, saving to local store:', error.message);
  }

  const localJobs = getLocalJobs();
  const jobIndex = localJobs.findIndex(j => j._id === jobId);
  if (jobIndex !== -1) {
    localJobs[jobIndex].status = 'assigned';
    localJobs[jobIndex].technician = techUser || {
      _id: 'demo_tech_1',
      name: 'Rahul Sharma',
      email: 'rahul@fieldops.com',
      role: 'technician',
      phone: '+91 98123 45678',
      specialty: 'AC & HVAC',
      rating: 4.9
    };
    saveLocalJobs(localJobs);
    return localJobs[jobIndex];
  }
  return null;
};

export const updateJobStatus = async (jobId, status) => {
  try {
    const data = await apiRequest(`/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API status update inactive, saving to local store:', error.message);
  }

  const localJobs = getLocalJobs();
  const jobIndex = localJobs.findIndex(j => j._id === jobId);
  if (jobIndex !== -1) {
    localJobs[jobIndex].status = status;
    saveLocalJobs(localJobs);
    return localJobs[jobIndex];
  }
  return null;
};

export const completeJob = async (jobId, { serviceNotes, parts }) => {
  try {
    const data = await apiRequest(`/jobs/${jobId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ serviceNotes, parts })
    });
    if (data && data.success) {
      return data.job;
    }
  } catch (error) {
    console.warn('API job completion inactive, saving to local store:', error.message);
  }

  const localJobs = getLocalJobs();
  const jobIndex = localJobs.findIndex(j => j._id === jobId);
  if (jobIndex !== -1) {
    let partsAmount = 0;
    const loggedParts = parts || [];
    loggedParts.forEach(p => {
      partsAmount += (p.price || 0) * (p.quantity || 1);
    });
    const totalAmount = 500 + partsAmount;

    localJobs[jobIndex].status = 'completed';
    localJobs[jobIndex].serviceNotes = serviceNotes || '';
    localJobs[jobIndex].invoice = {
      amount: totalAmount,
      isPaid: false,
      parts: loggedParts
    };
    saveLocalJobs(localJobs);
    return localJobs[jobIndex];
  }
  return null;
};
