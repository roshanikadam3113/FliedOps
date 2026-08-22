import React from 'react';
import { 
  UserCheck, 
  MapPin, 
  Boxes, 
  Camera, 
  Receipt, 
  BarChart3 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: UserCheck,
      title: 'Smart Technician Assignment',
      description: 'Assign technicians based on skills, availability, workload, and location.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      icon: MapPin,
      title: 'Real-Time Job Tracking',
      description: 'Track service progress from assignment to completion.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      icon: Boxes,
      title: 'Inventory Management',
      description: 'Track spare parts and receive low-stock alerts.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Camera,
      title: 'Service Proof',
      description: 'Upload before-and-after service photos.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: Receipt,
      title: 'Invoicing',
      description: 'Generate invoices and track payment status.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Monitor jobs, revenue, technician performance, and customer satisfaction.',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Everything You Need to Run Field Service Operations
          </h2>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
