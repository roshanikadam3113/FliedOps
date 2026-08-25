import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, payInvoice } from '../../services/jobService';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Wrench,
  Sparkles
} from 'lucide-react';

export default function MyInvoices() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingJobId, setPayingJobId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await getJobs();
      // Keep completed or active jobs that have an invoice amount
      setJobs(fetchedJobs.filter(j => j.invoice && j.invoice.amount > 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePay = async (jobId) => {
    setPayingJobId(jobId);
    try {
      // Simulate 1.5s bank gateway processing latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      const updatedJob = await payInvoice(jobId);
      if (updatedJob) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          setPayingJobId(null);
          fetchJobs(); // Reload jobs from service to sync
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setPayingJobId(null);
    }
  };

  const paidInvoices = jobs.filter(j => j.invoice.isPaid);
  const unpaidInvoices = jobs.filter(j => !j.invoice.isPaid);
  const totalOutstanding = unpaidInvoices.reduce((sum, j) => sum + j.invoice.amount, 0);

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A] max-w-4xl mx-auto">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider">
          Billing & Invoices
        </span>
      </div>

      {/* Payment Success Overlay Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-[#0F172A]">Payment Successful!</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Thank you. Your receipt has been generated and dispatched.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Overview Card */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[9px] font-black uppercase text-[#F97316]">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE CHECKOUT
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#0F172A]">
            Billing & Invoices
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Pay unpaid maintenance work orders and download completed receipts.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl shrink-0 w-full sm:w-auto text-center sm:text-right">
          <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">Total Outstanding</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">₹{totalOutstanding}</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading invoices...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-slate-150 rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0F172A]">No Invoices Available</p>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                Billing invoices will appear here once your field requests are resolved.
              </p>
            </div>
          </div>
        ) : (
          jobs.map(job => {
            const isPaying = payingJobId === job._id;
            
            return (
              <div key={job._id} className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Left: Job, Date, Invoice info */}
                <div className="space-y-3.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      INV-{job._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      job.invoice.isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {job.invoice.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#0F172A] leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-1">
                      Service performed: {job.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Scheduled: {job.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Tech: {job.technician?.name || 'Rahul Sharma'}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Pay Trigger */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 w-full md:w-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Total</span>
                    <span className="text-lg font-black text-[#0F172A] block">₹{job.invoice.amount}</span>
                  </div>

                  {job.invoice.isPaid ? (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> PAID RECEIPT
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePay(job._id)}
                      disabled={isPaying}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-450 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" /> Pay Invoice
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
