import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, UserCheck, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'COMPANY', href: '#company' },
    { label: 'TECHNICIANS', href: '#technicians' },
    { label: 'CUSTOMERS', href: '#customers' },
    { label: 'HOW IT WORKS', href: '#workflow' },
    { label: 'ABOUT', href: '#about' }
  ];

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === 'admin') navigate('/admin/dashboard');
    else if (user.role === 'technician') navigate('/technician/dashboard');
    else navigate('/customer/dashboard');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-[68px] flex items-center ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-2xs'
          : 'bg-white border-b border-[#E2E8F0]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        
        {/* LEFT: FIELDOPS Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold shadow-2xs group-hover:bg-[#EA580C] transition-colors">
            <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F172A]">
            FIELDOPS
          </span>
        </Link>

        {/* CENTER: React Bits Style Nav Pills Bar */}
        <nav className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-2xs">
          {navLinks.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <a
                key={idx}
                href={item.href}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#334155] hover:text-[#0F172A] hover:bg-white/70'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Actions (SIGN IN + GET STARTED or USER BADGE) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                <span>{user.name}</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-[#0F172A] text-white rounded">
                  {user.role}
                </span>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-full text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#334155] hover:text-[#0F172A] transition-colors px-2 py-1"
              >
                SIGN IN
              </Link>

              <Link
                to="/register"
                className="px-4.5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                GET STARTED
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-4 pb-6 space-y-4 shadow-lg absolute top-[68px] left-0 right-0 z-50 animate-in fade-in duration-150">
          <div className="space-y-2">
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => {
                  setActiveTab(idx);
                  setMobileMenuOpen(false);
                }}
                className={`block px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                  activeTab === idx
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#334155] hover:bg-slate-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleDashboardRedirect();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-[0.08em] bg-[#0F172A] text-white"
              >
                GO TO {user.role.toUpperCase()} DASHBOARD
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-lg text-center text-xs font-bold uppercase tracking-[0.08em] text-[#334155] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  SIGN IN
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full py-2.5 rounded-full text-center text-xs font-extrabold uppercase tracking-[0.08em] bg-[#F97316] text-white items-center justify-center gap-1.5 shadow-xs"
                >
                  GET STARTED
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
