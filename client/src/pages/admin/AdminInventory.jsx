import React, { useState, useEffect } from 'react';
import { getInventory, createPart, adjustStock, getTransactions } from '../../services/inventoryService';
import { getInventoryForecasts } from '../../services/aiService';
import { 
  Package, PlusCircle, Search, AlertTriangle, CheckCircle2, History, X, 
  ArrowRightLeft, BrainCircuit
} from 'lucide-react';

export default function AdminInventory() {
  const [parts, setParts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [aiForecast, setAiForecast] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const [newPart, setNewPart] = useState({ name: '', partNumber: '', description: '', category: '', unitPrice: '', initialStock: '', minimumStock: '', unit: 'pcs' });
  const [adjustData, setAdjustData] = useState({ adjustment: '', reason: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getInventory({ status: filter, search });
      setParts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createPart({
        ...newPart,
        unitPrice: Number(newPart.unitPrice),
        initialStock: Number(newPart.initialStock || 0),
        minimumStock: Number(newPart.minimumStock || 0)
      });
      setShowAddModal(false);
      setNewPart({ name: '', partNumber: '', description: '', category: '', unitPrice: '', initialStock: '', minimumStock: '', unit: 'pcs' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      await adjustStock(selectedPart._id, Number(adjustData.adjustment), adjustData.reason);
      setShowAdjustModal(false);
      setAdjustData({ adjustment: '', reason: '' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openTransactions = async (part) => {
    setSelectedPart(part);
    setShowTransactionsModal(true);
    try {
      const tx = await getTransactions(part._id);
      setTransactions(tx || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openAiForecast = async (part) => {
    setSelectedPart(part);
    setShowAiModal(true);
    setLoadingAi(true);
    try {
      const forecasts = await getInventoryForecasts();
      const partForecast = forecasts.find(f => f.part._id === part._id);
      setAiForecast(partForecast || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Inventory Management</h1>
          <p className="text-sm text-text-secondary font-medium mt-1">Manage parts, stock levels, and historical transactions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-text-primary hover:bg-text-secondary text-page-bg text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add Part
        </button>
      </div>

      <div className="bg-surface-primary border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search parts by name or part number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-surface-secondary rounded-lg p-1 border border-border-subtle shrink-0">
          {['all', 'in-stock', 'low-stock', 'out-of-stock', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f ? 'bg-text-primary text-page-bg shadow-sm' : 'text-text-secondary hover:bg-surface-primary'
              }`}
            >
              {f.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-surface-secondary/50">
              <tr className="border-b border-border-subtle text-[10px] font-black text-text-secondary uppercase tracking-widest">
                <th className="px-6 py-3">Part No.</th>
                <th className="px-6 py-3">Name & Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary font-bold">No parts found matching criteria.</td>
                </tr>
              ) : (
                parts.map(part => {
                  const isLow = part.stockQuantity > 0 && part.stockQuantity <= part.minimumStock;
                  const isOut = part.stockQuantity === 0;
                  
                  return (
                    <tr key={part._id} className={`hover:bg-surface-secondary/30 transition-colors ${!part.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 font-bold text-text-secondary font-mono text-xs">
                        {part.partNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-text-primary">{part.name}</div>
                        <div className="text-xs text-text-secondary">{part.category}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-text-primary">
                        ₹{part.unitPrice} <span className="text-[10px] text-text-secondary font-medium">/{part.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-black text-lg ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-500' : 'text-text-primary'
                        }`}>
                          {part.stockQuantity}
                        </div>
                        <div className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                          Min: {part.minimumStock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {!part.isActive ? (
                          <span className="px-2.5 py-1 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded text-[9px] font-black uppercase tracking-wider">Inactive</span>
                        ) : isOut ? (
                          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedPart(part); setShowAdjustModal(true); }}
                            disabled={!part.isActive}
                            className={`p-1.5 rounded-md transition-colors ${part.isActive ? 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 cursor-pointer' : 'bg-surface-secondary text-text-secondary cursor-not-allowed'}`}
                            title="Adjust Stock"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openTransactions(part)}
                            className="p-1.5 bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80 rounded-md transition-colors cursor-pointer"
                            title="View History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAiForecast(part)}
                            className="p-1.5 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 rounded-md transition-colors cursor-pointer"
                            title="View AI Forecast"
                          >
                            <BrainCircuit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <Package className="w-5 h-5 text-brand-accent" /> Add New Part
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-secondary hover:bg-surface-secondary p-1.5 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Part Name</label>
                  <input required type="text" value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Part No.</label>
                  <input required type="text" value={newPart.partNumber} onChange={e => setNewPart({...newPart, partNumber: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Category</label>
                  <input required type="text" value={newPart.category} onChange={e => setNewPart({...newPart, category: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Unit Price (₹)</label>
                  <input required type="number" min="0" step="0.01" value={newPart.unitPrice} onChange={e => setNewPart({...newPart, unitPrice: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                  <input type="text" placeholder="pcs" value={newPart.unit} onChange={e => setNewPart({...newPart, unit: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Initial Stock</label>
                  <input type="number" min="0" value={newPart.initialStock} onChange={e => setNewPart({...newPart, initialStock: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Min Stock</label>
                  <input type="number" min="0" value={newPart.minimumStock} onChange={e => setNewPart({...newPart, minimumStock: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-brand-accent text-white text-sm font-bold rounded-lg shadow-sm hover:bg-orange-600 transition-colors"
                >
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedPart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-xl w-full max-w-sm shadow-2xl overflow-hidden border border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <ArrowRightLeft className="w-5 h-5 text-sky-500" /> Adjust Stock
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-text-secondary hover:bg-surface-secondary p-1.5 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdjust} className="p-6 space-y-4">
              <div className="text-center p-4 bg-surface-secondary/50 rounded-xl mb-4 border border-border-subtle">
                <div className="text-xs text-text-secondary font-bold">{selectedPart.name} ({selectedPart.partNumber})</div>
                <div className="text-2xl font-black text-text-primary mt-1">{selectedPart.stockQuantity}</div>
                <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Current Stock</div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Adjustment Amount (+/-)</label>
                <input required type="number" placeholder="e.g. 5 or -2" value={adjustData.adjustment} onChange={e => setAdjustData({...adjustData, adjustment: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-text-primary font-mono" />
                <p className="text-[10px] text-text-secondary mt-1.5 ml-1 font-medium">Use positive to add, negative to remove.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Reason (Optional)</label>
                <input type="text" placeholder="e.g. Restock from supplier" value={adjustData.reason} onChange={e => setAdjustData({...adjustData, reason: e.target.value})} className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-text-primary" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-sky-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {showTransactionsModal && selectedPart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-border-subtle">
            <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight">Transaction History</h3>
                <p className="text-xs text-text-secondary font-semibold mt-0.5">{selectedPart.name} ({selectedPart.partNumber})</p>
              </div>
              <button onClick={() => setShowTransactionsModal(false)} className="text-text-secondary hover:bg-surface-secondary p-1.5 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-0 flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-secondary/80 border-b border-border-subtle backdrop-blur-sm z-10">
                  <tr className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                    <th className="p-4">Date</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Qty</th>
                    <th className="p-4">Balance</th>
                    <th className="p-4">Reason / Job</th>
                    <th className="p-4">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {transactions.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-text-secondary font-bold text-sm">No transactions found.</td></tr>
                  ) : (
                    transactions.map(tx => (
                      <tr key={tx._id} className="hover:bg-surface-secondary/30">
                        <td className="p-4 text-xs font-semibold text-text-secondary whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                            tx.type === 'STOCK_IN' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            tx.type === 'STOCK_OUT' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-sky-500/10 text-sky-600 border-sky-500/20'
                          }`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={`p-4 text-right font-black ${
                          tx.type === 'STOCK_IN' ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {tx.type === 'STOCK_IN' ? '+' : '-'}{tx.quantity}
                        </td>
                        <td className="p-4 text-xs text-text-secondary font-mono">
                          {tx.previousStock} → <span className="font-bold text-text-primary">{tx.newStock}</span>
                        </td>
                        <td className="p-4 text-xs font-bold text-text-primary">
                          {tx.job ? (
                            <span className="text-brand-accent">Job: {tx.job.title}</span>
                          ) : (
                            <span className="text-text-secondary font-medium">{tx.reason || 'N/A'}</span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-bold text-text-secondary">
                          {tx.performedBy?.name || 'Unknown'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end">
              <button onClick={() => setShowTransactionsModal(false)} className="px-5 py-2 bg-text-primary text-page-bg hover:bg-text-secondary text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Forecast Modal */}
      {showAiModal && selectedPart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-primary rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/30">
              <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
                 <BrainCircuit className="w-5 h-5 text-sky-500" /> AI Forecast
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-text-secondary hover:bg-surface-secondary p-1.5 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <BrainCircuit className="w-8 h-8 text-sky-500 animate-pulse" />
                  <p className="text-xs font-bold text-text-secondary">Analyzing historical consumption...</p>
                </div>
              ) : !aiForecast ? (
                <div className="text-center py-8">
                  <p className="text-sm font-bold text-text-secondary">No AI forecast generated for this part.</p>
                </div>
              ) : (
                <div className="space-y-6 text-text-primary">
                  <div className="text-center pb-2">
                    <h4 className="font-black text-lg">{aiForecast.part.name}</h4>
                    <p className="text-xs text-text-secondary font-bold">{aiForecast.part.partNumber}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                    <div className="bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle">
                      <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">Current Stock</div>
                      <div className="text-xl font-black">{aiForecast.currentStock}</div>
                    </div>
                    <div className="bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle">
                      <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">90d Usage</div>
                      <div className="text-xl font-black">{aiForecast.historicalUsage}</div>
                    </div>
                    <div className="bg-sky-500/10 p-4 rounded-xl border border-sky-500/20 col-span-2 flex justify-between items-center">
                      <div className="text-[10px] text-sky-600 font-black uppercase tracking-widest">Predicted 30d Demand</div>
                      <div className="text-2xl font-black text-sky-600">{aiForecast.predictedDemand !== null ? aiForecast.predictedDemand : 'N/A'}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center bg-surface-secondary/30 p-3 rounded-lg border border-border-subtle">
                      <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Stockout Risk</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        aiForecast.riskLevel === 'HIGH' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        aiForecast.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        aiForecast.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}>
                        {aiForecast.riskLevel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-surface-secondary/30 p-3 rounded-lg border border-border-subtle">
                      <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Confidence Score</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        aiForecast.confidence === 'HIGH' ? 'text-emerald-500' :
                        aiForecast.confidence === 'MEDIUM' ? 'text-amber-500' :
                        'text-text-secondary'
                      }`}>
                        {aiForecast.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-secondary/80 border border-border-subtle rounded-xl">
                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-2">Recommendation</div>
                    <p className="text-xs font-medium leading-relaxed text-text-primary">
                      {aiForecast.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-secondary/30 flex justify-end">
              <button onClick={() => setShowAiModal(false)} className="px-5 py-2 bg-text-primary hover:bg-text-secondary text-page-bg text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
