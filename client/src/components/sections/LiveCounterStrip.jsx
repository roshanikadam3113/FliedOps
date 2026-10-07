import React, { useState, useEffect } from 'react';

export default function LiveCounterStrip() {
  const [jobs, setJobs] = useState(48250);
  const [activeTechs, setActiveTechs] = useState(124);

  // Fake live metric ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev + Math.floor(Math.random() * 3));
      
      // Fluctuate active techs slightly
      setActiveTechs(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        if (next > 150) return 150;
        if (next < 110) return 110;
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-4 bg-surface-secondary border-b border-border-subtle overflow-x-auto relative">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-secondary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-secondary to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-w-[700px] gap-8">
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-text-primary tabular-nums tracking-tight">
                  {jobs.toLocaleString()}
                </span>
                <span className="text-brand-success font-bold text-lg">+</span>
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Total Jobs Dispatched
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-border-subtle" />

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-text-primary tabular-nums tracking-tight">
                  {activeTechs}
                </span>
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Active Techs in Field
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-border-subtle" />

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-text-primary tracking-tight">
                  99.4
                </span>
                <span className="text-brand-secondary font-bold text-lg">%</span>
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                SLA Compliance Rate
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-border-subtle" />

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-warning animate-pulse" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-text-primary tracking-tight">
                  14
                </span>
                <span className="text-text-primary font-bold text-sm ml-0.5">m</span>
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Avg Response Time
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
