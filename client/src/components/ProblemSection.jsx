import React from 'react';
import { PhoneOff, UserX, EyeOff } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: PhoneOff,
      title: 'Scattered Requests',
      description: 'Customer requests get lost across calls and messages.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      icon: UserX,
      title: 'Manual Assignment',
      description: 'Managers waste time finding suitable technicians.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: EyeOff,
      title: 'No Real-Time Visibility',
      description: 'Customers and managers don’t know the current status of a service.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  return (
    <section className="py-16 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Stop Managing Field Operations Across Calls, WhatsApp & Spreadsheets.
          </h2>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${prob.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{prob.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{prob.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
