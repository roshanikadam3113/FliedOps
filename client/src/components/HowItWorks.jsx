import React from 'react';
import { FilePlus, UserCheck, Wrench, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Customer Request',
      description: 'Customer submits a service request.',
      icon: FilePlus,
    },
    {
      number: '02',
      title: 'Smart Assignment',
      description: 'The system helps the admin select a suitable technician.',
      icon: UserCheck,
    },
    {
      number: '03',
      title: 'Technician Service',
      description: 'Technician receives the job and performs the service.',
      icon: Wrench,
    },
    {
      number: '04',
      title: 'Completion & Billing',
      description: 'Service is completed, parts are recorded, and the invoice is generated.',
      icon: CheckCircle,
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-20 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-indigo-400 font-mono">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
