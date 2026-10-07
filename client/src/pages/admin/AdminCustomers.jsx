import React, { useState, useEffect } from 'react';
import { getAdminCustomers, getAdminRequests, getAdminJobs, getAdminInvoices } from '../../services/adminService';
import { Search, X, User, Phone, Mail, MapPin, Calendar, FileText, Wrench, Receipt } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({ requests: [], jobs: [], invoices: [], loading: false });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAdminCustomers();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerHistory = async (customerId) => {
    try {
      setCustomerDetails({ requests: [], jobs: [], invoices: [], loading: true });
      const [reqRes, jobRes, invRes] = await Promise.all([
        getAdminRequests(), // We will filter client side or backend doesn't support customer filter for requests easily?
        getAdminJobs({ customer: customerId }),
        getAdminInvoices({ customer: customerId })
      ]);
      
      const customerRequests = reqRes.success ? reqRes.requests.filter(r => r.customer?._id === customerId) : [];
      
      setCustomerDetails({
        requests: customerRequests,
        jobs: jobRes.success ? jobRes.jobs : [],
        invoices: invRes.success ? invRes.invoices : [],
        loading: false
      });
    } catch (err) {
      console.error(err);
      setCustomerDetails(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerHistory(customer._id);
  };

  const filteredCustomers = customers.filter(c => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Customers Directory</h1>
          <p className="text-sm font-medium text-text-secondary mt-1">View and manage registered customers.</p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-subtle p-4 rounded-xl shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by Name, Email, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-600 p-4 rounded-xl font-bold border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-subtle">
            <thead className="bg-surface-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Contact</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Location</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-secondary font-bold">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr 
                    key={customer._id} 
                    className="hover:bg-surface-secondary/30 transition-colors cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">{customer.email}</div>
                      <div className="text-xs text-text-secondary">{customer.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary truncate max-w-[200px]">{customer.location || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-secondary">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-primary rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border-subtle overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface-secondary/30">
              <h2 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <User className="w-5 h-5 text-brand-accent" /> Customer Details
              </h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="col-span-1 md:col-span-2">
                   <h1 className="text-2xl font-black text-text-primary mb-1">{selectedCustomer.name}</h1>
                   <div className="flex items-center gap-4 text-sm font-medium text-text-secondary">
                     <span className="flex items-center gap-1"><Mail className="w-4 h-4"/> {selectedCustomer.email}</span>
                     <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> {selectedCustomer.phone || 'N/A'}</span>
                   </div>
                   <div className="flex items-center gap-1 text-sm font-medium text-text-secondary mt-2">
                     <MapPin className="w-4 h-4"/> {selectedCustomer.location || 'No location provided'}
                   </div>
                 </div>
                 <div className="bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle flex flex-col justify-center">
                    <div className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1">Account Joined</div>
                    <div className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                      {new Date(selectedCustomer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                 </div>
              </div>

              {customerDetails.loading ? (
                 <div className="flex justify-center p-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   
                   {/* Requests Column */}
                   <div className="space-y-3">
                     <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5 border-b border-border-subtle pb-2">
                       <FileText className="w-4 h-4" /> Service Requests
                     </h3>
                     {customerDetails.requests.length === 0 ? (
                        <p className="text-xs text-text-secondary">No requests found.</p>
                     ) : (
                        customerDetails.requests.map(req => (
                          <div key={req._id} className="bg-surface-secondary/30 border border-border-subtle p-3 rounded-lg">
                            <div className="text-xs font-bold text-text-primary">{req.title}</div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[9px] font-black uppercase tracking-wider text-text-secondary bg-surface-primary px-1.5 py-0.5 rounded border border-border-subtle">{req.status}</span>
                              <span className="text-[10px] font-medium text-text-secondary">{new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                     )}
                   </div>

                   {/* Jobs Column */}
                   <div className="space-y-3">
                     <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5 border-b border-border-subtle pb-2">
                       <Wrench className="w-4 h-4" /> Jobs
                     </h3>
                     {customerDetails.jobs.length === 0 ? (
                        <p className="text-xs text-text-secondary">No jobs found.</p>
                     ) : (
                        customerDetails.jobs.map(job => (
                          <div key={job._id} className="bg-surface-secondary/30 border border-border-subtle p-3 rounded-lg">
                            <div className="text-xs font-bold text-text-primary">{job.serviceRequest?.title || 'Unknown Job'}</div>
                            <div className="text-[10px] font-medium text-text-secondary mt-0.5">Tech: {job.technician?.name || 'Unassigned'}</div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[9px] font-black uppercase tracking-wider text-text-secondary bg-surface-primary px-1.5 py-0.5 rounded border border-border-subtle">{job.status}</span>
                              <span className="text-[10px] font-medium text-text-secondary">{job.scheduledDate || ''}</span>
                            </div>
                          </div>
                        ))
                     )}
                   </div>

                   {/* Invoices Column */}
                   <div className="space-y-3">
                     <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5 border-b border-border-subtle pb-2">
                       <Receipt className="w-4 h-4" /> Invoices
                     </h3>
                     {customerDetails.invoices.length === 0 ? (
                        <p className="text-xs text-text-secondary">No invoices found.</p>
                     ) : (
                        customerDetails.invoices.map(inv => (
                          <div key={inv._id} className="bg-surface-secondary/30 border border-border-subtle p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="text-sm font-black text-text-primary">${inv.totalAmount?.toFixed(2)}</div>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-medium text-text-secondary text-right">
                              <div>#{inv.invoiceNumber}</div>
                              <div>{new Date(inv.issuedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))
                     )}
                   </div>

                 </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
