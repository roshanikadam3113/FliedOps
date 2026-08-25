import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  MapPin, 
  Clock, 
  Receipt, 
  Star, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const activeJobs = jobs.filter(j => ['pending', 'assigned', 'in-progress'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const unpaidInvoices = jobs.filter(j => j.invoice && j.invoice.amount > 0 && !j.invoice.isPaid);
  const pendingReviews = completedJobs.filter(j => !j.review);

  return (
    <div className="space-y-8 font-sans antialiased text-[#0F172A]">
      
      {/* Header Profile Greeting */}
      <div className="bg-gradient-to-r from-[#0F172A] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[150%] rounded-full bg-[#F97316]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-40%] left-[-20%] w-[60%] h-[150%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-orange-400">{user?.name || 'Customer'}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
              Manage your residential maintenance service requests, track technicians in real-time, and view paid invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Active Jobs</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">{activeJobs.length}</div>
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
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Unpaid Invoices</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">{unpaidInvoices.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#64748B] tracking-wider">Pending Reviews</span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">{pendingReviews.length}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Actions & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Active Requests & Notices */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight text-[#0F172A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F97316]" /> Active Service Requests
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-[#F97316] rounded-full">
                {activeJobs.length} active
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading service requests...
                </div>
              ) : activeJobs.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#0F172A]">No active service requests</p>
                    <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                      All your service jobs have been resolved. Need something fixed? Book a technician below.
                    </p>
                  </div>
                  <Link 
                    to="/customer/create-request"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Book a Technician
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeJobs.map(job => (
                    <div key={job._id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5 max-w-lg">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            job.urgency === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            job.urgency === 'high' ? 'bg-orange-50 text-[#F97316] border border-orange-100' :
                            job.urgency === 'medium' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                            'bg-slate-50 text-slate-600 border border-slate-100'
                          }`}>
                            {job.urgency} priority
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            job.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border border-blue-150 animate-pulse' :
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

                      {/* Action trigger */}
                      <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                        {job.status === 'in-progress' || job.status === 'assigned' ? (
                          <Link
                            to="/customer/track"
                            state={{ jobId: job._id }}
                            className="w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-600 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Track Tech
                          </Link>
                        ) : (
                          <span className="w-full sm:w-auto px-4 py-2 text-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl">
                            Awaiting Dispatcher
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Navigation Cards & Pending Invoices */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase text-[#64748B] tracking-wider">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/customer/create-request"
                className="flex items-center justify-between p-3.5 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-xl text-left transition-all hover:translate-x-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-[#F97316]">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Book Technician</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Schedule a repair or install</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </Link>

              <Link
                to="/customer/requests"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl text-left transition-all hover:translate-x-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200/60 flex items-center justify-center text-[#475569]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">My Service Tickets</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Manage active ticket logs</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                to="/customer/invoices"
                className="flex items-center justify-between p-3.5 bg-rose-50/20 hover:bg-rose-50/50 border border-rose-100/60 rounded-xl text-left transition-all hover:translate-x-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Billings & Payments</div>
                    <div className="text-[10px] text-slate-500 font-semibold">View and pay active invoices</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </Link>
            </div>
          </div>

          {/* Review Alerts */}
          {pendingReviews.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <Star className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider">
                    Submit Job Feedback
                  </h4>
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    You have {pendingReviews.length} resolved request(s) awaiting your feedback. Your review helps us monitor service quality!
                  </p>
                </div>
              </div>
              <Link
                to="/customer/reviews"
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                Rate Completed Service <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
