import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTechJobs, acceptJob } from '../../services/jobService';
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
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
          My Service Jobs
        </h1>
        <p className="text-xs text-[#64748B] font-semibold mt-0.5">
          View, accept, and execute field service dispatches assigned to you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-black uppercase tracking-wider select-none">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'assigned'
              ? 'border-[#F97316] text-[#0F172A]'
              : 'border-transparent text-slate-400 hover:text-[#0F172A]'
          }`}
        >
          My Assignments ({jobs.filter(j => ['assigned', 'in-progress'].includes(j.status)).length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-[#F97316] text-[#0F172A]'
              : 'border-transparent text-slate-400 hover:text-[#0F172A]'
          }`}
        >
          Available Pool ({jobs.filter(j => j.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'border-[#F97316] text-[#0F172A]'
              : 'border-transparent text-slate-400 hover:text-[#0F172A]'
          }`}
        >
          Completed Logs ({jobs.filter(j => j.status === 'completed').length})
        </button>
      </div>

      {/* Jobs list */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading job logs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0F172A]">
                No jobs in this category
              </p>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                {activeTab === 'assigned' && 'You have no assigned jobs in progress. Check the available pool.'}
                {activeTab === 'pending' && 'There are no pending dispatches awaiting assignment right now.'}
                {activeTab === 'completed' && 'You have not resolved any service jobs yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map(job => (
              <div 
                key={job._id}
                className="bg-[#F8FAFC] hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      job.urgency === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      job.urgency === 'high' ? 'bg-orange-50 text-[#F97316] border border-orange-100' :
                      job.urgency === 'medium' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                      'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {job.urgency} priority
                    </span>

                    <span className="text-[10px] font-bold text-[#64748B]">
                      {job.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0F172A] leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 space-y-2 text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {job.status === 'pending' ? (
                    <button
                      onClick={() => handleAccept(job._id)}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Accept Job <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : job.status === 'completed' ? (
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Total Billed</span>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        ₹{job.invoice?.amount || 500}
                      </span>
                    </div>
                  ) : (
                    <Link
                      to="/technician/active-job"
                      state={{ jobId: job._id }}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume Work Order
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
