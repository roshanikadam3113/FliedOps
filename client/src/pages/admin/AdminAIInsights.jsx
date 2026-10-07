import React, { useState, useEffect } from 'react';
import { getInventoryForecasts, getServiceInsights } from '../../services/aiService';
import { BrainCircuit, TrendingUp, AlertTriangle, Users, Settings, Activity } from 'lucide-react';

export default function AdminAIInsights() {
  const [forecasts, setForecasts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const [fData, iData] = await Promise.all([
          getInventoryForecasts(),
          getServiceInsights()
        ]);
        setForecasts(fData || []);
        setInsights(iData || null);
      } catch (error) {
        console.error("AI Service Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  const highRiskCount = forecasts.filter(f => f.riskLevel === 'HIGH').length;

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-text-secondary uppercase tracking-widest font-sans">
        <BrainCircuit className="w-8 h-8 mx-auto mb-3 animate-pulse text-sky-500" />
        Generating Operational Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-sky-500" /> AI & Operational Intelligence
          </h1>
          <p className="text-sm text-text-secondary font-medium mt-1">Data-driven forecasts and automated insights.</p>
        </div>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-primary p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:border-text-primary/20 transition-colors">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{highRiskCount}</div>
            <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">High Risk Stockouts</div>
          </div>
        </div>
        <div className="bg-surface-primary p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:border-text-primary/20 transition-colors">
          <div className="w-12 h-12 bg-surface-secondary text-text-secondary rounded-xl flex items-center justify-center shrink-0 border border-border-subtle">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{insights?.averageCompletionTimeHours || 0}h</div>
            <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Avg Service Duration</div>
          </div>
        </div>
        <div className="bg-surface-primary p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:border-text-primary/20 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{insights?.topCategories?.[0]?.category || 'N/A'}</div>
            <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Top Service Category</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Predictions & Stockout Risks */}
        <div className="bg-surface-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-border-subtle bg-surface-secondary/50">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-accent" /> Inventory Predictions
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            {forecasts.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-text-secondary">No inventory data available.</div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {forecasts.map(f => (
                  <div key={f.part._id} className="p-5 space-y-4 hover:bg-surface-secondary/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-text-primary">{f.part.name} <span className="text-xs font-mono text-text-secondary ml-1">({f.part.partNumber})</span></h4>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black uppercase tracking-widest text-text-secondary">
                          <span>Stock: {f.currentStock}</span>
                          <span>90d Usage: {f.historicalUsage}</span>
                          {f.predictedDemand !== null && (
                            <span className="text-brand-accent">30d Forecast: {f.predictedDemand}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                        f.riskLevel === 'HIGH' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        f.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        f.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}>
                        {f.riskLevel} RISK
                      </span>
                    </div>
                    <div className="bg-surface-secondary/50 border border-border-subtle p-3.5 rounded-lg text-xs font-medium leading-relaxed text-text-primary">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-1">AI Recommendation:</strong> 
                      {f.recommendation}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary flex justify-end items-center gap-1">
                      Confidence Score: <span className={f.confidence === 'HIGH' ? 'text-emerald-500' : f.confidence === 'MEDIUM' ? 'text-amber-500' : 'text-slate-400'}>{f.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Operational Insights */}
        <div className="bg-surface-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-border-subtle bg-surface-secondary/50">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-500" /> Operational Insights
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            <div>
              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 ml-1">Most Requested Service Categories</h4>
              <div className="space-y-2">
                {(insights?.topCategories || []).map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-text-primary bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                    <span>{cat.category}</span>
                    <span className="text-sky-600 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">{cat.count} Requests</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 ml-1">Frequently Used Parts</h4>
              <div className="space-y-2">
                {(insights?.topParts || []).map((part, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-text-primary bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                    <span>{part.partName}</span>
                    <span className="text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded">{part.totalUsed} Units Consumed</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 ml-1">Top Performing Technicians (By Workload)</h4>
              <div className="space-y-2">
                {(insights?.topTechnicians || []).map((tech, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-text-primary bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                    <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-text-secondary" /> {tech.name}</span>
                    <span className="text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{tech.completedJobs} Jobs Completed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
