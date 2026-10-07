import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  FileText, 
  Users, 
  Package, 
  Receipt 
} from 'lucide-react';

export default function CoreFeatures() {
  const features = [
    {
      title: 'Smart Technician Assignment',
      desc: 'Match service requests with technicians using skills, availability, workload, and operational context.',
      icon: Sparkles
    },
    {
      title: 'Live Job Tracking',
      desc: 'Track technician locations, active job statuses, and travel times on a live operational map.',
      icon: MapPin
    },
    {
      title: 'Service Management',
      desc: 'Centralize every service request from creation to completion with full historical context.',
      icon: FileText
    },
    {
      title: 'Technician Management',
      desc: 'Equip your field team with a dedicated mobile app for routing, job details, and completion logging.',
      icon: Users
    },
    {
      title: 'Inventory & Parts',
      desc: 'Track parts consumed in the field and manage warehouse inventory levels automatically.',
      icon: Package
    },
    {
      title: 'Invoices & Payments',
      desc: 'Generate instant invoices upon job completion and accept payments without delays.',
      icon: Receipt
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-surface-primary border-b border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
            CORE FEATURES
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Everything you need for field operations.
          </h2>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            A complete suite of tools designed to remove friction from every step of the service lifecycle.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div
                key={idx}
                className="bg-surface-secondary/50 backdrop-blur-sm border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-4 hover:border-brand-secondary/40 hover:bg-surface-primary hover:shadow-2xl hover:shadow-brand-secondary/10 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Decorative Glow Blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-10 h-10 rounded-xl bg-surface-primary border border-border-subtle text-brand-secondary flex items-center justify-center group-hover:bg-brand-secondary/10 group-hover:text-brand-secondary transition-colors shadow-xs relative z-10">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 relative z-10">
                  <h3 className="text-sm font-extrabold text-text-primary tracking-tight group-hover:text-brand-secondary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
