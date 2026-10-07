import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Wrench, 
  User, 
  Lock, 
  Mail, 
  Activity,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { user, isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'technician') navigate('/technician/dashboard');
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

    if (!email || !password) {
      setLocalError('Please enter both email address and password');
      return;
    }

    try {
      const loggedUser = await login(email, password, selectedRole);
      if (loggedUser) {
        handleRedirect(loggedUser.role);
      }
    } catch (err) {
      setLocalError(err.message || 'Invalid email or password');
    }
  };

  const getRolePlaceholder = () => {
    if (selectedRole === 'admin') return 'admin@test.com';
    if (selectedRole === 'technician') return 'tech@test.com';
    return 'client@test.com';
  };

  return (
    <div className="min-h-screen flex bg-page-bg font-sans antialiased text-text-primary">
      
      {/* LEFT PANEL: Vibrant Branding Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden shadow-2xl z-10 rounded-r-[2.5rem]">
        {/* Full Vibrant Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-10000 hover:scale-110" 
          style={{ backgroundImage: "url('/fieldops_tech_job.png')" }} 
        />
        {/* Rich Gradient Overlay for text readability & aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-brand-accent/40 z-10" />
        
        {/* Top Branding */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/40">
            <Activity className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-3xl font-black tracking-widest text-white drop-shadow-md">
            FIELDOPS
          </span>
        </div>

        {/* Bottom Copy */}
        <div className="relative z-20 max-w-md mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Enterprise Grade
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            Elevate your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-orange-300">service game.</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Unify your dispatch, empower your workforce, and deliver unforgettable customer experiences.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-16 bg-page-bg relative">
        
        {/* Mobile Header Branding (Visible only on mobile) */}
        <Link to="/" className="lg:hidden flex items-center gap-3 justify-center mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-widest text-text-primary">
            FIELDOPS
          </span>
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="bg-surface-primary p-6 sm:p-7 rounded-[2rem] shadow-2xl shadow-brand-accent/5 border border-border-subtle relative">
            <div className="space-y-1 mb-6 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Welcome back
            </h2>
            <p className="text-base text-text-secondary font-medium">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Account Type Selector - Pill Design */}
          <div className="mb-5 p-1 bg-surface-secondary rounded-2xl border border-border-subtle shadow-sm">
            <div className="grid grid-cols-3 gap-1 relative">
              {['customer', 'technician', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`relative z-10 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === role
                      ? 'text-brand-accent bg-surface-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/40'
                  }`}
                >
                  {role === 'customer' && <User className="w-4 h-4" />}
                  {role === 'technician' && <Wrench className="w-4 h-4" />}
                  {role === 'admin' && <Building2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{role === 'customer' ? 'Client' : role === 'technician' ? 'Tech' : 'Admin'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {localError && (
            <div className="mb-6 bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="leading-snug">{localError}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-primary pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getRolePlaceholder()}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-primary pl-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-accent transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-2.5 border border-transparent rounded-xl text-sm font-semibold bg-surface-secondary focus:bg-surface-primary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder:text-text-secondary/60 text-text-primary transition-all duration-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-brand-accent cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-extrabold tracking-wide uppercase bg-gradient-to-r from-brand-accent to-orange-400 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-brand-accent/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Footer link */}
            <div className="text-center pt-5">
              <p className="text-sm text-text-secondary font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-brand-accent hover:text-orange-500 transition-colors underline-offset-4 hover:underline">
                  Create a Client Account
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
