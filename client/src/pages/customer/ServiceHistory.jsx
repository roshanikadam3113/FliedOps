import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import RequestDetailsModal from '../../components/customer/RequestDetailsModal';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Receipt,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Eye,
  XCircle
} from 'lucide-react';

export default function ServiceHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await getJobs();
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
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Navigation and Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link 
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Service History
          </h1>
          <p className="text-xs text-text-secondary font-semibold">
            Review past resolved tickets, invoices, and technician ratings
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-12 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
            Loading service history...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-surface-secondary flex items-center justify-center mx-auto text-text-secondary/50">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">No past service history</p>
              <p className="text-xs text-text-secondary font-semibold max-w-xs mx-auto">
                Completed and resolved service requests will be archived here.
              </p>
            </div>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
              
              {/* Header: ID, Title & Status */}
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
                      job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-text-primary">
                    {job.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="text-[10px] font-black text-text-secondary/50 uppercase block">Service Date</span>
                    <span className="font-bold text-text-secondary">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary bg-surface-secondary hover:bg-surface-secondary/80 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-border-subtle"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary font-medium leading-relaxed bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle">
                {job.description}
              </p>

              {/* Details & Billing info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-subtle text-xs">
                
                {/* Left side: Technician details */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
                    Service Professional
                  </h3>
                  {job.technician ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-black text-brand-accent">
                        {job.technician.name ? job.technician.name.charAt(0) : 'T'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-text-primary">{job.technician.name}</div>
                        <div className="text-[10px] text-text-secondary/70 font-semibold">{job.technician.specialty || 'General'} Specialist</div>
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-text-secondary/50 font-semibold">No technician assigned</span>
                  )}
                </div>

                {/* Right side: Invoice and Rating Info */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Invoice */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Service Billing</span>
                    {job.invoice && job.invoice.amount > 0 ? (
                      <div className="space-y-1">
                        <span className="font-extrabold text-text-primary text-sm">₹{job.invoice.amount}</span>
                        <span className={`block text-[9px] font-black uppercase tracking-wider w-max px-2 py-0.5 rounded ${
                          job.invoice.isPaid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {job.invoice.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-secondary/50 font-semibold italic">No charges billed</span>
                    )}
                  </div>

                  {/* Rating / Review */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Service Rating</span>
                    {job.review ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          {Array.from({ length: job.review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="block text-[10px] text-text-secondary font-semibold leading-relaxed line-clamp-1 italic">
                          "{job.review.comment}"
                        </span>
                      </div>
                    ) : job.status === 'completed' ? (
                      <Link
                        to="/customer/reviews"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-brand-accent hover:underline"
                      >
                        Rate Job <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-text-secondary/50 font-semibold italic">N/A</span>
                    )}
                  </div>

                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedJobForDetails && (
        <RequestDetailsModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
        />
      )}

    </div>
  );
}
