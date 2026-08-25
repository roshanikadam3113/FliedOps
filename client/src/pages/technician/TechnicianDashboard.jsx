import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTechJobs, acceptJob } from '../../services/jobService';
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
  const activeAssignments = jobs.filter(j => ['assigned', 'in-progress'].includes(j.status));
  const pendingRequests = jobs.filter(j => j.status === 'pending');

  // Calculate average rating
  const ratings = completedJobs.filter(j => j.review).map(j => j.review.rating);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '4.9';

  return (
    <div className="space-y-8 font-sans antialiased text-[#0F172A]">
      
      {/* Top Banner with Duty status toggle */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[140%] rounded-full bg-[#F97316]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[140%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-orange-400">{user?.name || 'Technician'}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-medium">
              Manage your daily dispatch route, log inventory parts consumed, and track completed tasks.
            </p>
          </div>

          {/* Duty Switcher */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Duty Status</div>
              <div className="text-xs font-bold text-white mt-0.5">
                {dutyStatus === 'active' ? 'Active & Dispatchable' : 'Off-Duty / Inactive'}
              </div>
            </div>
            <button
              onClick={handleDutyToggle}
              className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                dutyStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                  dutyStatus === 'active' ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Active Jobs</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">{activeAssignments.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Completed</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">{completedJobs.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Performance</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">★ {avgRating}</div>
          </div>
        </div>
      </div>

      {/* Today's Jobs Queue */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight text-[#0F172A] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#F97316]" /> Today's Assignments Queue
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-[#F97316] rounded-full">
            {jobs.filter(j => j.status !== 'completed').length} active tasks
          </span>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Syncing work dispatches...
            </div>
          ) : jobs.filter(j => j.status !== 'completed').length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#0F172A]">No assignments in queue</p>
                <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                  You are all caught up! Switch your status to active to listen for incoming dispatch notifications.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.filter(j => j.status !== 'completed').map(job => (
                <div key={job._id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        job.urgency === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse' :
                        job.urgency === 'high' ? 'bg-orange-50 text-[#F97316] border border-orange-100' :
                        job.urgency === 'medium' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                        'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {job.urgency} priority
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        job.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border border-blue-150' :
                        job.status === 'assigned' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {job.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-extrabold text-[#0F172A] leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-1">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" /> {job.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Operational actions */}
                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                    {job.status === 'pending' ? (
                      <button
                        onClick={() => handleAccept(job._id)}
                        disabled={dutyStatus !== 'active'}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Accept Work Order
                      </button>
                    ) : (
                      <Link
                        to="/technician/active-job"
                        state={{ jobId: job._id }}
                        className="w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-600 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Work Order
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
