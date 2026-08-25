import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getTechJobs, updateJobStatus, completeJob } from '../../services/jobService';
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

// Pricing catalog for mock parts
const PARTS_CATALOG = [
  { name: 'Capacitor 45uF', price: 450 },
  { name: 'AC Fan Motor', price: 1200 },
  { name: 'Cooling Coil Repair', price: 1800 },
  { name: 'Gas Refilling (R32)', price: 2500 },
  { name: 'Wiring & Connectors', price: 350 },
  { name: 'Water Drain Pipe', price: 250 }
];

export default function ActiveJob() {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Technician interactive workflow state
  const [traveling, setTraveling] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [partsUsed, setPartsUsed] = useState([]);
  const [serviceNotes, setServiceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchJob = async () => {
    try {
      const jobs = await getTechJobs();
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
        setTraveling(targetJob.status === 'in-progress');
        // If it was already marked in-progress in storage, allow technician to proceed to checkin/working
        if (targetJob.status === 'in-progress') {
          // Restore traveler state
          setTraveling(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [locationState.state]);

  const handleStartTravel = async () => {
    if (!job) return;
    try {
      await updateJobStatus(job._id, 'in-progress');
      setTraveling(true);
      // Refresh details
      const updatedJobs = await getTechJobs();
      const updated = updatedJobs.find(j => j._id === job._id);
      if (updated) setJob(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
  };

  const handleAddPart = () => {
    const selectedPart = PARTS_CATALOG[selectedPartIndex];
    
    // Check if already added, increase quantity
    const existingIndex = partsUsed.findIndex(p => p.name === selectedPart.name);
    if (existingIndex !== -1) {
      const updated = [...partsUsed];
      updated[existingIndex].quantity += 1;
      setPartsUsed(updated);
    } else {
      setPartsUsed([...partsUsed, { ...selectedPart, quantity: 1 }]);
    }
  };

  const handleRemovePart = (index) => {
    const updated = [...partsUsed];
    updated.splice(index, 1);
    setPartsUsed(updated);
  };

  const handleCompleteJob = async (e) => {
    e.preventDefault();
    if (!job) return;
    setIsSubmitting(true);

    try {
      await completeJob(job._id, {
        serviceNotes,
        parts: partsUsed
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
  const partsTotal = partsUsed.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = baseServiceFee + partsTotal;

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/technician/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
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
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-orange-50 text-[#F97316] border border-orange-200 px-2 py-0.5 rounded">
                {job.category}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Job ID: {job._id}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">{job.title}</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">{job.description}</p>
          </div>

          {/* Workflow Interactive Panel */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Operational Status Pipeline
            </h3>

            {/* Visual Pipeline Bar */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#334155] bg-slate-50 border border-slate-200/60 p-3 rounded-xl overflow-x-auto gap-3">
              <span className="text-emerald-600">1. Assigned ✓</span>
              <span className={traveling ? 'text-emerald-600' : 'text-slate-400'}>
                2. Traveling {traveling ? '✓' : '○'}
              </span>
              <span className={checkedIn ? 'text-emerald-600' : 'text-slate-400'}>
                3. On Site {checkedIn ? '✓' : '○'}
              </span>
              <span className="text-slate-400">4. Resolved ○</span>
            </div>

            {/* Action Buttons based on stage */}
            <div className="pt-2">
              {!traveling ? (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F97316] shrink-0" />
                    <p className="text-xs text-orange-800 font-semibold leading-relaxed">
                      Please start your transit to the client location. This notifies the customer and initiates their live GPS tracking screen.
                    </p>
                  </div>
                  <button
                    onClick={handleStartTravel}
                    className="w-full py-3 text-xs font-black uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4.5 h-4.5" /> Begin Travel to Site
                  </button>
                </div>
              ) : !checkedIn ? (
                <div className="space-y-4">
                  <div className="h-[220px] bg-slate-100 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35" />
                    <div className="relative z-10 text-center space-y-1.5 p-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-xl max-w-xs shadow-md">
                      <Navigation className="w-5 h-5 text-[#0284C7] mx-auto animate-bounce" />
                      <div className="text-xs font-extrabold text-[#0F172A]">Routing Active</div>
                      <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
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
                  <div className="p-4.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold text-emerald-800">Checked-In Successfully</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Log any spare parts consumed and enter service completion notes below.</div>
                    </div>
                  </div>

                  {/* Spare Parts Consumed Logger */}
                  <div className="space-y-3.5 pt-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block">
                      Log Spare Parts Deducted
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedServiceIndex}
                        onChange={(e) => setSelectedPartIndex(Number(e.target.value))}
                        className="flex-grow p-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-[#F8FAFC] focus:outline-none focus:border-[#F97316]"
                      >
                        {PARTS_CATALOG.map((p, idx) => (
                          <option key={idx} value={idx}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddPart}
                        className="px-4 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>

                    {/* Logged parts list */}
                    {partsUsed.length > 0 && (
                      <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                        <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 border-b border-slate-150 font-bold text-slate-500 text-[9px] uppercase tracking-wider">
                          <div className="col-span-6">Part Name</div>
                          <div className="col-span-2 text-right">Price</div>
                          <div className="col-span-2 text-right">Qty</div>
                          <div className="col-span-2 text-right">Total</div>
                        </div>
                        <div className="divide-y divide-slate-100 bg-white">
                          {partsUsed.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 px-3 py-2 font-semibold items-center">
                              <div className="col-span-6 text-[#0F172A] flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePart(idx)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                {item.name}
                              </div>
                              <div className="col-span-2 text-right text-slate-500">₹{item.price}</div>
                              <div className="col-span-2 text-right text-[#0F172A]">{item.quantity}</div>
                              <div className="col-span-2 text-right text-[#0F172A]">₹{item.price * item.quantity}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Completion Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block">
                      Resolution & Service Notes
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      placeholder="Detail what repairs or adjustments were made on-site (e.g. Checked cooling compressor, refilled R32 refrigerant, changed outdoor line socket)..."
                      className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-semibold bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-black uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Customer Details
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg font-black text-[#F97316] shrink-0">
                {job.customer?.name ? job.customer.name.charAt(0) : 'R'}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-[#0F172A]">
                  {job.customer?.name || 'Roshani Kadam'}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Residential Client
                </div>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 py-3.5 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Contact Number</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {job.customer?.phone || '+91 98765 43210'}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="font-semibold text-slate-500 shrink-0">Service Address</span>
                <span className="font-bold text-[#0F172A] text-right leading-relaxed">{job.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Scheduled Time</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{job.scheduledDate}</span>
              </div>
            </div>
            
            <a
              href={`tel:${job.customer?.phone || '+91 98765 43210'}`}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
          </div>

          {/* Pricing Invoicing Calculator Sheet */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Invoicing Summary
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-500">
              <div className="flex justify-between items-center">
                <span>Base Service Charge</span>
                <span className="font-bold text-[#0F172A]">₹{baseServiceFee}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Logged Parts Total</span>
                <span className="font-bold text-[#0F172A]">₹{partsTotal}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-extrabold">
                <span className="text-[#0F172A]">Total Invoice Billing</span>
                <span className="text-emerald-600">₹{grandTotal}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4.5 border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0F172A]">Work Order Resolved</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                The AC repair job has been successfully resolved, service notes saved, and a digital invoice of <strong>₹{grandTotal}</strong> has been generated for client check-out.
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
