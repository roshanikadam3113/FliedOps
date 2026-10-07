import React, { useState, useEffect } from 'react';
import { getAdminInvoices } from '../../services/jobService';
import { 
  Receipt,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  Wrench,
  X,
  FileText
} from 'lucide-react';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAdminInvoices();
        setInvoices(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    if (filter !== 'all' && inv.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchInv = inv.invoiceNumber?.toLowerCase().includes(q);
      const matchCust = inv.customer?.name?.toLowerCase().includes(q);
      if (!matchInv && !matchCust) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Invoices & Billing</h1>
          <p className="text-sm text-text-secondary font-medium mt-1">Manage system-generated customer invoices.</p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by Invoice No. or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-surface-secondary rounded-lg p-1 border border-border-subtle shrink-0">
          {['all', 'pending', 'paid', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f ? 'bg-text-primary text-page-bg shadow-sm' : 'text-text-secondary hover:bg-surface-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-subtle">
            <thead className="bg-surface-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Invoice No.</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Technician</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Amount</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Status / Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-secondary font-bold">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => {
                  const customer = inv.customer || {};
                  const job = inv.job || {};
                  const tech = job.technician || {};
                  
                  return (
                    <tr 
                      key={inv._id} 
                      className="hover:bg-surface-secondary/30 transition-colors cursor-pointer group"
                      onClick={() => setViewInvoice(inv)}
                    >
                      <td className="px-6 py-4 font-black text-text-primary">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-text-primary">{customer.name || 'Unknown'}</div>
                        <div className="text-xs text-text-secondary">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-text-primary">{tech.name || 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-text-primary">
                        ₹{inv.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                            inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            inv.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>
                            {inv.status}
                          </span>
                          <span className="text-[10px] font-bold text-text-secondary">{new Date(inv.issuedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-primary rounded-xl shadow-2xl w-full max-w-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h2 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-brand-accent" /> Invoice Details
              </h2>
              <button 
                onClick={() => setViewInvoice(null)}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Invoice Number</div>
                  <div className="text-lg font-extrabold font-mono text-text-primary">{viewInvoice.invoiceNumber}</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1">Status</div>
                   <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${
                     viewInvoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                     viewInvoice.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                     'bg-amber-500/10 text-amber-600 border-amber-500/20'
                   }`}>
                     {viewInvoice.status}
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Billed To</h3>
                    <div className="space-y-1 bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                      <p className="text-sm font-bold text-text-primary">{viewInvoice.customer?.name}</p>
                      <p className="text-xs text-text-secondary">{viewInvoice.customer?.email}</p>
                      <p className="text-xs text-text-secondary">{viewInvoice.customer?.phone}</p>
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Service Details</h3>
                    <div className="space-y-1 bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                      <p className="text-sm font-bold text-text-primary">{viewInvoice.job?.serviceRequest?.title || 'Service Work'}</p>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                        <Wrench className="w-3.5 h-3.5" /> Tech: {viewInvoice.job?.technician?.name || 'Unassigned'}
                      </p>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> Issued: {new Date(viewInvoice.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                 </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2 mb-3">Charges Breakdown</h3>
                <div className="border border-border-subtle rounded-xl overflow-hidden text-sm">
                  <div className="grid grid-cols-12 bg-surface-secondary/50 px-4 py-2 font-black text-text-secondary uppercase text-[10px] tracking-widest border-b border-border-subtle">
                    <div className="col-span-8">Description</div>
                    <div className="col-span-4 text-right">Amount</div>
                  </div>
                  <div className="divide-y divide-border-subtle bg-surface-primary">
                    <div className="grid grid-cols-12 px-4 py-3 font-bold text-text-primary">
                      <div className="col-span-8">Service Charge</div>
                      <div className="col-span-4 text-right">₹{viewInvoice.serviceCharge?.toFixed(2) || '0.00'}</div>
                    </div>
                    {(viewInvoice.parts || []).map((part, idx) => (
                      <div key={idx} className="grid grid-cols-12 px-4 py-3 font-medium text-text-secondary">
                        <div className="col-span-8">{part.name} <span className="text-xs ml-1">(x{part.quantity || 1})</span></div>
                        <div className="col-span-4 text-right">₹{(part.price * (part.quantity || 1)).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface-secondary/30 p-4 space-y-2 border-t border-border-subtle text-right text-sm">
                    <div className="text-text-secondary font-medium">Service Charge: ₹{viewInvoice.serviceCharge?.toFixed(2) || '0.00'}</div>
                    <div className="text-text-secondary font-medium">Parts Total: ₹{viewInvoice.partsTotal?.toFixed(2) || '0.00'}</div>
                    <div className="text-text-secondary font-medium">Tax: ₹{viewInvoice.tax?.toFixed(2) || '0.00'}</div>
                    <div className="text-lg font-black text-text-primary pt-2 border-t border-border-subtle mt-2">
                      Total: ₹{viewInvoice.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-5 py-2 bg-text-primary hover:bg-text-secondary text-page-bg text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
