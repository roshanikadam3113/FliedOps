import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRequest } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Wrench, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AC & HVAC');
  const [urgency, setUrgency] = useState('medium');
  const [location, setLocation] = useState(user?.location || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !location || !scheduledDate) {
      setError('Please fill in the title, description, address, and preferred date.');
      return;
    }

    setLoading(true);
    try {
      const fullDateSlot = `${scheduledDate} at ${scheduledTime}`;
      await createRequest({
        title,
        description,
        category,
        urgency,
        location,
        scheduledDate: fullDateSlot
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit service request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-500 shadow-md animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#0F172A]">Request Submitted Successfully!</h2>
          <p className="text-xs text-slate-500 font-semibold">
            Our dispatcher is matching your request with a nearby technician. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A] max-w-2xl mx-auto">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider">
          New Service Ticket
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-[#F97316]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-[#0F172A]">
              Schedule Field Service
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold">
              Fill out the details below to request a technician dispatch
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Title */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Short Summary of Problem
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AC cooling fan making high-pitched noise"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Category & Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Service Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
              >
                <option value="AC & HVAC">AC & HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="RO Service">RO Service</option>
                <option value="CCTV Installation">CCTV Installation</option>
                <option value="General Maintenance">General Maintenance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
              >
                <option value="low">Low (Standard Maintenance)</option>
                <option value="medium">Medium (Needs attention in 24h)</option>
                <option value="high">High (Needs immediate dispatch)</option>
                <option value="critical">Critical (Power line spark, flood hazard)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail, noting any codes, makes/models, or details about the issue..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Preferred Service Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Preferred Time Slot
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
                >
                  <option value="09:00 AM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM">Late Afternoon (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Service Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address details..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
