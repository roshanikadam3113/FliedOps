import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
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
  Eye
} from 'lucide-react';

export default function MyRequests() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
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
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return job.status === 'pending';
    if (activeTab === 'active') return ['assigned', 'in-progress'].includes(job.status);
    if (activeTab === 'completed') return job.status === 'completed';
    return job.status === 'cancelled';
  });

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            My Service Requests
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Track progress of active issues and view service records
          </p>
        </div>

        <Link
          to="/customer/create-request"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
        >
          <PlusCircle className="w-4 h-4" /> Book a Service
        </Link>
      </div>

      {/* Tabs bar */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
        {['all', 'pending', 'active', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
            }`}
          >
            {tab} Requests
          </button>
        ))}
      </div>

      {/* List container */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading service requests...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0F172A]">No service requests found</p>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                No tickets match the selected status category.
              </p>
            </div>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs space-y-4">
              
              {/* Header: Title, Urgency, Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      job.urgency === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      job.urgency === 'high' ? 'bg-orange-50 text-[#F97316] border border-orange-100' :
                      job.urgency === 'medium' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                      'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {job.urgency} urgency
                    </span>
                    
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {job.category}
                    </span>
                  </div>
                  
                  <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight leading-snug">
                    {job.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                    job.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    job.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    job.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    'bg-sky-50 text-sky-700 border-sky-100 animate-pulse'
                  }`}>
                    {job.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {job.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                    {job.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#475569] font-medium leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                {job.description}
              </p>

              {/* Dispatch Info: Technician and Schedule details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                
                {/* Schedule */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Service Slot</span>
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{job.scheduledDate}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Service Address</span>
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A] truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>

                {/* Technician assignment */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Assigned Technician</span>
                  {job.technician ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-[#F97316]">
                        {job.technician.name.charAt(0)}
                      </div>
                      <div className="font-bold text-[#0F172A]">
                        {job.technician.name} <span className="text-[10px] text-amber-600 font-extrabold">★ {job.technician.rating}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-slate-400 italic">
                      Matching technician...
                    </div>
                  )}
                </div>

              </div>

              {/* Status and Action bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Track Service Link */}
                  {(job.status === 'assigned' || job.status === 'in-progress') && (
                    <Link
                      to="/customer/track"
                      state={{ jobId: job._id }}
                      className="w-full sm:w-auto px-4.5 py-2 text-center text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-600 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" /> Track Tech
                    </Link>
                  )}

                  {/* Payment link if completed and unpaid */}
                  {job.status === 'completed' && job.invoice && !job.invoice.isPaid && (
                    <Link
                      to="/customer/invoices"
                      className="w-full sm:w-auto px-4.5 py-2 text-center text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Pay Invoice
                    </Link>
                  )}

                  {/* Review link if completed and unreviewed */}
                  {job.status === 'completed' && !job.review && (
                    <Link
                      to="/customer/reviews"
                      className="w-full sm:w-auto px-4.5 py-2 text-center text-xs font-bold text-[#F97316] bg-orange-50 border border-orange-200/50 hover:bg-orange-100/50 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Star className="w-4 h-4" /> Leave Review
                    </Link>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
