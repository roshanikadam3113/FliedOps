import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTechJobs, acceptJob } from '../../services/jobService';
import { subscribeToEvent } from '../../services/socketService';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function TechnicianJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'completed', 'pending'

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

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId, user);
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    switch (activeTab) {
      case 'assigned':
        return jobs.filter(j => ['assigned', 'in-progress'].includes(j.status));
      case 'completed':
        return jobs.filter(j => j.status === 'completed');
      case 'pending':
        return jobs.filter(j => j.status === 'pending');
      default:
        return [];
    }
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-text-primary bg-page-bg min-h-screen">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          My Service Jobs
        </h1>
        <p className="text-xs text-text-secondary font-semibold mt-0.5">
          View, accept, and execute field service dispatches assigned to you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-6 text-xs font-black uppercase tracking-wider select-none overflow-x-auto">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'assigned'
              ? 'border-brand-accent text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          My Assignments ({jobs.filter(j => ['assigned', 'in-progress'].includes(j.status)).length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-brand-accent text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Available Pool ({jobs.filter(j => j.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'border-brand-accent text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Completed Logs ({jobs.filter(j => j.status === 'completed').length})
        </button>
      </div>

      {/* Jobs list */}
      <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center mx-auto text-text-secondary/50 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">
                No jobs in this category
              </p>
              <p className="text-xs text-text-secondary font-medium max-w-xs mx-auto">
                {activeTab === 'assigned' && 'You have no assigned jobs in progress. Check the available pool.'}
                {activeTab === 'pending' && 'There are no pending dispatches awaiting assignment right now.'}
                {activeTab === 'completed' && 'You have not resolved any service jobs yet.'}
              </p>
            </div>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => (
              <div 
                key={job._id}
                className={`bg-surface-secondary/50 border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-colors ${
                    job.urgency === 'critical' ? 'border-rose-500/50 shadow-[inset_4px_0_0_0_rgba(244,63,94,1)]' :
                    job.urgency === 'high' ? 'border-brand-accent/50 shadow-[inset_4px_0_0_0_rgba(249,115,22,1)]' :
                    job.urgency === 'medium' ? 'border-sky-500/50 shadow-[inset_4px_0_0_0_rgba(14,165,233,1)]' :
                    'border-border-subtle shadow-[inset_4px_0_0_0_rgba(100,116,139,1)]'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        job.status === 'in-progress' || job.status === 'on-the-way' || job.status === 'arrived' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' :
                        job.status === 'assigned' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                      {job.status.replace('-', ' ')}
                    </span>

                    <span className="text-[10px] font-bold text-text-secondary/70">
                      {job.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-text-primary leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border-subtle space-y-2 text-[10px] font-semibold text-text-secondary/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
                      <span>{job.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
                      <span className="line-clamp-1">{job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle/50 mt-auto">
                  {job.status === 'pending' ? (
                    <button
                      onClick={() => handleAccept(job._id)}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-accent hover:bg-orange-600 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Accept Job <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : job.status === 'completed' ? (
                    <div className="flex justify-between items-center text-xs bg-surface-primary p-2.5 rounded-lg border border-border-subtle">
                      <span className="font-bold text-text-secondary">Total Billed</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{job.invoice?.amount || 500}
                      </span>
                    </div>
                  ) : (
                    <Link
                      to="/technician/active-job"
                      state={{ jobId: job._id }}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Resume Work Order
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
