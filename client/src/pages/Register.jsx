import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Activity,
  AlertCircle,
  UserCheck,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Quote
} from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  
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

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
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
        role: 'customer',
        phone,
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
    <div className="min-h-screen flex bg-page-bg font-sans antialiased text-text-primary">
      
      {/* LEFT PANEL: Vibrant Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden shadow-2xl z-10 rounded-r-[2.5rem]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-[20%_center] z-0 scale-105 transition-transform duration-10000 hover:scale-110" 
          style={{ backgroundImage: "url('/fieldops_tech_job.png')" }} 
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-brand-accent/30 z-10" />
        
        {/* Top Branding */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/40">
            <Activity className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-3xl font-black tracking-widest text-white drop-shadow-md">
            FIELDOPS
          </span>
        </div>

        {/* Bottom Copy / Testimonial Style */}
        <div className="relative z-20 max-w-lg mb-4">
          <Quote className="w-10 h-10 text-brand-accent/80 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-8 leading-snug tracking-tight">
            "FieldOps has completely transformed how we request and track our facility services. It's fast, transparent, and incredibly reliable."
          </h2>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Form */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-4 sm:p-6 bg-page-bg relative overflow-y-auto">
        
        {/* Mobile Header Branding (Visible only on mobile) */}
        <Link to="/" className="lg:hidden flex items-center gap-3 justify-center mb-10 mt-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-widest text-text-primary">
            FIELDOPS
          </span>
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-[420px] my-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out py-4">
          <div className="bg-surface-primary p-5 sm:p-6 rounded-[2rem] shadow-2xl shadow-brand-accent/5 border border-border-subtle relative">
            <div className="space-y-1 mb-4 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Join FieldOps
            </h2>
            <p className="text-base text-text-secondary font-medium">
              Create a Client Account to start requesting services.
            </p>
          </div>

          {/* Error Alert */}
          {localError && (
            <div className="mb-6 bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="leading-snug">{localError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-primary pl-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amit Sharma"
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-primary pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary pl-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-11 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary pl-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-2.5 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm ${
                      confirmPassword 
                        ? password === confirmPassword 
                          ? 'border-brand-success/50 bg-surface-primary focus:border-brand-success focus:ring-brand-success/20' 
                          : 'border-brand-error/50 bg-surface-primary focus:border-brand-error focus:ring-brand-error/20'
                        : 'border-transparent bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-brand-accent/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary pl-1">Phone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765..."
                    autoComplete="tel"
                    className="w-full pl-11 pr-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary pl-1">Location</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune"
                    autoComplete="address-level2"
                    className="w-full pl-11 pr-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-extrabold tracking-wide uppercase bg-gradient-to-r from-brand-accent to-orange-400 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-brand-accent/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>

          {/* Footer link */}
            <div className="text-center pt-5 pb-0">
              <p className="text-sm text-text-secondary font-medium">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-brand-accent hover:text-orange-500 transition-colors underline-offset-4 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
