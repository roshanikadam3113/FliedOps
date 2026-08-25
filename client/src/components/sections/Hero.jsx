import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Wind, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  Camera, 
  Wrench, 
  Activity 
} from 'lucide-react';

export default function Hero() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const serviceCircles = [
    { name: 'AC & HVAC', icon: Wind, techs: '12 Techs', angle: 270 },    // Top
    { name: 'Electrical', icon: Zap, techs: '08 Techs', angle: 330 },   // Top Right
    { name: 'Plumbing', icon: Droplet, techs: '15 Techs', angle: 30 },    // Bottom Right
    { name: 'RO Service', icon: ShieldCheck, techs: '06 Techs', angle: 90 },// Bottom
    { name: 'CCTV Install', icon: Camera, techs: '09 Techs', angle: 150 },// Bottom Left
    { name: 'Appliance Repair', icon: Wrench, techs: '14 Techs', angle: 210 },// Top Left
  ];

  // Auto-cycle through services every 2.5 seconds seamlessly
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedServiceIndex((prev) => (prev + 1) % serviceCircles.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [serviceCircles.length]);

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24 bg-[#F4F6F8] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                FIELDOPS PLATFORM
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-[#64748B]">
                Smart Field Service Management
              </span>
            </div>

            {/* Main Headline & Subheading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Field operations,{' '}
                <span className="text-[#F97316]">finally under control.</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-[#334155] tracking-tight">
                Every job. Every technician. One operational view.
              </p>
            </div>

            {/* Hero Description */}
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed max-w-xl">
              FieldOps connects companies, technicians, and customers in one operational workspace — from the first service request to the final invoice.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                GET STARTED
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="px-6 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                SIGN IN
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>
            </div>

            {/* Feature-Oriented Hero Metrics (Three-Column Layout) */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E2E8F0] text-xs">
              <div>
                <div className="text-base font-extrabold text-[#0F172A]">REAL-TIME</div>
                <div className="text-[11px] font-semibold text-[#64748B]">Dispatch Visibility</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-[#0284C7]">LIVE</div>
                <div className="text-[11px] font-semibold text-[#64748B]">Job Tracking</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-emerald-600">FASTER</div>
                <div className="text-[11px] font-semibold text-[#64748B]">Service Coordination</div>
              </div>
            </div>

          </div>

          {/* Right Side: Mathematically Perfect 360-Degree Circular Service Capabilities Hub */}
          <div className="lg:col-span-6 flex items-center justify-center py-6">
            <div className="relative w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
              
              {/* Concentric Orbit Line matching radius R=150px */}
              <div className="absolute w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-full border-2 border-dashed border-[#F97316]/30 animate-spin-slow pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-[210px] h-[210px] sm:w-[240px] sm:h-[240px] rounded-full border border-slate-300/80 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

              {/* Center FIELDOPS Glowing Central Hub Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#0F172A] ring-4 ring-[#F97316]/40 text-white flex flex-col items-center justify-center shadow-2xl z-20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#F97316] flex items-center justify-center text-white mb-1 shadow-md animate-pulse">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-extrabold tracking-widest text-white">FIELDOPS</span>
                <span className="text-[9px] font-extrabold text-[#F97316] uppercase tracking-wider">AI DISPATCH</span>
              </div>

              {/* 6 Surrounding Service Satellite Circles Positioned via Exact Trigonometry */}
              {serviceCircles.map((service, idx) => {
                const IconComp = service.icon;
                const isSelected = selectedServiceIndex === idx;

                const rad = (service.angle * Math.PI) / 180;
                const currentRadius = window.innerWidth < 640 ? 125 : 155;
                const x = Math.round(currentRadius * Math.cos(rad));
                const y = Math.round(currentRadius * Math.sin(rad));

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedServiceIndex(idx)}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                    className={`absolute top-1/2 left-1/2 z-30 flex items-center gap-2 p-2 sm:p-2.5 rounded-full border transition-all duration-500 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#0F172A] text-white border-[#F97316] scale-110 shadow-2xl ring-4 ring-[#F97316]/30'
                        : 'bg-white text-[#0F172A] border-slate-200 shadow-md hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-[#0F172A]'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="text-left pr-2.5">
                      <div className="text-[11px] font-extrabold leading-none">{service.name}</div>
                      <div className={`text-[9px] font-bold ${isSelected ? 'text-slate-300' : 'text-[#64748B]'}`}>
                        {service.techs}
                      </div>
                    </div>
                  </button>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
