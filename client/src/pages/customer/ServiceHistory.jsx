import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Receipt,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function ServiceHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await getJobs();
        // Only keep completed and cancelled requests in history
        setJobs(fetchedJobs.filter(j => ['completed', 'cancelled'].includes(j.status)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Navigation and Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link 
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Service History
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Review past resolved tickets, invoices, and technician ratings
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading service history...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0F172A]">No past service history</p>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                Completed and resolved service requests will be archived here.
              </p>
            </div>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs space-y-4">
              
              {/* Header: Title & Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {job.category}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      job.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-[#0F172A]">
                    {job.title}
                  </h2>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Service Completed</span>
                  <span className="font-bold text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#475569] font-medium leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                {job.description}
              </p>

              {/* Details & Billing info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                
                {/* Left side: Technician details */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase text-[#64748B] tracking-wider">
                    Service Professional
                  </h3>
                  {job.technician ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-black text-[#F97316]">
                        {job.technician.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#0F172A]">{job.technician.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{job.technician.specialty} Specialist</div>
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-slate-400 font-semibold">No technician assigned</span>
                  )}
                </div>

                {/* Right side: Invoice and Rating Info */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Invoice */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Service Billing</span>
                    {job.invoice && job.invoice.amount > 0 ? (
                      <div className="space-y-1">
                        <span className="font-extrabold text-[#0F172A] text-sm">₹{job.invoice.amount}</span>
                        <span className={`block text-[9px] font-black uppercase tracking-wider w-max px-2 py-0.5 rounded ${
                          job.invoice.isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {job.invoice.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold italic">No charges billed</span>
                    )}
                  </div>

                  {/* Rating / Review */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Service Rating</span>
                    {job.review ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          {Array.from({ length: job.review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="block text-[10px] text-slate-500 font-semibold leading-relaxed line-clamp-1 italic">
                          "{job.review.comment}"
                        </span>
                      </div>
                    ) : job.status === 'completed' ? (
                      <Link
                        to="/customer/reviews"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#F97316] hover:underline"
                      >
                        Rate Job <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-slate-400 font-semibold italic">N/A</span>
                    )}
                  </div>

                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
