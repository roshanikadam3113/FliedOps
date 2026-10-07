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
    <div className="space-y-8 pb-12 font-sans antialiased text-text-primary bg-page-bg min-h-screen">

      {/* Top Banner - Standard Box Design */}
      <div className="bg-surface-primary text-text-primary rounded-xl p-6 sm:p-8 shadow-sm border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Welcome back, {user?.name || 'Customer'}
          </h1>
          <p className="text-sm text-text-secondary font-medium">
            Manage your service requests, track technicians, and view invoices
          </p>
        </div>
        
        {/* Action Button */}
        <Link
          to="/customer/create-request"
          className="inline-flex items-center gap-2 px-5 py-3 bg-brand-accent hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4.5 h-4.5" /> Book New Service
        </Link>
      </div>

      {/* Metrics Row - Industrial Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', value: activeJobs.length, icon: Wrench, color: 'text-brand-accent' },
          { label: 'Completed', value: completedJobs.length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Unpaid Invoices', value: unpaidInvoices.length, icon: Receipt, color: 'text-rose-500' },
          { label: 'Pending Reviews', value: pendingReviews.length, icon: Star, color: 'text-amber-500' },
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

      {/* Main Grid: Quick Actions & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Active Requests */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-primary border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-secondary/50">
              <h2 className="text-lg font-black tracking-tight text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-text-secondary" />
                Active Service Requests
              </h2>
              {activeJobs.length > 0 && (
                <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-accent/10 text-brand-accent rounded border border-brand-accent/20 uppercase tracking-wider">
                  {activeJobs.length} Ongoing
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8 flex-1">
              {loading ? (
                <div className="h-full flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
                </div>
              ) : activeJobs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center mx-auto text-text-secondary/50 shadow-inner">
                    <Wrench className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-text-primary">No active service requests</p>
                    <p className="text-sm text-text-secondary font-medium max-w-sm mx-auto leading-relaxed">
                      All your service jobs have been resolved or you haven't booked one yet. Need something fixed?
                    </p>
                  </div>
                  <Link
                    to="/customer/create-request"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-brand-accent to-orange-400 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-extrabold tracking-wide uppercase rounded-xl shadow-lg shadow-brand-accent/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" /> Book a Technician
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map(job => (
                    <div
                      key={job._id}
                      className={`group relative bg-surface-primary border border-border-subtle rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 overflow-hidden ${job.urgency === 'critical' ? 'border-l-4 border-l-rose-500' :
                          job.urgency === 'high' ? 'border-l-4 border-l-brand-accent' :
                            job.urgency === 'medium' ? 'border-l-4 border-l-sky-500' :
                              'border-l-4 border-l-text-secondary/50'
                        }`}
                    >
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-surface-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      <div className="relative z-10 space-y-2.5 max-w-lg w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${job.status === 'in-progress' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sm animate-pulse' :
                              job.status === 'assigned' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm' :
                                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-sm'
                            }`}>
                            {job.status.replace('-', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-wide">
                            {job.urgency} priority
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-text-primary leading-tight group-hover:text-brand-accent transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-text-secondary font-medium line-clamp-1 mt-1">
                            {job.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-5 text-xs font-semibold text-text-secondary/70 pt-1">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-text-secondary/50" /> {job.scheduledDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-text-secondary/50" /> {job.location}
                          </span>
                        </div>
                      </div>

                      {/* Action trigger */}
                      <div className="relative z-10 shrink-0 w-full sm:w-auto">
                        {job.status === 'in-progress' || job.status === 'assigned' ? (
                          <Link
                            to="/customer/track"
                            state={{ jobId: job._id }}
                            className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-bold text-white bg-brand-accent hover:bg-orange-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl"
                          >
                            <MapPin className="w-4 h-4" /> Track Tech
                          </Link>
                        ) : (
                          <div className="w-full sm:w-auto px-4 py-2.5 text-center text-xs font-bold text-text-secondary bg-surface-secondary border border-border-subtle rounded-xl flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" /> Awaiting Dispatch
                          </div>
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
        <div className="lg:col-span-4 space-y-6 flex flex-col">

          {/* Quick Actions Panel */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm space-y-5 flex-1">
            <h3 className="text-sm font-black uppercase text-text-secondary tracking-widest pl-1">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <Link
                to="/customer/requests"
                className="group flex items-center justify-between p-4 bg-surface-primary border border-border-subtle hover:border-text-primary/20 rounded-xl text-left transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border-subtle group-hover:bg-text-primary flex items-center justify-center text-text-secondary group-hover:text-page-bg transition-colors duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">My Service Requests</div>
                    <div className="text-xs text-text-secondary font-medium">View and manage your requests</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-secondary group-hover:bg-text-primary/10 flex items-center justify-center transition-colors border border-transparent group-hover:border-text-primary/20">
                  <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-text-primary transition-colors" />
                </div>
              </Link>

              <Link
                to="/customer/invoices"
                className="group flex items-center justify-between p-4 bg-surface-primary border border-border-subtle hover:border-rose-500/50 rounded-xl text-left transition-all hover:shadow-lg hover:shadow-rose-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 group-hover:bg-rose-500 flex items-center justify-center text-rose-500 group-hover:text-white transition-colors duration-300">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">Billings & Payments</div>
                    <div className="text-xs text-text-secondary font-medium">View and pay invoices</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-secondary group-hover:bg-rose-500/10 flex items-center justify-center transition-colors border border-transparent group-hover:border-rose-500/20">
                  <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-rose-500 transition-colors" />
                </div>
              </Link>
            </div>
          </div>

          {/* Review Alerts */}
          {pendingReviews.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div className="space-y-1 mt-1">
                  <h4 className="text-sm font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                    Feedback Requested
                  </h4>
                  <p className="text-sm text-amber-700/80 dark:text-amber-500/80 font-semibold leading-relaxed">
                    You have <span className="font-bold">{pendingReviews.length}</span> resolved request(s) awaiting your feedback. Help us improve!
                  </p>
                </div>
              </div>
              <Link
                to="/customer/reviews"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-500/20 hover:shadow-lg"
              >
                Rate Completed Service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
