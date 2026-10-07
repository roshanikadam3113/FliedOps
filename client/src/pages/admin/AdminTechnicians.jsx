import React, { useState, useEffect } from 'react';
import { getAdminTechnicians, createTechnician, updateTechnicianStatus } from '../../services/adminService';
import { Plus, X, AlertCircle } from 'lucide-react';

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [newTech, setNewTech] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: 'General Maintenance'
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const data = await getAdminTechnicians();
      if (data.success) {
        setTechnicians(data.technicians);
      }
    } catch (err) {
      setError('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTechnician = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const data = await createTechnician(newTech);
      if (data.success) {
        setShowModal(false);
        setNewTech({ name: '', email: '', password: '', phone: '', specialty: 'General Maintenance' });
        fetchTechnicians(); // refresh list
      }
    } catch (err) {
      alert(err.message || 'Failed to create technician');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (tech) => {
    if (tech.isActive && tech.activeJobCount > 0) {
      alert(`Cannot deactivate: Technician ${tech.name} has ${tech.activeJobCount} active job(s). Please reassign or complete them first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to ${tech.isActive ? 'deactivate' : 'activate'} ${tech.name}?`)) return;
    
    try {
      await updateTechnicianStatus(tech._id, { isActive: !tech.isActive });
      fetchTechnicians();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Technicians</h1>
          <p className="text-sm font-medium text-text-secondary mt-1">Manage field technicians and availability.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-text-primary text-page-bg text-sm font-bold rounded-lg shadow-sm hover:bg-text-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Technician
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-600 p-4 rounded-xl font-bold border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-subtle">
            <thead className="bg-surface-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Technician</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Contact</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Availability</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Active Jobs</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent mx-auto"></div>
                  </td>
                </tr>
              ) : technicians.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary font-bold">
                    No technicians found.
                  </td>
                </tr>
              ) : (
                technicians.map(tech => (
                  <tr key={tech._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">{tech.name}</div>
                      <div className="text-xs text-text-secondary">{tech.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">{tech.email}</div>
                      <div className="text-xs text-text-secondary">{tech.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                        tech.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        tech.availabilityStatus === 'BUSY' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}>
                        {tech.availabilityStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`text-sm font-black ${tech.activeJobCount > 0 ? 'text-brand-accent' : 'text-text-secondary'}`}>
                         {tech.activeJobCount || 0}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                        tech.isActive ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                        {tech.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleStatus(tech)}
                        className={`text-xs font-bold transition-colors ${tech.isActive ? 'text-rose-500 hover:text-rose-700' : 'text-emerald-500 hover:text-emerald-700'}`}
                      >
                        {tech.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Technician Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border-subtle">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface-secondary/30">
              <h2 className="text-lg font-black text-text-primary tracking-tight">Add Technician</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTechnician} className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2 text-amber-700 dark:text-amber-400 mb-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-xs font-medium">New technicians will be automatically granted the 'Technician' role upon creation.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newTech.name}
                  onChange={e => setNewTech({...newTech, name: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={newTech.email}
                  onChange={e => setNewTech({...newTech, email: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Temporary Password</label>
                <input 
                  type="password" 
                  required
                  value={newTech.password}
                  onChange={e => setNewTech({...newTech, password: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                <input 
                  type="text" 
                  value={newTech.phone}
                  onChange={e => setNewTech({...newTech, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Specialty</label>
                <select 
                  value={newTech.specialty}
                  onChange={e => setNewTech({...newTech, specialty: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none text-text-primary font-bold"
                >
                  <option value="General Maintenance">General Maintenance</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createLoading}
                  className="px-5 py-2 bg-brand-accent text-white text-sm font-bold rounded-lg shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-70"
                >
                  {createLoading ? 'Creating...' : 'Create Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
