import React, { useState, useEffect } from 'react';
import { getAdminRequests, getAdminTechnicians, assignJob } from '../../services/adminService';
import { getTechnicianRecommendations } from '../../services/aiService';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function AdminDispatch() {
  const location = useLocation();
  const preselectRequestId = location.state?.preselectRequest;

  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assigning, setAssigning] = useState(false);
  
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch unassigned or pending requests
      const reqRes = await getAdminRequests({ status: 'pending', assigned: 'false' });
      // Fetch active technicians
      const techRes = await getAdminTechnicians();
      
      if (reqRes.success) {
        setRequests(reqRes.requests);
        if (preselectRequestId) {
          const preselected = reqRes.requests.find(r => r._id === preselectRequestId);
          if (preselected) {
            setSelectedRequest(preselected);
          }
        }
      }
      
      if (techRes.success) {
        // Filter only active and available technicians
        const available = techRes.technicians.filter(t => t.isActive && t.availabilityStatus === 'AVAILABLE');
        setTechnicians(available);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRequest) {
      fetchRecommendations(selectedRequest._id);
    } else {
      setAiRecommendations([]);
    }
  }, [selectedRequest]);

  const fetchRecommendations = async (reqId) => {
    try {
      setLoadingAi(true);
      const recs = await getTechnicianRecommendations(reqId);
      setAiRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch AI recommendations', err);
      // Fallback: AI failed, core FieldOps continues working
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAssign = async (technicianId) => {
    if (!selectedRequest) return;
    try {
      setAssigning(true);
      const res = await assignJob(selectedRequest._id, technicianId);
      if (res.success) {
        // Remove from list and clear selection
        setRequests(requests.filter(r => r._id !== selectedRequest._id));
        setSelectedRequest(null);
        // We could also re-fetch technicians to update their active job count
        const techRes = await getAdminTechnicians();
        if (techRes.success) {
          setTechnicians(techRes.technicians.filter(t => t.isActive && t.availabilityStatus === 'AVAILABLE'));
        }
      }
    } catch (err) {
      alert('Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 h-[calc(100vh-100px)] flex flex-col font-sans text-text-primary">
      <div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight">Dispatch Center</h1>
        <p className="text-sm font-medium text-text-secondary mt-1">Assign unassigned service requests to available technicians.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Unassigned Requests */}
        <div className="w-full lg:w-[45%] flex flex-col bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-surface-secondary/50">
            <h2 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Unassigned Requests ({requests.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center p-12 text-text-secondary font-bold border-2 border-dashed border-border-subtle rounded-xl">
                No pending unassigned requests.
              </div>
            ) : (
              requests.map(req => (
                <div 
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRequest?._id === req._id 
                      ? 'border-brand-accent bg-brand-accent/5 shadow-sm' 
                      : 'border-border-subtle hover:border-text-primary/20 hover:bg-surface-secondary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text-primary">{req.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-surface-secondary text-text-secondary border border-border-subtle">
                      {req.urgency}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-text-secondary mb-2 line-clamp-2">{req.description}</div>
                  <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <span className="truncate max-w-[60%]">{req.location}</span>
                    <span>{new Date(req.scheduledDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Available Technicians (Only shown when request selected) */}
        <div className="w-full lg:w-[55%] flex flex-col bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-surface-secondary/50">
            <h2 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Available Technicians</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-page-bg">
            {!selectedRequest ? (
              <div className="h-full flex items-center justify-center text-center p-12 text-text-secondary font-bold">
                Select a service request from the left <br/> to assign a technician.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-surface-primary p-4 rounded-xl border border-border-subtle shadow-sm">
                  <h3 className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2">Assigning Request:</h3>
                  <div className="font-bold text-text-primary">{selectedRequest.title}</div>
                  <div className="text-sm text-text-secondary font-medium">{selectedRequest.customer?.name} - {selectedRequest.location}</div>
                </div>

                <div className="space-y-3">
                  {loadingAi ? (
                    <div className="text-center p-8 text-sky-600 font-bold bg-sky-500/10 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center">
                      <BrainCircuit className="w-8 h-8 animate-pulse mb-2" />
                      AI is calculating optimal assignments...
                    </div>
                  ) : aiRecommendations.length > 0 ? (
                    <div>
                      <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-1.5 ml-1">
                        <BrainCircuit className="w-3.5 h-3.5" /> AI Recommendations
                      </h3>
                      <div className="space-y-3">
                        {aiRecommendations.map((rec, index) => (
                          <div key={rec.technician._id} className={`flex flex-col p-4 border rounded-xl transition-colors bg-surface-primary shadow-sm ${index === 0 ? 'border-sky-500/50 shadow-[inset_4px_0_0_0_rgba(14,165,233,1)]' : 'border-border-subtle hover:border-text-primary/20'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-bold text-text-primary flex items-center gap-2">
                                  {rec.technician.name}
                                  {index === 0 && <span className="bg-sky-500/10 border border-sky-500/20 text-sky-600 text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider">Top Match</span>}
                                </div>
                                <div className="text-xs font-medium text-text-secondary mt-0.5">{rec.technician.specialty} • {rec.activeJobs} Active Jobs</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-lg font-black text-sky-600">{rec.matchScore}%</div>
                                  <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Match</div>
                                </div>
                                <button
                                  onClick={() => handleAssign(rec.technician._id)}
                                  disabled={assigning}
                                  className="px-5 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-lg shadow-sm hover:bg-orange-600 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                  {assigning ? 'Assigning...' : 'Assign'}
                                </button>
                              </div>
                            </div>
                            <div className="text-[11px] text-text-secondary font-medium bg-surface-secondary/50 p-2.5 rounded border border-border-subtle">
                              <span className="text-sky-600 font-bold uppercase tracking-wider mr-1.5 text-[9px]">Reason:</span> 
                              {rec.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : technicians.length === 0 ? (
                    <div className="text-center p-8 text-rose-600 font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      No technicians are currently available!
                    </div>
                  ) : (
                    <div>
                       <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 ml-1">
                          Available Technicians
                       </h3>
                      <div className="space-y-3">
                        {technicians.map(tech => (
                          <div key={tech._id} className="flex items-center justify-between p-4 border border-border-subtle bg-surface-primary shadow-sm rounded-xl hover:border-text-primary/20 transition-colors">
                            <div>
                              <div className="font-bold text-text-primary">{tech.name}</div>
                              <div className="text-xs font-medium text-text-secondary">{tech.specialty} • {tech.activeJobCount} Active Jobs</div>
                            </div>
                            <button
                              onClick={() => handleAssign(tech._id)}
                              disabled={assigning}
                              className="px-5 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-lg shadow-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                              {assigning ? 'Assigning...' : 'Assign'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
