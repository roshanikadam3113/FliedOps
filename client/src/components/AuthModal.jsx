import React, { useState } from 'react';
import { X, ShieldCheck, User, Wrench, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'get-started' }) {
  const [mode, setMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome to FieldOps!</h3>
            <p className="text-sm text-slate-400">
              Demo environment initialized. Redirecting to your interactive workspace...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Interactive FieldOps Demo</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Access FieldOps Workspaces' : 'Start Free 14-Day Trial'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select your role to explore the interactive simulation.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'admin' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('technician')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'technician' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Technician</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'customer' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@servicebusiness.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{mode === 'login' ? `Launch ${selectedRole.toUpperCase()} Console` : 'Get Instant Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <span>Don't have an account? <button type="button" onClick={() => setMode('get-started')} className="text-indigo-400 hover:underline">Get Started</button></span>
              ) : (
                <span>Already have a workspace? <button type="button" onClick={() => setMode('login')} className="text-indigo-400 hover:underline">Log In</button></span>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
