import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, UserCheck, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
  ];

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === 'admin') navigate('/admin/dashboard');
    else if (user.role === 'technician') navigate('/technician/dashboard');
    else navigate('/customer/dashboard');
  };

  return (
    <header
      className={`fixed top-4 left-4 right-4 lg:left-8 lg:right-8 z-50 transition-all duration-200 h-[68px] flex items-center rounded-2xl ${
        scrolled
          ? 'bg-surface-primary/95 backdrop-blur-md border border-border-subtle shadow-lg'
          : 'bg-surface-primary border border-border-subtle shadow-md'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        
        {/* LEFT: FIELDOPS Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold shadow-2xs group-hover:bg-brand-accent-hover transition-colors">
            <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-text-primary">
            FIELDOPS
          </span>
        </Link>

        {/* CENTER: React Bits Style Nav Pills Bar */}
        <nav className="hidden lg:flex items-center bg-surface-secondary p-1.5 rounded-full border border-border-subtle shadow-2xs">
          {navLinks.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <a
                key={idx}
                href={item.href}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-text-primary text-surface-primary shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/70'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Actions (Theme Toggle + SIGN IN + GET STARTED or USER BADGE) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-stretch bg-surface-secondary rounded-full p-1 border border-border-subtle">
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-text-primary hover:bg-surface-primary transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-brand-accent" />
                <span>{user.name}</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-text-primary text-surface-primary rounded">
                  {user.role}
                </span>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                className="flex items-center justify-center px-3 py-1.5 rounded-full text-text-secondary hover:text-brand-error hover:bg-surface-primary transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-stretch bg-surface-secondary rounded-full p-1 border border-border-subtle">
              <Link
                to="/login"
                className="flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary hover:text-text-primary hover:bg-surface-primary transition-colors"
              >
                SIGN IN
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.08em] bg-brand-accent hover:bg-brand-accent-hover text-white shadow-xs transition-colors"
              >
                GET STARTED
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-primary border border-border-subtle rounded-2xl px-4 pt-4 pb-6 space-y-4 shadow-lg absolute top-[80px] left-4 right-4 z-50 animate-in fade-in duration-150">
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
                    ? 'bg-text-primary text-surface-primary'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-border-subtle space-y-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleDashboardRedirect();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-[0.08em] bg-text-primary text-surface-primary"
              >
                GO TO {user.role.toUpperCase()} DASHBOARD
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-lg text-center text-xs font-bold uppercase tracking-[0.08em] text-text-secondary bg-surface-secondary hover:bg-border-subtle transition-colors"
                >
                  SIGN IN
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full py-2.5 rounded-full text-center text-xs font-extrabold uppercase tracking-[0.08em] bg-brand-accent text-white items-center justify-center gap-1.5 shadow-xs"
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
