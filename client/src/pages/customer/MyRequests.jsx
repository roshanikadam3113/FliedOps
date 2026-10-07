import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, cancelRequest, rescheduleRequest } from '../../services/jobService';
import RequestDetailsModal from '../../components/customer/RequestDetailsModal';
import { 
  FileText, 
  Clock, 
  MapPin, 
  Wrench, 
  PlusCircle, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  X
} from 'lucide-react';

export default function MyRequests() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  
  // Cancel Modal state
  const [cancelModalJob, setCancelModalJob] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  // Reschedule Modal state
  const [rescheduleModalJob, setRescheduleModalJob] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  
  const [actionLoading, setActionLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalJob) return;
    setActionLoading(true);
    try {
      await cancelRequest(cancelModalJob._id, cancelReason);
      setCancelModalJob(null);
      setCancelReason('');
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModalJob || !newDate) return;
    setActionLoading(true);
    try {
      const fullDate = `${newDate} at ${newTime}`;
      await rescheduleRequest(rescheduleModalJob._id, fullDate);
      setRescheduleModalJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return job.status === 'pending';
    if (activeTab === 'active') return ['assigned', 'on-the-way', 'arrived', 'in-progress'].includes(job.status);
    if (activeTab === 'completed') return job.status === 'completed';
    return job.status === 'cancelled';
  });

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            My Service Requests
          </h1>
          <p className="text-xs text-text-secondary font-semibold">
            Manage your service tickets, view details, track progress, or reschedule
          </p>
        </div>

        <Link
          to="/customer/create-request"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-accent hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
        >
          <PlusCircle className="w-4 h-4" /> Book a Service
        </Link>
      </div>

      {/* Tabs bar */}
      <div className="border-b border-border-subtle flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
        {['all', 'pending', 'active', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-text-primary text-page-bg shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            {tab} Requests
          </button>
        ))}
      </div>

      {/* List container */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-12 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
            Loading service requests...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-surface-secondary flex items-center justify-center mx-auto text-text-secondary/50">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">No service requests found</p>
              <p className="text-xs text-text-secondary font-semibold max-w-xs mx-auto">
                No tickets match the selected status category.
              </p>
            </div>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
              
              {/* Header: ID, Category, Urgency, Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-surface-secondary text-text-secondary">
                      #{job._id.slice(-6).toUpperCase()}
                    </span>
                    
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                      {job.category}
                    </span>

                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      job.urgency === 'critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                      job.urgency === 'high' ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20' :
                      'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                    }`}>
                      {job.urgency} urgency
                    </span>
                  </div>
                  
                  <h2 className="text-base font-extrabold text-text-primary tracking-tight leading-snug">
                    {job.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                    job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                    job.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    job.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                    'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 animate-pulse'
                  }`}>
                    {job.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {job.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                    {job.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary font-medium leading-relaxed bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle line-clamp-2">
                {job.description}
              </p>

              {/* Dispatch Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-border-subtle text-xs">
                
                {/* Schedule */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Service Slot</span>
                  <div className="flex items-center gap-1.5 font-bold text-text-primary">
                    <Clock className="w-4 h-4 text-text-secondary/50 shrink-0" />
                    <span>{job.scheduledDate}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Service Address</span>
                  <div className="flex items-center gap-1.5 font-bold text-text-primary truncate">
                    <MapPin className="w-4 h-4 text-text-secondary/50 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>

                {/* Technician assignment */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Assigned Technician</span>
                  {job.technician ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-accent/10 flex items-center justify-center text-xs font-black text-brand-accent">
                        {job.technician.name ? job.technician.name.charAt(0) : 'T'}
                      </div>
                      <div className="font-bold text-text-primary">
                        {job.technician.name} <span className="text-[10px] text-amber-500 font-extrabold">★ {job.technician.rating || 4.9}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-text-secondary/50 italic">
                      Technician not assigned yet
                    </div>
                  )}
                </div>

              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-border-subtle">
                <div className="text-[10px] font-bold text-text-secondary/50 uppercase">
                  Requested on {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  
                  {/* View Details Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="px-3.5 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary bg-surface-secondary hover:bg-surface-secondary/80 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-border-subtle"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>

                  {/* Reschedule button if allowed */}
                  {['pending', 'assigned'].includes(job.status) && (
                    <button
                      type="button"
                      onClick={() => setRescheduleModalJob(job)}
                      className="px-3.5 py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Reschedule
                    </button>
                  )}

                  {/* Cancel button if allowed */}
                  {['pending', 'assigned'].includes(job.status) && (
                    <button
                      type="button"
                      onClick={() => setCancelModalJob(job)}
                      className="px-3.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}

                  {/* Track Service Link */}
                  {['assigned', 'on-the-way', 'arrived', 'in-progress'].includes(job.status) && (
                    <Link
                      to="/customer/track"
                      state={{ jobId: job._id }}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-brand-accent hover:opacity-90 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Track Tech
                    </Link>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Details Modal Component */}
      {selectedJobForDetails && (
        <RequestDetailsModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
          onCancel={(j) => setCancelModalJob(j)}
          onReschedule={(j) => setRescheduleModalJob(j)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border-subtle space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="text-base font-extrabold text-text-primary">Cancel Service Request</h3>
              <button onClick={() => setCancelModalJob(null)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-text-secondary font-medium">
              Are you sure you want to cancel request <strong className="text-text-primary">"{cancelModalJob.title}"</strong>?
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Reason for cancellation</label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Optional reason for cancellation..."
                  className="w-full p-3 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 bg-surface-secondary focus:bg-surface-primary text-text-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalJob(null)}
                  className="px-4 py-2 border border-border-subtle text-xs font-bold text-text-secondary hover:bg-surface-secondary rounded-xl transition-colors"
                >
                  Keep Request
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Date Modal */}
      {rescheduleModalJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border-subtle space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="text-base font-extrabold text-text-primary">Reschedule Service Slot</h3>
              <button onClick={() => setRescheduleModalJob(null)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary focus:bg-surface-primary text-text-primary focus:outline-none focus:border-brand-accent [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Preferred Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary focus:bg-surface-primary text-text-primary focus:outline-none focus:border-brand-accent"
                >
                  <option value="09:00 AM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM">Late Afternoon (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalJob(null)}
                  className="px-4 py-2 border border-border-subtle text-xs font-bold text-text-secondary hover:bg-surface-secondary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-brand-accent hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {actionLoading ? 'Updating...' : 'Save New Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
