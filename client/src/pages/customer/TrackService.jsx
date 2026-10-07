import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { subscribeToEvent } from '../../services/socketService';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  Wrench, 
  UserCheck, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function TrackService() {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const jobs = await getJobs();
      const selectedJobId = locationState.state?.jobId;
      
      let targetJob = null;
      if (selectedJobId) {
        targetJob = jobs.find(j => j._id === selectedJobId);
      }
      
      if (!targetJob) {
        targetJob = jobs.find(j => ['pending', 'assigned', 'on-the-way', 'arrived', 'in-progress'].includes(j.status)) || jobs[0];
      }

      setJob(targetJob);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [locationState.state]);

  // Subscribe to real-time Socket.IO events
  useEffect(() => {
    const unsubscribeStatus = subscribeToEvent('serviceStatusUpdated', (updatedJob) => {
      if (job && updatedJob && updatedJob._id === job._id) {
        setJob(updatedJob);
      }
    });

    const unsubscribeTech = subscribeToEvent('technicianAssigned', (updatedJob) => {
      if (job && updatedJob && updatedJob._id === job._id) {
        setJob(updatedJob);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTech();
    };
  }, [job]);

  // Wait for real location from backend (currently unavailable in this phase)
  // Cleaned up fake simulation.

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-text-secondary/50 uppercase tracking-widest font-sans">
        Connecting Real-time GPS Console...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 font-sans text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mx-auto text-text-secondary/50">
          <Navigation className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-black text-text-primary">No Active Requests Found</h2>
          <p className="text-xs text-text-secondary font-semibold leading-relaxed">
            There are currently no active service requests to track. Book a technician to get started.
          </p>
        </div>
        <Link
          to="/customer/create-request"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-accent hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          Book a Technician
        </Link>
      </div>
    );
  }

  // Stages pipeline mapping
  const stages = [
    { key: 'pending', label: 'Pending' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'on-the-way', label: 'On the Way' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'completed': return 5;
      case 'in-progress': return 4;
      case 'arrived': return 3;
      case 'on-the-way': return 2;
      case 'assigned': return 1;
      case 'pending':
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(job.status);
  const tech = job.technician;

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Live Dispatch
        </span>
      </div>

      {/* Progress Pipeline Stage Tracker */}
      <div className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-text-primary">
              Service Request Stage: <span className="text-brand-accent uppercase">{job.status.replace('-', ' ')}</span>
            </h2>
            <p className="text-[10px] text-text-secondary font-semibold">
              Ticket ID: #{job._id.slice(-6).toUpperCase()} • {job.title}
            </p>
          </div>
          <span className="text-[10px] font-bold text-text-secondary/50">
            Updated {new Date(job.updatedAt || job.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {stages.map((stage, idx) => {
            const isDone = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center space-y-2 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent 
                    ? 'bg-brand-accent text-white ring-4 ring-brand-accent/20 scale-110 shadow-md' 
                    : isDone 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-surface-secondary text-text-secondary/50'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : (idx + 1)}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-brand-accent font-extrabold' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary/50'
                }`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Live GPS Simulation Map */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-primary border border-border-subtle rounded-2xl shadow-sm overflow-hidden relative">
            
            {/* Map Header Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-white/10 max-w-xs sm:max-w-none">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center animate-pulse">
                <Navigation className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-brand-accent tracking-wider">Dispatch Status</span>
                <div className="text-sm font-extrabold text-white">
                  {job.status === 'on-the-way' ? 'Technician En Route' : 
                   job.status === 'arrived' ? 'Technician Arrived at Location' :
                   job.status === 'in-progress' ? 'Service Underway on Site' :
                   job.status === 'completed' ? 'Service Completed!' :
                   tech ? 'Technician Assigned' : 'Awaiting Technician Dispatch'}
                </div>
              </div>
            </div>

            {/* Abstract Map Simulation */}
            <div className="h-[400px] w-full relative overflow-hidden bg-slate-200 dark:bg-slate-900/50">
              {/* CSS Grid Roads */}
              <div className="absolute inset-0 opacity-50 dark:opacity-20" style={{
                backgroundImage: `
                  linear-gradient(90deg, #ffffff 12px, transparent 12px),
                  linear-gradient(#ffffff 12px, transparent 12px)
                `,
                backgroundSize: '100px 100px'
              }}></div>
              
              {/* Abstract Park/Water blocks */}
              <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300/40 dark:bg-emerald-800/40 rounded-3xl blur-md"></div>
              <div className="absolute bottom-10 right-10 w-56 h-32 bg-sky-300/40 dark:bg-sky-800/40 rounded-3xl blur-md -rotate-6"></div>
              
              {/* Route Path (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                {/* A curved path from tech to destination */}
                <path 
                  d="M 20% 75% C 40% 75%, 50% 30%, 80% 25%" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeDasharray="12 12" 
                  className="text-brand-accent/60 dark:text-brand-accent/40 animate-pulse" 
                />
              </svg>

              {/* Destination Marker (Home) */}
              <div className="absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 shadow-2xl">
                <div className="w-10 h-10 bg-surface-primary rounded-full shadow-xl flex items-center justify-center border-[3px] border-text-primary z-10 relative">
                  <MapPin className="w-5 h-5 text-text-primary" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-surface-primary text-[10px] font-black px-2 py-1 rounded shadow-md border border-border-subtle whitespace-nowrap">
                  Your Location
                </div>
              </div>

              {/* Technician Marker (Moving) */}
              <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-tr from-brand-accent to-orange-400 rounded-full shadow-xl flex items-center justify-center border-[3px] border-white z-10 relative group hover:scale-110 transition-transform cursor-pointer">
                    <Navigation className="w-5 h-5 text-white -rotate-45" />
                  </div>
                  <div className="absolute inset-0 bg-brand-accent rounded-full animate-ping opacity-50 blur-sm"></div>
                  
                  {tech && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
                      {tech.name?.split(' ')[0]} is on the way
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Technician Info Card & Request Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Technician Profile Card */}
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Assigned Professional
            </h3>

            {tech ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-xl font-black text-brand-accent shrink-0 shadow-sm">
                    {tech.name ? tech.name.charAt(0) : 'T'}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-text-primary">{tech.name}</div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-600 dark:text-amber-400">
                      ★ {tech.rating || 4.9} Senior Tech
                    </div>
                    <div className="text-[10px] font-semibold text-text-secondary/70">{tech.specialty || job.category} Specialist</div>
                  </div>
                </div>

                <div className="border-t border-b border-border-subtle py-3.5 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-secondary">Contact Phone</span>
                    <span className="font-bold text-text-primary flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-text-secondary/50" /> {tech.phone || '+91 98123 45678'}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${tech.phone || '+91 98123 45678'}`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20 transition-all flex items-center justify-center gap-1 cursor-pointer border border-brand-accent/30"
                >
                  <Phone className="w-4 h-4" /> Call Technician
                </a>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-extrabold text-text-primary">Technician Not Assigned Yet</h4>
                <p className="text-[10px] text-text-secondary/70 font-semibold leading-relaxed">
                  Our dispatcher is assigning a technician to your request. Real-time details will update here automatically.
                </p>
              </div>
            )}
          </div>

          {/* Job Details Card */}
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Request Details
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider block">Service Category & Type</span>
                <span className="font-extrabold text-text-primary">{job.category} ({job.serviceType || 'Repair'})</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider block">Service Address</span>
                <span className="font-extrabold text-text-primary leading-relaxed block">{job.location}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider block">Scheduled Slot</span>
                <span className="font-extrabold text-text-primary flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-text-secondary/50 shrink-0" /> {job.scheduledDate}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
