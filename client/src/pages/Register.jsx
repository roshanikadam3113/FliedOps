import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Wrench, 
  User, 
  ArrowRight, 
  Lock, 
  Mail, 
  Activity,
  AlertCircle,
  UserCheck,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Kolhapur');
  const [specialty, setSpecialty] = useState('AC & HVAC');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { user, isAuthenticated, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (userRole) => {
    if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'technician') navigate('/technician/dashboard');
    else navigate('/customer/dashboard');
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      handleRedirect(user.role);
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in your name, email, password, and confirm password');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setLocalError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        phone,
        specialty: role === 'technician' ? specialty : undefined,
        location
      });

      if (newUser) {
        handleRedirect(newUser.role);
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#24609F] font-sans antialiased">
      
      {/* Background Image Asset - Shifted left to showcase the technician working */}
      <div 
        className="absolute inset-0 bg-cover bg-[20%_center] filter blur-[2px] scale-105 opacity-80 pointer-events-none z-0" 
        style={{ backgroundImage: "url('/fieldops_tech_job.png')" }} 
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-slate-950/40 z-10 pointer-events-none" />

      {/* Centered Registration Panel */}
      <div className="relative z-20 w-full max-w-md flex flex-col justify-center py-4">
        
        {/* Branding header */}
        <div className="w-full text-center mb-4">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F97316] to-[#EA580C] flex items-center justify-center text-white font-bold shadow-md">
              <Activity className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-widest text-white drop-shadow-md">
              FIELDOPS
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white/95 backdrop-blur-md border border-white/20 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-5">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Create your account
            </h2>
            <p className="text-xs text-[#64748B] font-semibold">
              Already registered?{' '}
              <Link to="/login" className="font-extrabold text-[#F97316] hover:text-[#EA580C] hover:underline transition-colors">
                Sign in to existing account
              </Link>
            </p>
          </div>

          {/* Account Type Selector (Customer, Tech, Admin) */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#64748B] block">
              CHOOSE ACCOUNT TYPE
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F4F6F8] p-1 rounded-xl border border-slate-200 text-[10px] font-extrabold">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-[#0F172A] text-white shadow-sm scale-[1.01]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/50'
                }`}
              >
                <User className="w-3.5 h-3.5" /> CLIENT
              </button>

              <button
                type="button"
                onClick={() => setRole('technician')}
                className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'technician'
                    ? 'bg-[#0F172A] text-white shadow-sm scale-[1.01]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/50'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" /> TECH
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-[#0F172A] text-white shadow-sm scale-[1.01]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> ADMIN
              </button>
            </div>
          </div>

          {/* Local Error alert */}
          {localError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="leading-snug">{localError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amit Sharma"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 bg-[#F8FAFC] focus:bg-white transition-all duration-250 ${
                    confirmPassword 
                      ? password === confirmPassword 
                        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white' 
                        : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 focus:bg-white'
                      : 'border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                City / Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
                />
              </div>
            </div>
          </div>

          {role === 'technician' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                Service Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-250"
              >
                <option value="AC & HVAC">AC & HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="RO Service">RO Service</option>
                <option value="CCTV Installation">CCTV Installation</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      </div>

    </div>
  );
}
