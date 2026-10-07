import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/jobService';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ShieldCheck,
  Save,
  Bell
} from 'lucide-react';

export default function CustomerProfile() {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [prefsInApp, setPrefsInApp] = useState(user?.notificationPreferences?.inApp ?? true);
  const [prefsEmail, setPrefsEmail] = useState(user?.notificationPreferences?.email ?? true);
  const [prefsSms, setPrefsSms] = useState(user?.notificationPreferences?.sms ?? false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const updatedUser = await updateUserProfile({
        name,
        phone,
        location,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        notificationPreferences: {
          inApp: prefsInApp,
          email: prefsEmail,
          sms: prefsSms
        }
      });

      if (updatedUser) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Top Navigation - Full Width */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
          Account Profile & Security
        </span>
      </div>

      {/* Main Card - Centered and Constrained */}
      <div className="max-w-3xl mx-auto bg-surface-primary border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-border-subtle bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0">
              {name ? name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">{name || 'Customer'}</h1>
              <p className="text-xs text-slate-300 font-semibold">{user?.email || 'customer@gmail.com'}</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-white/10 rounded-full border border-white/20 text-brand-accent">
            Customer Portal Account
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-text-secondary border-b border-border-subtle pb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Email Address (Read-only)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold bg-surface-secondary text-text-secondary/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Default Service Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sector 62, Kolhapur"
                    className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-text-secondary border-b border-border-subtle pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Security & Change Password (Optional)
            </h2>

            <div className="space-y-4 bg-surface-secondary p-4 rounded-2xl border border-border-subtle">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-text-primary block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters..."
                      className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary block mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password..."
                      className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-text-secondary border-b border-border-subtle pb-2 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-brand-accent" /> Notification Preferences
            </h2>

            <div className="space-y-4 bg-surface-secondary p-4 rounded-2xl border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">In-App Notifications</h3>
                  <p className="text-[11px] text-text-secondary/70">Receive alerts within the platform</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={prefsInApp} onChange={() => setPrefsInApp(!prefsInApp)} />
                  <div className="w-9 h-5 bg-border-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">Email Notifications</h3>
                  <p className="text-[11px] text-text-secondary/70">Receive alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={prefsEmail} onChange={() => setPrefsEmail(!prefsEmail)} />
                  <div className="w-9 h-5 bg-border-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">SMS Notifications</h3>
                  <p className="text-[11px] text-text-secondary/70">Receive SMS alerts (charges may apply)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={prefsSms} onChange={() => setPrefsSms(!prefsSms)} />
                  <div className="w-9 h-5 bg-border-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-border-subtle pt-5 flex items-center justify-end gap-3">
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 border border-border-subtle hover:bg-surface-secondary text-text-secondary text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-accent hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
