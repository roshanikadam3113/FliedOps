import React, { useState, useEffect } from 'react';
import { getAdminRequests } from '../../services/adminService';
import { Search, Filter, X, Calendar, MapPin, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssigned, setFilterAssigned] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filterStatus, filterAssigned, filterPriority]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterAssigned !== '') params.assigned = filterAssigned;
      
      const data = await getAdminRequests(params);
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      setError('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      'assigned': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      'cancelled': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    };
    const style = styles[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${style}`}>
        {status}
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

  const filteredRequests = requests.filter(req => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = req._id.toLowerCase().includes(q);
      const matchTitle = req.title?.toLowerCase().includes(q);
      const matchCustomer = req.customer?.name?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCustomer) return false;
    }
    if (filterPriority && req.urgency?.toLowerCase() !== filterPriority.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Service Requests</h1>
          <p className="text-sm font-medium text-text-secondary mt-1">Review, filter, and track customer requests.</p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by ID, Title, Customer..."
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
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            value={filterAssigned} 
            onChange={e => setFilterAssigned(e.target.value)}
            className="text-sm font-bold bg-surface-secondary border border-border-subtle rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-accent"
          >
            <option value="">All Assignments</option>
            <option value="false">Unassigned</option>
            <option value="true">Assigned</option>
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
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">ID / Date</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Service & Priority</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Technician</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-secondary font-bold">
                    No service requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr 
                    key={req._id} 
                    className="hover:bg-surface-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">#{req._id.substring(req._id.length - 6).toUpperCase()}</div>
                      <div className="text-xs text-text-secondary">{new Date(req.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-text-primary">{req.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-secondary truncate max-w-[150px]">{req.location}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-text-primary">{req.title}</div>
                      <div className="mt-1 flex items-center gap-2">
                         <span className="text-xs text-text-secondary">{req.category}</span>
                         {getPriorityBadge(req.urgency)}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {req.assignedTechnician ? (
                        <div className="text-sm font-bold text-text-primary">{req.assignedTechnician.name}</div>
                      ) : (
                        <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-widest">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-primary rounded-xl w-full max-w-2xl border border-border-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h2 className="text-lg font-black text-text-primary tracking-tight">Request Details</h2>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Request ID</div>
                  <div className="text-lg font-extrabold font-mono text-text-primary">#{selectedRequest._id.substring(selectedRequest._id.length - 8).toUpperCase()}</div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedRequest.status)}
                  {getPriorityBadge(selectedRequest.urgency)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Customer Details</h3>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-text-primary">{selectedRequest.customer?.name}</p>
                      <p className="text-sm text-text-secondary">{selectedRequest.customer?.email}</p>
                      <p className="text-sm text-text-secondary">{selectedRequest.customer?.phone}</p>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Scheduling & Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-text-primary font-medium">
                        <Calendar className="w-4 h-4 mt-0.5 text-text-secondary shrink-0" />
                        <span>{selectedRequest.scheduledDate || 'Not specified'}<br/><span className="text-xs text-text-secondary">{selectedRequest.preferredTime || ''}</span></span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-text-primary font-medium">
                        <MapPin className="w-4 h-4 mt-0.5 text-text-secondary shrink-0" />
                        <span>{selectedRequest.location}</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Service Information</h3>
                 <div className="bg-surface-secondary/50 rounded-lg p-4 border border-border-subtle">
                   <div className="text-sm font-bold text-text-primary mb-1">{selectedRequest.title} <span className="font-normal text-text-secondary text-xs">({selectedRequest.category})</span></div>
                   <p className="text-sm text-text-secondary whitespace-pre-wrap">{selectedRequest.description}</p>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Assignment</h3>
                 {selectedRequest.assignedTechnician ? (
                   <div className="flex items-center gap-3 bg-surface-secondary/50 p-4 rounded-lg border border-border-subtle">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                       <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-text-primary">{selectedRequest.assignedTechnician.name}</div>
                       <div className="text-xs text-text-secondary">Dispatched Technician</div>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                     <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
                       <AlertCircle className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-amber-700 dark:text-amber-400">Not Assigned</div>
                       <div className="text-xs text-amber-700/80 dark:text-amber-500/80">This request requires dispatching</div>
                     </div>
                   </div>
                 )}
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
              >
                Close
              </button>
              {!selectedRequest.assignedTechnician && selectedRequest.status === 'pending' && (
                <Link 
                  to="/admin/dispatch"
                  state={{ preselectRequest: selectedRequest._id }}
                  className="px-5 py-2 bg-brand-accent hover:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  Proceed to Dispatch <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
