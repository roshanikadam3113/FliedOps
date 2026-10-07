import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-12 md:py-16 bg-surface-secondary border-b border-border-subtle">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-primary border border-border-subtle shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-primary">
            ONE PLATFORM. EVERY FIELD OPERATION.
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight leading-snug">
          Run your field operations{' '}
          <span className="text-brand-accent">with confidence.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Bring your company, technicians, and customers into one connected workspace — from the first service request to the final invoice.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-brand-accent hover:bg-brand-accent-hover text-white shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            GET STARTED
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-surface-primary hover:bg-surface-secondary text-text-primary border border-border-subtle shadow-2xs transition-colors flex items-center justify-center"
          >
            SIGN IN
          </Link>
        </div>

        {/* Trust Micro-Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-text-secondary font-semibold border-t border-border-subtle/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
            <span>Enterprise Security</span>
          </div>
          <span className="text-border-subtle hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Operational Scale</span>
          </div>
          <span className="text-border-subtle hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-success" />
            <span>Connected Teams</span>
          </div>
        </div>

      </div>
    </section>
  );
}
