import React, { useState, useEffect } from 'react';
import { getAdminJobs, getAdminTechnicians } from '../../services/adminService';
import { Search, MapPin, Calendar, Wrench, X } from 'lucide-react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTechnician, setFilterTechnician] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterTechnician]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const techRes = await getAdminTechnicians();
      if (techRes.success) {
        setTechnicians(techRes.technicians);
      }

      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterTechnician) params.technician = filterTechnician;

      const data = await getAdminJobs(params);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      setError('Failed to load active jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'assigned': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'on-the-way': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      'arrived': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'in-progress': 'bg-sky-500/10 text-sky-600 border-sky-500/20 animate-pulse',
      'completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      'cancelled': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    };
    const style = styles[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${style}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const styles = {
      'critical': 'text-rose-600 bg-rose-500/10 border-rose-500/20',
      'high': 'text-orange-600 bg-orange-500/10 border-orange-500/20',
      'medium': 'text-sky-600 bg-sky-500/10 border-sky-500/20',
      'standard': 'text-slate-600 bg-slate-500/10 border-slate-500/20',
    };
    const style = styles[priority.toLowerCase()] || styles['standard'];
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${style}`}>
        {priority}
      </span>
    );
  };

  const filteredJobs = jobs.filter(job => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = job._id.toLowerCase().includes(q);
      const matchCustomer = job.customer?.name?.toLowerCase().includes(q);
      const matchTech = job.technician?.name?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchTech) return false;
    }
    if (filterPriority && job.serviceRequest?.urgency?.toLowerCase() !== filterPriority.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Job Management</h1>
          <p className="text-sm font-medium text-text-secondary mt-1">Monitor operational field jobs.</p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by Job ID, Customer, Technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm font-bold bg-surface-secondary border border-border-subtle rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-accent"
          >
            <option value="">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="on-the-way">On the Way</option>
            <option value="arrived">Arrived</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            value={filterTechnician} 
            onChange={e => setFilterTechnician(e.target.value)}
            className="text-sm font-bold bg-surface-secondary border border-border-subtle rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-accent"
          >
            <option value="">All Technicians</option>
            {technicians.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <select 
            value={filterPriority} 
            onChange={e => setFilterPriority(e.target.value)}
            className="text-sm font-bold bg-surface-secondary border border-border-subtle rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-accent"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-600 p-4 rounded-xl font-bold border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-subtle">
            <thead className="bg-surface-secondary/50">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Job ID / Date</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer / Location</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Technician</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Status / Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-secondary font-bold">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr 
                    key={job._id} 
                    className="hover:bg-surface-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">#{job._id.substring(job._id.length - 6).toUpperCase()}</div>
                      <div className="text-xs text-text-secondary">{new Date(job.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-text-primary">{job.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-secondary truncate max-w-[200px]">{job.customer?.location || 'No location'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-text-primary">{job.technician?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-secondary">{job.technician?.phone || 'No phone'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1.5">
                        {getStatusBadge(job.status)}
                        {getPriorityBadge(job.serviceRequest?.urgency)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-primary rounded-xl w-full max-w-2xl border border-border-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h2 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <Wrench className="w-5 h-5 text-brand-accent" />
                 Job Details
              </h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Job ID</div>
                  <div className="text-lg font-extrabold font-mono text-text-primary">#{selectedJob._id.substring(selectedJob._id.length - 8).toUpperCase()}</div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedJob.status)}
                  {getPriorityBadge(selectedJob.serviceRequest?.urgency)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Customer Information</h3>
                    <div className="space-y-1 bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                      <p className="text-sm font-bold text-text-primary">{selectedJob.customer?.name}</p>
                      <p className="text-xs text-text-secondary">{selectedJob.customer?.email}</p>
                      <p className="text-xs text-text-secondary">{selectedJob.customer?.phone}</p>
                      <div className="flex items-start gap-1 text-xs text-text-secondary mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedJob.customer?.location}</span>
                      </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Technician Assigned</h3>
                    <div className="space-y-1 bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                      <p className="text-sm font-bold text-text-primary">{selectedJob.technician?.name}</p>
                      <p className="text-xs text-text-secondary">{selectedJob.technician?.email}</p>
                      <p className="text-xs text-text-secondary">{selectedJob.technician?.phone}</p>
                      <div className="flex items-start gap-1 text-xs text-text-secondary mt-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Scheduled: {selectedJob.scheduledDate || 'Not specified'}</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Service Request Reference</h3>
                 <div className="bg-surface-secondary/50 rounded-lg p-4 border border-border-subtle">
                   <div className="text-sm font-bold text-text-primary mb-1">{selectedJob.serviceRequest?.title} <span className="font-normal text-text-secondary text-xs">({selectedJob.serviceRequest?.category})</span></div>
                   <p className="text-sm text-text-secondary whitespace-pre-wrap">{selectedJob.serviceRequest?.description}</p>
                 </div>
              </div>
              
              {selectedJob.partsUsed && selectedJob.partsUsed.length > 0 && (
                <div>
                   <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Inventory Logged</h3>
                   <div className="bg-surface-secondary/50 rounded-lg p-4 border border-border-subtle overflow-x-auto">
                     <table className="min-w-full">
                       <thead>
                         <tr className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                           <th className="text-left pb-2">Part</th>
                           <th className="text-right pb-2">Qty</th>
                         </tr>
                       </thead>
                       <tbody className="text-sm font-medium text-text-primary">
                         {selectedJob.partsUsed.map((p, idx) => (
                           <tr key={idx} className="border-t border-border-subtle">
                             <td className="py-2">{p.name}</td>
                             <td className="py-2 text-right">{p.quantity}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}

              {selectedJob.resolutionNotes && (
                <div>
                   <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Resolution Notes</h3>
                   <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-sm font-medium whitespace-pre-wrap">
                     {selectedJob.resolutionNotes}
                   </div>
                </div>
              )}

            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-sm font-bold text-text-primary bg-surface-primary border border-border-subtle hover:bg-surface-secondary rounded-lg transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
