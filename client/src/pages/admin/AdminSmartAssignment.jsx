import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { getTechnicianRecommendations } from '../../services/aiService';
import { Brain, Search, Users, Activity, CheckCircle, Target, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSmartAssignment() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const data = await apiRequest('/admin/requests?status=pending&assigned=false', { method: 'GET' });
      if (data && data.success) {
        setPendingRequests(data.requests);
      }
    } catch (error) {
      toast.error('Failed to load pending requests');
    }
  };

  const handleSelectRequest = async (request) => {
    setSelectedRequest(request);
    setLoading(true);
    setRecommendations([]);
    try {
      const data = await getTechnicianRecommendations(request._id);
      setRecommendations(data);
    } catch (error) {
      toast.error('Failed to get AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (technicianId) => {
    try {
      await apiRequest(`/admin/jobs/${selectedRequest._id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ technicianId })
      });
      toast.success('Job assigned successfully via Smart AI!');
      setPendingRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
      setSelectedRequest(null);
      setRecommendations([]);
    } catch (error) {
      toast.error('Failed to assign job');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          Smart Assignment AI
        </h1>
        <p className="text-sm text-[#64748B] mt-1">Leverage AI to automatically recommend the best technicians based on proximity, workload, and skills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pending Requests */}
        <div className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col h-[600px]">
          <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Unassigned Requests
            </h2>
          </div>
          <div className="p-4 border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {pendingRequests.length === 0 ? (
              <div className="text-center text-sm text-[#64748B] p-4">No pending requests found.</div>
            ) : (
              pendingRequests.map(req => (
                <div 
                  key={req._id}
                  onClick={() => handleSelectRequest(req)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRequest?._id === req._id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-indigo-600 truncate">{req.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{req.urgency}</span>
                  </div>
                  <div className="text-xs text-[#64748B] truncate">{req.category} • {req.location}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Insights & Recommendations */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col h-[600px]">
          {selectedRequest ? (
            <>
              <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-r from-indigo-50 to-white">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-1">Evaluating: {selectedRequest.title}</h2>
                <div className="flex gap-4 text-xs font-semibold text-[#64748B]">
                  <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-indigo-500" /> Category: {selectedRequest.category}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-500" /> Customer: {selectedRequest.customer?.name}</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="text-sm font-bold text-indigo-600 animate-pulse">Running AI assignment heuristics...</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#0F172A] mb-4">Top AI Recommendations</h3>
                    {recommendations.length === 0 ? (
                      <div className="text-center text-sm text-[#64748B] p-4 bg-white rounded-lg border">No recommendations available.</div>
                    ) : (
                      recommendations.map((rec, idx) => (
                        <div key={rec.technician._id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden">
                          {idx === 0 && <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">Best Match</div>}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                {rec.matchScore}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-[#0F172A]">{rec.technician.name}</h4>
                                <p className="text-xs font-semibold text-[#64748B] mt-0.5">{rec.technician.specialty}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAssign(rec.technician._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              Assign <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-start gap-2 text-xs text-[#334155] bg-green-50 p-2.5 rounded-lg border border-green-100">
                              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block mb-0.5">AI Reasoning</span>
                                {rec.reason}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#64748B]">
              <Brain className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">No Request Selected</h3>
              <p className="text-sm max-w-sm">Select a pending service request from the left panel to generate AI-driven technician recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
