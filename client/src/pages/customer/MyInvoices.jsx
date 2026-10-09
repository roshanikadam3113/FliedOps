import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyInvoices } from '../../services/jobService';
import { apiRequest } from '../../utils/api';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Wrench,
  Sparkles,
  Eye,
  Printer,
  X,
  FileText
} from 'lucide-react';

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const fetchedInvoices = await getMyInvoices();
      setInvoices(fetchedInvoices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async (invoice, jobId) => {
    setPayingInvoiceId(invoice._id);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Check your internet connection.');
      }

      // Step 1: Create Order on Backend
      const orderData = await apiRequest(`/payments/invoices/${invoice._id}/pay`, { method: 'POST' });
      
      if (!orderData || !orderData.success) {
        throw new Error(orderData?.message || 'Failed to initialize payment');
      }

      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount, 
        currency: orderData.currency,
        name: "FieldOps Service",
        description: `Payment for Invoice ${invoice.invoiceNumber}`,
        order_id: orderData.orderId, 
        handler: async function (response) {
            // Step 3: Verify Payment on Backend
            try {
              const verifyData = await apiRequest(`/payments/verify`, {
                method: 'POST',
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  invoiceId: invoice._id
                })
              });
              
              if (verifyData.success) {
                // Optimistically update status immediately in the UI
                setInvoices(prev => prev.map(inv => 
                  inv._id === invoice._id ? { ...inv, status: 'paid' } : inv
                ));
                setPaymentSuccess(true);
                setTimeout(() => {
                  setPaymentSuccess(false);
                  setPayingInvoiceId(null);
                  fetchInvoices();
                }, 3000);
              } else {
                 alert("Payment verification failed");
                 setPayingInvoiceId(null);
              }
            } catch (err) {
               console.error("Verification error", err);
               alert("Payment verification failed");
               setPayingInvoiceId(null);
            }
        },
        prefill: {
            name: orderData.customer.name,
            email: orderData.customer.email,
            contact: orderData.customer.phone
        },
        theme: {
            color: "#0284c7" // brand primary color
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(response.error.description);
        setPayingInvoiceId(null);
      });
      rzp1.open();
      
    } catch (err) {
      console.error(err);
      alert(err.message);
      setPayingInvoiceId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const unpaidInvoices = invoices.filter(inv => inv.status === 'pending');
  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Navigation Top - Full Width */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
          Billing & Invoices
        </span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

      {/* Payment Success Overlay Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-3xl p-8 max-w-xs w-full text-center space-y-4 shadow-2xl border border-border-subtle animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-text-primary">Payment Successful!</h3>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Thank you. Your invoice has been marked as Paid.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Overview Card */}
      <div className="bg-surface-primary border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE BILLING GATEWAY
          </div>
          <h1 className="text-xl font-black tracking-tight text-text-primary">
            Billings & Invoices
          </h1>
          <p className="text-xs text-text-secondary font-semibold">
            Review itemized charges, download paid receipts, or checkout pending invoices.
          </p>
        </div>

        <div className="bg-surface-secondary border border-border-subtle p-4 rounded-xl shrink-0 w-full sm:w-auto text-center sm:text-right">
          <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">Total Outstanding</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mt-0.5">₹{totalOutstanding}</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-12 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-surface-secondary flex items-center justify-center mx-auto text-text-secondary/50">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">No Invoices Available</p>
              <p className="text-xs text-text-secondary font-semibold max-w-xs mx-auto">
                Billing invoices will appear here once your field requests are resolved by technicians.
              </p>
            </div>
          </div>
        ) : (
          invoices.map(invoice => {
            const isPaying = payingInvoiceId === invoice._id;
            const job = invoice.job || {};
            const serviceReq = job.serviceRequest || {};
            const tech = job.technician || {};
            
            return (
              <div key={invoice._id} className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Left: Job, Date, Invoice info */}
                <div className="space-y-3.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-surface-secondary text-text-secondary">
                      {invoice.invoiceNumber}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-text-primary leading-snug">
                      {serviceReq.title || 'Service Request'}
                    </h3>
                    <p className="text-xs text-text-secondary font-semibold line-clamp-1">
                      Category: {serviceReq.category || 'General'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-semibold text-text-secondary/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date: {new Date(invoice.issuedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Tech: {tech.name || 'Assigned Tech'}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Pay/View Trigger */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 border-border-subtle pt-4 md:pt-0 w-full md:w-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider block">Billing Total</span>
                    <span className="text-lg font-black text-text-primary block">₹{invoice.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Itemized Invoice Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setViewInvoice(invoice)}
                      className="px-3 py-2 bg-surface-secondary hover:bg-surface-secondary/80 text-text-secondary text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-border-subtle"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Invoice
                    </button>

                    {invoice.status === 'paid' ? (
                      <button
                        type="button"
                        onClick={() => setViewInvoice(invoice)}
                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> PAID RECEIPT
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePay(invoice, serviceReq._id)}
                        disabled={isPaying}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" /> Pay Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* View / Print Itemized Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-primary rounded-3xl max-w-xl w-full shadow-2xl border border-border-subtle overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase text-brand-accent tracking-wider">
                  OFFICIAL TAX INVOICE • {viewInvoice.invoiceNumber}
                </div>
                <h2 className="text-base font-extrabold text-white">FieldOps Service Invoice</h2>
              </div>
              <button
                onClick={() => setViewInvoice(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Area */}
            <div className="p-6 space-y-6 font-sans text-text-primary" id="printable-invoice">
              
              {/* Meta details */}
              <div className="flex justify-between items-start border-b border-border-subtle pb-4 text-xs">
                <div>
                  <span className="text-[10px] font-black text-text-secondary/50 uppercase tracking-wider block">Customer Details</span>
                  <span className="font-extrabold block">Your Account</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-text-secondary/50 uppercase tracking-wider block">Payment Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    viewInvoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-700 dark:text-rose-400'
                  }`}>
                    {viewInvoice.status}
                  </span>
                  <span className="text-text-secondary/50 text-[10px] block mt-1">Issued: {new Date(viewInvoice.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Service info */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-text-secondary/50 uppercase tracking-wider block">Service Rendered</span>
                <div className="text-sm font-extrabold text-text-primary">{viewInvoice.job?.serviceRequest?.title || 'General Service'}</div>
                <div className="text-xs text-text-secondary font-semibold">{viewInvoice.job?.serviceRequest?.category || 'Repair'}</div>
              </div>

              {/* Itemized charges table */}
              <div className="border border-border-subtle rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-12 bg-surface-secondary px-4 py-2 font-bold text-text-secondary uppercase text-[9px] tracking-wider">
                  <div className="col-span-6">Description / Item</div>
                  <div className="col-span-3 text-right">Unit Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                <div className="divide-y divide-border-subtle bg-surface-primary">
                  <div className="grid grid-cols-12 px-4 py-2.5 font-semibold">
                    <div className="col-span-6 text-text-primary">Base Technician Visit & Inspection Fee</div>
                    <div className="col-span-3 text-right text-text-secondary">₹{viewInvoice.serviceCharge || 500}</div>
                    <div className="col-span-3 text-right text-text-primary">₹{viewInvoice.serviceCharge || 500}</div>
                  </div>

                  {(viewInvoice.parts || []).map((part, idx) => (
                    <div key={idx} className="grid grid-cols-12 px-4 py-2.5 font-semibold">
                      <div className="col-span-6 text-text-primary">{part.name} (x{part.quantity || 1})</div>
                      <div className="col-span-3 text-right text-text-secondary">₹{part.price}</div>
                      <div className="col-span-3 text-right text-text-primary">₹{part.price * (part.quantity || 1)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-secondary p-4 border-t border-border-subtle space-y-1 text-xs text-right">
                  <div className="text-text-secondary">Service Charge: ₹{viewInvoice.serviceCharge || 0}</div>
                  <div className="text-text-secondary">Parts Total: ₹{viewInvoice.partsTotal || 0}</div>
                  <div className="text-text-secondary">Taxes (GST 0%): ₹{viewInvoice.tax || 0}</div>
                  <div className="text-base font-black text-text-primary pt-1 border-t border-border-subtle">
                    Grand Total: ₹{viewInvoice.totalAmount || 0}
                  </div>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-surface-secondary border-t border-border-subtle flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-surface-primary border border-border-subtle hover:bg-surface-secondary text-text-secondary hover:text-text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Download PDF
              </button>

              <button
                type="button"
                onClick={() => setViewInvoice(null)}
                className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
