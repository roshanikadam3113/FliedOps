import React from 'react';
import { User, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Roles() {
  const roles = [
    {
      title: 'Customer',
      icon: User,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      bullets: [
        'Create service requests',
        'Track service',
        'View history',
        'Give feedback'
      ]
    },
    {
      title: 'Technician',
      icon: Wrench,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      bullets: [
        'View assigned jobs',
        'Update job status',
        'Upload service proof',
        'Record parts used'
      ]
    },
    {
      title: 'Admin',
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      bullets: [
        'Manage operations',
        'Assign technicians',
        'Manage inventory',
        'View analytics'
      ]
    }
  ];

  return (
    <section id="solutions" className="py-16 lg:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            User Roles
          </h2>
        </div>

        {/* 3 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${r.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{r.title}</h3>
                </div>

                <div className="space-y-2.5 pt-2">
                  {r.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
