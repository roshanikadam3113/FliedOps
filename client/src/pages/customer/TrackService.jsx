import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
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
  AlertCircle
} from 'lucide-react';

export default function TrackService() {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState(15);
  const [positionX, setPositionX] = useState(15); // Percentage for animation positioning
  const [positionY, setPositionY] = useState(80);

  // Fetch the selected job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobs = await getJobs();
        const selectedJobId = locationState.state?.jobId;
        
        // Find assigned or in-progress jobs
        let targetJob = null;
        if (selectedJobId) {
          targetJob = jobs.find(j => j._id === selectedJobId);
        }
        
        // If no specific job specified, fallback to the first active/assigned request
        if (!targetJob) {
          targetJob = jobs.find(j => ['assigned', 'in-progress'].includes(j.status));
        }

        setJob(targetJob);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [locationState.state]);

  // Simulate vehicle GPS movements & ETA countdown
  useEffect(() => {
    if (!job || job.status !== 'in-progress') return;

    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) return 1;
        return prev - 1;
      });

      // Animate coordinates towards home (destination: X=85, Y=25)
      setPositionX(prev => {
        if (prev >= 85) return 85;
        return prev + 5;
      });

      setPositionY(prev => {
        if (prev <= 25) return 25;
        return prev - 4;
      });

    }, 8000); // Update every 8s

    return () => clearInterval(interval);
  }, [job]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
        Initializing GPS Dispatch Console...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 font-sans text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
          <Navigation className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-black text-[#0F172A]">No Active Dispatches</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            There are currently no scheduled dispatches or technicians actively on their way to your location.
          </p>
        </div>
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Handle default technician values if backend user is null
  const tech = job.technician || {
    name: 'Rahul Sharma',
    phone: '+91 98123 45678',
    specialty: job.category || 'AC & HVAC',
    rating: 4.9,
    vehicleNo: 'MH-09-EX-7845'
  };

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A]">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Dispatch Tracker
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Live GPS Simulation Map */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden relative">
            
            {/* Map Header Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-white/10 max-w-xs sm:max-w-none">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center animate-pulse">
                <Navigation className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-orange-400 tracking-wider">Estimated Arrival</span>
                <div className="text-sm font-extrabold text-white">
                  {eta > 1 ? `${eta} mins away` : 'Arriving now!'}
                </div>
              </div>
            </div>

            {/* Premium Simulated CSS Map Container */}
            <div className="h-[400px] bg-[#E8ECEF] relative overflow-hidden flex items-center justify-center">
              
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
              
              {/* Map Routes / Road simulation curves */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Main routing road path */}
                <path 
                  d="M -50 420 Q 200 400 200 250 T 600 200 T 1000 80" 
                  fill="none" 
                  stroke="#94a3b8" 
                  strokeWidth="24" 
                  strokeLinecap="round"
                />
                <path 
                  d="M -50 420 Q 200 400 200 250 T 600 200 T 1000 80" 
                  fill="none" 
                  stroke="#cbd5e1" 
                  strokeWidth="16" 
                  strokeLinecap="round"
                />
                
                {/* Dynamic Route progress line */}
                <path 
                  d="M -50 420 Q 200 400 200 250 T 600 200 T 1000 80" 
                  fill="none" 
                  stroke="#F97316" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray="10 6"
                  className="animate-[dash_10s_linear_infinite]"
                  style={{
                    strokeDashoffset: -10
                  }}
                />
              </svg>

              {/* Destination Point: Customer Location */}
              <div 
                className="absolute flex flex-col items-center z-10 transition-all duration-300"
                style={{ left: '85%', top: '22%' }}
              >
                <div className="px-2.5 py-1 bg-[#0F172A] text-white text-[9px] font-bold rounded-md shadow-md border border-white/10 mb-1 shrink-0 whitespace-nowrap">
                  Home (My Location)
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/20 shadow-lg flex items-center justify-center text-white relative">
                  <MapPin className="w-4.5 h-4.5" />
                  <span className="absolute -inset-1 rounded-full border border-sky-400 animate-ping opacity-60" />
                </div>
              </div>

              {/* Moving Vehicle Point: Technician Van */}
              <div 
                className="absolute flex flex-col items-center z-10 transition-all duration-1000 ease-in-out"
                style={{ left: `${positionX}%`, top: `${positionY}%` }}
              >
                <div className="px-2 py-0.5 bg-[#F97316] text-white text-[8px] font-black uppercase rounded-md shadow-md mb-1 shrink-0 whitespace-nowrap">
                  {tech.name} (Tech)
                </div>
                <div className="w-9 h-9 rounded-full bg-[#F97316] border border-white/20 shadow-lg flex items-center justify-center text-white relative">
                  <Navigation className="w-4.5 h-4.5 rotate-45" />
                  <span className="absolute -inset-1.5 rounded-full border border-[#F97316] animate-ping opacity-50" />
                </div>
              </div>

              {/* Mock Neighborhood Landmarks */}
              <div className="absolute left-[35%] top-[15%] p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-200/50 shadow-2xs text-[9px] font-bold text-slate-400">
                Central Park Area
              </div>

              <div className="absolute left-[65%] top-[65%] p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-200/50 shadow-2xs text-[9px] font-bold text-slate-400">
                Metro Station Block
              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Technician Info Card & Job details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Technician Profile Card */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Assigned Professional
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl font-black text-[#F97316] shrink-0 shadow-2xs">
                {tech.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-[#0F172A]">{tech.name}</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-700">
                  ★ {tech.rating} Senior Tech
                </div>
                <div className="text-[10px] font-semibold text-slate-500">{tech.specialty} Specialist</div>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 py-3.5 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Contact Number</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {tech.phone}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Service Vehicle</span>
                <span className="font-bold text-[#0F172A] uppercase tracking-wider">{tech.vehicleNo || 'MH-09-EX-7845'}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${tech.phone}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center text-[#F97316] bg-orange-50 hover:bg-orange-100/50 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Technician
              </a>
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Request Details
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category</span>
                <span className="text-xs font-extrabold text-[#0F172A]">{job.category}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Address</span>
                <span className="text-xs font-extrabold text-[#0F172A] leading-relaxed block">{job.location}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled Slot</span>
                <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" /> {job.scheduledDate}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
