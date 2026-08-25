import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-12 md:py-16 bg-gradient-to-b from-[#F4F6F8] via-[#EBF3F9] to-[#F4F6F8] border-b border-[#E2E8F0]">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F172A]">
            READY TO GET STARTED?
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
          Run your field operations{' '}
          <span className="text-[#F97316]">with confidence.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Bring your company, technicians, and customers into one connected workspace — from the first service request to the final invoice.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            GET STARTED NOW
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] shadow-2xs transition-colors flex items-center justify-center"
          >
            SIGN IN
          </Link>
        </div>

        {/* Trust Micro-Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#64748B] font-semibold border-t border-[#CBD5E1]/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Enterprise Security</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>99.9% Uptime SLA</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Support</span>
          </div>
        </div>

      </div>
    </section>
  );
}
