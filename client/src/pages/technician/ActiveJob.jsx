import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getTechJobs, updateJobStatus, completeJob } from '../../services/jobService';
import { getAvailableParts, addPartToJob } from '../../services/inventoryService';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Wrench, 
  Package, 
  Plus, 
  Trash2, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ActiveJob() {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [availableParts, setAvailableParts] = useState([]);
  const [traveling, setTraveling] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [addQty, setAddQty] = useState(1);
  const [serviceNotes, setServiceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchJobAndParts = async () => {
    try {
      const [jobs, partsList] = await Promise.all([
        getTechJobs(),
        getAvailableParts()
      ]);
      setAvailableParts(partsList);
      setSelectedPartId('');

      const selectedJobId = locationState.state?.jobId;
      
      let targetJob = null;
      if (selectedJobId) {
        targetJob = jobs.find(j => j._id === selectedJobId);
      }
      
      // Fallback: get first non-completed job
      if (!targetJob) {
        targetJob = jobs.find(j => ['assigned', 'in-progress'].includes(j.status));
      }

      setJob(targetJob);
      if (targetJob) {
        const isTraveling = ['on-the-way', 'arrived', 'in-progress'].includes(targetJob.status);
        const isCheckedIn = ['arrived', 'in-progress'].includes(targetJob.status);
        
        setTraveling(isTraveling);
        setCheckedIn(isCheckedIn);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndParts();
  }, [locationState.state]);

  const handleStartTravel = async () => {
    if (!job) return;
    try {
      await updateJobStatus(job._id, 'on-the-way');
      setTraveling(true);
      // Refresh details
      const updatedJobs = await getTechJobs();
      const updated = updatedJobs.find(j => j._id === job._id);
      if (updated) setJob(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    if (!job) return;
    try {
      await updateJobStatus(job._id, 'in-progress');
      setCheckedIn(true);
      // Refresh details
      const updatedJobs = await getTechJobs();
      const updated = updatedJobs.find(j => j._id === job._id);
      if (updated) setJob(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPart = async () => {
    if (!selectedPartId || addQty < 1) return;
    setIsAddingPart(true);
    try {
      const updatedJob = await addPartToJob(job._id, selectedPartId, addQty);
      setJob(updatedJob);
      // reset state
      setAddQty(1);
      setSelectedPartId('');
    } catch (err) {
      alert(err.message || 'Failed to add part');
    } finally {
      setIsAddingPart(false);
    }
  };

  const handleCompleteJob = async (e) => {
    e.preventDefault();
    if (!job) return;

    if (selectedPartId) {
      alert('You have selected a part but forgot to click "Add". Please click "Add" to include it in the invoice, or clear the dropdown before resolving.');
      return;
    }

    setIsSubmitting(true);

    try {
      await completeJob(job._id, {
        serviceNotes
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
        Opening Work Order Console...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 font-sans text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
          <Wrench className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-black text-[#0F172A]">No Active Work Orders</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            There are currently no active tasks assigned or in travel status. Visit your dashboard to accept a new work request.
          </p>
        </div>
        <Link
          to="/technician/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate live pricing sheet
  const baseServiceFee = 500;
  const partsTotal = (job.partsUsed || []).reduce((sum, item) => sum + item.total, 0);
  const grandTotal = baseServiceFee + partsTotal;

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-text-primary bg-page-bg min-h-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/technician/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Work Console Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Pipeline Workflow & Parts Sheet */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Job Description Header */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded">
                {job.category}
              </span>
              <span className="text-xs font-bold text-text-secondary">
                Job ID: {job._id}
              </span>
            </div>
            <h2 className="text-xl font-black text-text-primary tracking-tight">{job.title}</h2>
            <p className="text-xs text-text-secondary font-semibold leading-relaxed">{job.description}</p>
          </div>

          {/* Workflow Interactive Panel */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Operational Status Pipeline
            </h3>

            {/* Visual Pipeline Bar */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary bg-surface-secondary/50 border border-border-subtle p-3 rounded-xl overflow-x-auto gap-3">
              <span className="text-emerald-600 dark:text-emerald-400">1. Assigned ✓</span>
              <span className={traveling ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary/50'}>
                2. Traveling {traveling ? '✓' : '○'}
              </span>
              <span className={checkedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary/50'}>
                3. On Site {checkedIn ? '✓' : '○'}
              </span>
              <span className="text-text-secondary/50">4. Resolved ○</span>
            </div>

            {/* Action Buttons based on stage */}
            <div className="pt-2">
              {!traveling ? (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold leading-relaxed">
                      Please start your transit to the client location. This notifies the customer and initiates their live GPS tracking screen.
                    </p>
                  </div>
                  <button
                    onClick={handleStartTravel}
                    className="w-full py-3 text-xs font-black uppercase tracking-[0.08em] bg-brand-accent hover:bg-orange-600 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4.5 h-4.5" /> Begin Travel to Site
                  </button>
                </div>
              ) : !checkedIn ? (
                <div className="space-y-4">
                  <div className="h-[220px] bg-surface-secondary border border-border-subtle rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35" />
                    <div className="relative z-10 text-center space-y-1.5 p-4 bg-surface-primary/90 backdrop-blur-xs border border-border-subtle rounded-xl max-w-xs shadow-md">
                      <Navigation className="w-5 h-5 text-sky-500 mx-auto animate-bounce" />
                      <div className="text-xs font-extrabold text-text-primary">Routing Active</div>
                      <div className="text-[10px] text-text-secondary font-semibold leading-relaxed">
                        En Route to customer at <strong>{job.location}</strong>. Live coordinates syncing.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckIn}
                    className="w-full py-3 text-xs font-black uppercase tracking-[0.08em] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" /> Check-In (Arrived at Site)
                  </button>
                </div>
              ) : (
                /* Checked In & Working: Form to Log Parts & Service notes */
                <form onSubmit={handleCompleteJob} className="space-y-5">
                  <div className="p-4.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">Checked-In Successfully</div>
                      <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-semibold">Log any spare parts consumed and enter service completion notes below.</div>
                    </div>
                  </div>

                  {/* Spare Parts Consumed Logger */}
                  <div className="space-y-3.5 pt-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-text-secondary block">
                      Add Spare Parts (Directly affects Live Inventory)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedPartId}
                        onChange={(e) => setSelectedPartId(e.target.value)}
                        className="flex-grow p-2.5 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary focus:outline-none focus:border-brand-accent text-text-primary"
                      >
                        <option value="">-- Select a part to add --</option>
                        {availableParts.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} (₹{p.unitPrice}) - In Stock: {p.stockQuantity}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="number"
                        min="1"
                        value={addQty}
                        onChange={e => setAddQty(Number(e.target.value))}
                        className="w-16 p-2.5 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary text-text-primary focus:outline-none focus:border-brand-accent"
                      />
                      <button
                        type="button"
                        disabled={isAddingPart || availableParts.length === 0}
                        onClick={handleAddPart}
                        className="px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                      >
                        {isAddingPart ? '...' : <><Plus className="w-4 h-4" /> Add</>}
                      </button>
                    </div>

                    {/* Logged parts list */}
                    {(job.partsUsed || []).length > 0 && (
                      <div className="border border-border-subtle rounded-xl overflow-hidden text-xs">
                        <div className="grid grid-cols-12 bg-surface-secondary px-3 py-2 border-b border-border-subtle font-bold text-text-secondary text-[9px] uppercase tracking-wider">
                          <div className="col-span-6">Part Name</div>
                          <div className="col-span-2 text-right">Price</div>
                          <div className="col-span-2 text-right">Qty</div>
                          <div className="col-span-2 text-right">Total</div>
                        </div>
                        <div className="divide-y divide-border-subtle bg-surface-primary">
                          {(job.partsUsed || []).map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 px-3 py-2 font-semibold items-center">
                              <div className="col-span-6 text-text-primary">
                                {item.name}
                              </div>
                              <div className="col-span-2 text-right text-text-secondary">₹{item.unitPrice}</div>
                              <div className="col-span-2 text-right text-text-primary">{item.quantity}</div>
                              <div className="col-span-2 text-right text-text-primary">₹{item.total}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Completion Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-text-secondary block">
                      Resolution & Service Notes
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      placeholder="Detail what repairs or adjustments were made on-site (e.g. Checked cooling compressor, refilled R32 refrigerant, changed outdoor line socket)..."
                      className="w-full p-3 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary text-text-primary focus:bg-surface-primary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-black uppercase tracking-[0.08em] bg-brand-accent hover:bg-orange-600 text-white rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Resolving work order...' : 'Resolve Job & Generate Invoice'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Client Information & Invoicing details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Client Profile Card */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Customer Details
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-lg font-black text-brand-accent shrink-0">
                {job.customer?.name ? job.customer.name.charAt(0) : 'R'}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-text-primary">
                  {job.customer?.name || 'Roshani Kadam'}
                </div>
                <div className="text-[10px] text-text-secondary font-semibold leading-relaxed">
                  Residential Client
                </div>
              </div>
            </div>

            <div className="border-t border-b border-border-subtle py-3.5 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-secondary">Contact Number</span>
                <span className="font-bold text-text-primary flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-text-secondary/50" /> {job.customer?.phone || '+91 98765 43210'}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="font-semibold text-text-secondary shrink-0">City</span>
                <span className="font-bold text-text-primary text-right leading-relaxed">{job.location}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="font-semibold text-text-secondary shrink-0">Exact Address</span>
                <span className="font-bold text-text-primary text-right leading-relaxed">{job.fullAddress || 'Address not provided'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-secondary">Scheduled Time</span>
                <span className="font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{job.scheduledDate}</span>
              </div>
            </div>
            
            <a
              href={`tel:${job.customer?.phone || '+91 98765 43210'}`}
              className="w-full py-2 bg-surface-secondary hover:bg-border-subtle text-text-primary text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-border-subtle"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
          </div>

          {/* Pricing Invoicing Calculator Sheet */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Invoicing Summary
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-text-secondary">
              <div className="flex justify-between items-center">
                <span>Base Service Charge</span>
                <span className="font-bold text-text-primary">₹{baseServiceFee}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Logged Parts Total</span>
                <span className="font-bold text-text-primary">₹{partsTotal}</span>
              </div>

              <div className="border-t border-border-subtle pt-3 flex justify-between items-center text-sm font-extrabold">
                <span className="text-text-primary">Total Invoice Billing</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{grandTotal}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-surface-primary rounded-3xl p-8 max-w-sm w-full text-center space-y-4.5 border border-border-subtle shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-text-primary">Work Order Resolved</h3>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                The repair job has been successfully resolved, service notes saved, and a digital invoice of <strong>₹{grandTotal}</strong> has been generated for client check-out.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/technician/history');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Continue to History
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
