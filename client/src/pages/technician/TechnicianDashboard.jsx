import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTechJobs, acceptJob } from '../../services/jobService';
import { subscribeToEvent } from '../../services/socketService';
import { useAuth } from '../../context/AuthContext';
import { 
  Wrench, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Play, 
  User, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dutyStatus, setDutyStatus] = useState(() => {
    return localStorage.getItem('fieldops_duty_status') || 'active';
  });

  const fetchJobs = async () => {
    try {
      const techJobs = await getTechJobs();
      setJobs(techJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Subscribe to real-time events to reflect new assignments instantly
    const unsubNewJob = subscribeToEvent('newJobAssigned', () => {
      fetchJobs();
    });
    
    const unsubStatusUpdate = subscribeToEvent('serviceStatusUpdated', () => {
      fetchJobs();
    });

    return () => {
      unsubNewJob();
      unsubStatusUpdate();
    };
  }, []);

  const handleDutyToggle = () => {
    const newStatus = dutyStatus === 'active' ? 'off-duty' : 'active';
    setDutyStatus(newStatus);
    localStorage.setItem('fieldops_duty_status', newStatus);
  };

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId, user);
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter metrics
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const activeAssignments = jobs.filter(j => ['assigned', 'in-progress', 'on-the-way', 'arrived'].includes(j.status));
  const pendingRequests = jobs.filter(j => j.status === 'pending');

  // Calculate average rating
  const ratings = completedJobs.filter(j => j.review).map(j => j.review.rating);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '4.9';

  return (
    <div className="space-y-8 pb-12 font-sans antialiased text-text-primary bg-page-bg min-h-screen">
      
      {/* Top Banner with Duty status toggle - Industrial & Functional */}
      <div className="bg-surface-primary text-text-primary rounded-xl p-6 sm:p-8 shadow-sm border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
            Welcome, {user?.name || 'Technician'}
          </h1>
          <p className="text-sm text-text-secondary max-w-xl font-medium">
            Manage your daily dispatch route, log inventory parts consumed, and track completed tasks.
          </p>
        </div>

        {/* Duty Switcher */}
        <div className="bg-surface-secondary border border-border-subtle rounded-lg p-4 flex items-center gap-5 shrink-0 shadow-inner">
          <div>
            <div className="text-[10px] font-black uppercase text-text-secondary tracking-wider">Duty Status</div>
            <div className={`text-sm font-bold mt-1 ${dutyStatus === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary'}`}>
              {dutyStatus === 'active' ? 'Active & Dispatchable' : 'Off-Duty / Inactive'}
            </div>
          </div>
          <button
            onClick={handleDutyToggle}
            className={`w-14 h-7 rounded-full p-1 transition-all duration-200 cursor-pointer ${
              dutyStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                dutyStatus === 'active' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Metrics Row - Industrial standard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Jobs', value: activeAssignments.length, icon: Briefcase, color: 'text-brand-accent' },
          { label: 'Completed Today', value: completedJobs.length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Rating', value: `★ ${avgRating}`, icon: Star, color: 'text-amber-500' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-surface-primary border border-border-subtle p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-center ${metric.color} shrink-0`}>
              <metric.icon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">{metric.label}</span>
              <div className="text-2xl font-black text-text-primary">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Jobs Queue */}
      <div className="bg-surface-primary border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-secondary/50">
          <h2 className="text-lg font-black tracking-tight text-text-primary flex items-center gap-2">
            <Wrench className="w-4 h-4 text-text-secondary" />
            Today's Assignments Queue
          </h2>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-accent/10 text-brand-accent rounded border border-brand-accent/20 uppercase tracking-wider">
            {jobs.filter(j => j.status !== 'completed').length} active tasks
          </span>
        </div>

        <div className="p-6 sm:p-8 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest flex justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
            </div>
          ) : jobs.filter(j => j.status !== 'completed').length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center mx-auto text-text-secondary/50 shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-text-primary">No assignments in queue</p>
                <p className="text-sm text-text-secondary font-medium max-w-sm mx-auto leading-relaxed">
                  You are all caught up! Switch your status to active to listen for incoming dispatch notifications.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.filter(j => j.status !== 'completed').map(job => (
                <div 
                  key={job._id} 
                  className={`bg-surface-primary border rounded-lg p-4 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    job.urgency === 'critical' ? 'border-rose-500/50 shadow-[inset_4px_0_0_0_rgba(244,63,94,1)]' :
                    job.urgency === 'high' ? 'border-brand-accent/50 shadow-[inset_4px_0_0_0_rgba(249,115,22,1)]' :
                    job.urgency === 'medium' ? 'border-sky-500/50 shadow-[inset_4px_0_0_0_rgba(14,165,233,1)]' :
                    'border-border-subtle shadow-[inset_4px_0_0_0_rgba(100,116,139,1)]'
                  }`}
                >
                  <div className="relative z-10 space-y-2 max-w-xl w-full pl-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                        job.status === 'in-progress' || job.status === 'on-the-way' || job.status === 'arrived' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' :
                        job.status === 'assigned' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {(job.status || 'Unknown').replace('-', ' ')}
                      </span>
                      <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                        {job.urgency} priority
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-extrabold text-text-primary leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium line-clamp-1 mt-0.5">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-semibold text-text-secondary/70 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" /> {job.scheduledDate || new Date(job.preferredDate).toLocaleDateString() || 'Unscheduled'}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" /> <span className="truncate">{job.location || (job.address ? `${job.address.street}, ${job.address.city}` : 'No Location')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Operational actions */}
                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {job.status === 'pending' ? (
                      <button
                        onClick={() => handleAccept(job._id)}
                        disabled={dutyStatus !== 'active'}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-brand-accent hover:bg-orange-600 rounded shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Accept Work Order
                      </button>
                    ) : (
                      <Link
                        to="/technician/active-job"
                        state={{ jobId: job._id }}
                        className="w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Start Work Order
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
