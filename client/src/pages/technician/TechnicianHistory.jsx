import React, { useState, useEffect } from 'react';
import { getTechJobs } from '../../services/jobService';
import { 
  Clock, 
  MapPin, 
  Receipt, 
  Star, 
  CheckCircle2, 
  FileText,
  Package
} from 'lucide-react';

export default function TechnicianHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const techJobs = await getTechJobs();
        // Keep only completed jobs
        const completed = techJobs.filter(j => j.status === 'completed');
        setJobs(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
          Job History Logs
        </h1>
        <p className="text-xs text-[#64748B] font-semibold mt-0.5">
          Review your historically resolved service calls, billing receipts, and client feedbacks.
        </p>
      </div>

      {/* Completed jobs list */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading resolved tasks...
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0F172A]">
                No completed jobs found
              </p>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                Once you resolve your active work assignments, your historical logs and client ratings will accumulate here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <div 
                key={job._id}
                className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-4"
              >
                {/* Job Metadata Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3.5 border-b border-slate-200/60">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#0F172A] leading-tight pt-1">
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs font-bold text-slate-400">Resolved Date</div>
                    <div className="text-xs font-extrabold text-[#0F172A]">{job.scheduledDate}</div>
                  </div>
                </div>

                {/* Job Resolution Notes & Logged Parts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs font-semibold">
                  
                  {/* Service Notes */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Service Resolution Report
                    </span>
                    <p className="p-3 bg-white border border-slate-200/60 rounded-xl text-slate-600 text-xs leading-relaxed">
                      {job.serviceNotes || 'AC servicing completed successfully. Fuses tested, drain channel cleared, unit running at optimal efficiency.'}
                    </p>
                  </div>

                  {/* Consumed Spare Parts list */}
                  <div className="md:col-span-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-slate-400" /> Logged Inventory Materials
                    </span>
                    
                    <div className="bg-white border border-slate-200/60 rounded-xl p-3 space-y-2.5">
                      {job.invoice?.parts && job.invoice.parts.length > 0 ? (
                        <div className="space-y-1.5">
                          {job.invoice.parts.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-600 font-medium">
                                {p.name} <span className="text-slate-400 font-bold">x{p.quantity}</span>
                              </span>
                              <span className="text-[#0F172A] font-bold">₹{p.price * p.quantity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-bold uppercase italic tracking-wider py-1.5 text-center">
                          No extra parts logged (Standard Service only)
                        </div>
                      )}
                      
                      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-black">
                        <span className="text-[#0F172A] uppercase">Total Invoice Billed</span>
                        <span className="text-emerald-600">₹{job.invoice?.amount || 500}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Billing invoice receipt & Client Feedback review */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3.5 border-t border-slate-200/40 text-xs font-semibold">
                  
                  {/* Billing status */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Billing Invoice</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        job.invoice?.isPaid 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {job.invoice?.isPaid ? 'Paid & Settled' : 'Awaiting Client Payment'}
                      </span>
                    </div>
                  </div>

                  {/* Customer feedback stars & comments */}
                  <div className="md:col-span-8 flex items-start gap-2">
                    <Star className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Client Rating & Review</span>
                      {job.review ? (
                        <div className="space-y-1 mt-0.5">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            {'★'.repeat(job.review.rating)}
                            <span className="text-slate-400 font-semibold ml-1">({job.review.rating}/5 stars)</span>
                          </div>
                          {job.review.comment && (
                            <p className="text-[11px] text-slate-600 leading-normal italic font-medium">
                              "{job.review.comment}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-wider">
                          No feedback submitted yet
                        </span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
