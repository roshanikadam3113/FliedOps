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
  Phone,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';

export default function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AC & HVAC');
  const [serviceType, setServiceType] = useState('Standard Repair');
  const [urgency, setUrgency] = useState('medium');
  const [location, setLocation] = useState(user?.location || '');
  const [fullAddress, setFullAddress] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [imagePreview, setImagePreview] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim() || !fullAddress.trim() || !scheduledDate || !contactPhone.trim()) {
      setError('Please fill in all required fields: title, description, city, full address, contact phone, and preferred date.');
      return;
    }

    setLoading(true);
    try {
      const fullDateSlot = `${scheduledDate} at ${scheduledTime}`;
      await createRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        serviceType,
        urgency,
        location: location.trim(),
        fullAddress: fullAddress.trim(),
        contactPhone: contactPhone.trim(),
        scheduledDate: fullDateSlot,
        image: imagePreview
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/customer/requests');
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
        <div className="w-16 h-16 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success shadow-md animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-text-primary">Service Request Created!</h2>
          <p className="text-xs text-text-secondary font-semibold max-w-sm mx-auto">
            Your request has been set to <strong>Pending</strong>. Redirecting to My Requests page...
          </p>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Main Card - Centered and Constrained */}
      <div className="max-w-3xl mx-auto bg-surface-primary border border-border-subtle rounded-[2rem] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex items-center gap-4 bg-surface-secondary/30">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-text-primary">
              Schedule Field Service Request
            </h1>
            <p className="text-xs text-text-secondary font-medium mt-0.5">
              Fill out the details below to request a technician dispatch
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Title */}
          <div>
            <label className="text-xs font-bold text-text-primary block mb-1.5">
              Problem Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AC cooling fan making high-pitched noise"
              className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary placeholder:text-text-secondary/50"
            />
          </div>

          {/* Category & Service Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary"
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
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Service Type <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary"
              >
                <option value="Standard Repair">Standard Repair</option>
                <option value="Servicing & Cleaning">Servicing & Cleaning</option>
                <option value="New Installation">New Installation</option>
                <option value="Inspection & Diagnosis">Inspection & Diagnosis</option>
                <option value="Emergency Breakdown">Emergency Breakdown</option>
              </select>
            </div>
          </div>

          {/* Urgency & Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Urgency Level <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary"
              >
                <option value="low">Low (Standard Maintenance)</option>
                <option value="medium">Medium (Needs attention in 24h)</option>
                <option value="high">High (Needs immediate dispatch)</option>
                <option value="critical">Critical (Power line spark, flood hazard)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="text-xs font-bold text-text-primary block mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail, noting any error codes, makes/models, or specific symptoms..."
              rows={4}
              className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary placeholder:text-text-secondary/50"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Preferred Service Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full pl-10 pr-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Preferred Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <Clock className="w-4 h-4" />
                </div>
                <select
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary"
                >
                  <option value="09:00 AM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM">Late Afternoon (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Full Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Service City <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary"
                >
                  <option value="">Select a city</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Satara">Satara</option>
                  <option value="Sangli">Sangli</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Aurangabad">Aurangabad</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Latur">Latur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Full Exact Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Flat No, Building, Street, Landmark"
                  className="w-full px-4 py-3 border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200 text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Optional Problem Image Upload */}
          <div>
            <label className="text-xs font-bold text-text-primary block mb-1.5">
              Problem Photo / Image (Optional)
            </label>

            {imagePreview ? (
              <div className="relative w-max mt-2">
                <img src={imagePreview} alt="Problem Preview" className="h-32 rounded-xl border border-border-subtle object-cover shadow-sm" />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-md cursor-pointer hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border-subtle hover:border-brand-accent rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-surface-secondary hover:bg-brand-accent/5 transition-all mt-2 group">
                <div className="w-10 h-10 rounded-full bg-surface-primary shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-text-secondary group-hover:text-brand-accent transition-colors" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-text-primary block">Click to upload photo of issue</span>
                  <span className="text-[11px] font-medium text-text-secondary/70">PNG, JPG up to 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>



          {/* Form Actions */}
          <div className="border-t border-border-subtle pt-6 flex items-center justify-end gap-4 mt-2">
            <Link
              to="/customer/dashboard"
              className="px-5 py-2.5 border border-border-subtle hover:bg-surface-secondary text-text-primary text-sm font-bold rounded-xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-accent hover:opacity-90 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 min-w-[200px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Service Request'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
