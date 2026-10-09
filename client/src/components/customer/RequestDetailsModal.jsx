import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  FileText,
  User,
  Star,
  Image as ImageIcon
} from 'lucide-react';

export default function RequestDetailsModal({ job, onClose, onCancel, onReschedule }) {
  if (!job) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold uppercase flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'in-progress':
      case 'on-the-way':
      case 'arrived':
        return <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-extrabold uppercase animate-pulse">{status.replace('-', ' ')}</span>;
      case 'assigned':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase">Assigned</span>;
      case 'pending':
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold uppercase">Pending Dispatch</span>;
    }
  };

  const isCancelable = ['pending', 'assigned'].includes(job.status);
  const isReschedulable = ['pending', 'assigned'].includes(job.status);

  return (
    <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
              Request Details • ID: #{job._id.slice(-6).toUpperCase()}
            </div>
            <h2 className="text-base font-extrabold tracking-tight">
              {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans antialiased text-[#0F172A]">
          
          {/* Status & Urgency Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Current Status</span>
              {getStatusBadge(job.status)}
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Category & Urgency</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded">{job.category}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  job.urgency === 'critical' ? 'bg-rose-100 text-rose-700' :
                  job.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-sky-100 text-sky-700'
                }`}>
                  {job.urgency} priority
                </span>
              </div>
            </div>
          </div>

          {/* Service Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Service Type</span>
              <span className="text-slate-800 font-extrabold">{job.serviceType || 'Standard Maintenance'}</span>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Scheduled Slot</span>
              <span className="text-slate-800 font-extrabold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {job.scheduledDate}
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Service Address</span>
              <span className="text-slate-800 font-extrabold leading-relaxed flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> 
                <span className="line-clamp-2">{job.fullAddress || job.location}</span>
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Contact Number</span>
              <span className="text-slate-800 font-extrabold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {job.contactPhone || '+91 99887 76655'}
              </span>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Problem Description</h3>
            <p className="p-4 bg-[#F8FAFC] border border-slate-200/70 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Optional Image Attachment Preview */}
          {job.image && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Problem Photo Attachment
              </h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-48 bg-slate-50 flex items-center justify-center p-2">
                <img src={job.image} alt="Service Issue" className="max-h-44 object-contain rounded-xl" />
              </div>
            </div>
          )}

          {/* Assigned Technician Section */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Technician Assignment
            </h3>

            {job.technician ? (
              <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center font-black text-[#F97316]">
                    {job.technician.name ? job.technician.name.charAt(0) : 'T'}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#0F172A]">{job.technician.name}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{job.technician.specialty || 'HVAC Specialist'}</div>
                    <div className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {job.technician.rating || 4.9} Rating
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${job.technician.phone || '+91 98123 45678'}`}
                  className="px-3.5 py-2 bg-white hover:bg-orange-50 border border-orange-200 text-[#F97316] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Tech
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-1">
                <span className="text-xs font-bold text-slate-600 block">Technician not assigned yet</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Our dispatcher is matching your request with a nearby technician.</span>
              </div>
            )}
          </div>

          {/* Cancellation reason if cancelled */}
          {job.status === 'cancelled' && job.cancelReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
              <span className="font-extrabold text-rose-800 block">Cancellation Reason:</span>
              <span className="text-rose-700 font-medium">{job.cancelReason}</span>
            </div>
          )}

          {/* Timestamps Footer */}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(job.updatedAt || job.createdAt).toLocaleString()}</span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isCancelable && onCancel && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCancel(job);
                }}
                className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel Request
              </button>
            )}

            {isReschedulable && onReschedule && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReschedule(job);
                }}
                className="px-4 py-2 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reschedule
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
