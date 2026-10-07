import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOverview } from '../../services/adminService';
import { 
  Users, 
  Wrench, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Receipt,
  AlertCircle,
  Briefcase,
  Package,
  CalendarClock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
  <div className={`bg-surface-primary p-5 rounded-xl border ${borderClass || 'border-border-subtle'} shadow-sm flex items-center justify-between`}>
    <div>
      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-extrabold text-text-primary">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-surface-secondary border border-border-subtle shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6 stroke-[2]" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await getAdminOverview();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl font-bold text-sm">
        {error}
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 pb-12 font-sans antialiased text-text-primary">
      
      {/* Header */}
      <div className="bg-surface-primary rounded-xl p-6 shadow-sm border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Central Operations
          </h1>
          <p className="text-sm font-bold text-text-secondary">
            {currentDate} • Welcome back, {user?.name || 'Administrator'}
          </p>
        </div>
      </div>

      {/* Operational KPIs Grid */}
      <div>
        <h2 className="text-sm font-black uppercase text-text-secondary tracking-widest mb-4 ml-1">Live Operational KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard 
            title="Pending Reqs" 
            value={stats.pendingRequests} 
            icon={FileText} 
            colorClass="text-brand-accent" 
          />
          <StatCard 
            title="Active Jobs" 
            value={stats.activeJobs} 
            icon={Activity} 
            colorClass="text-sky-500" 
          />
          <StatCard 
            title="Available Techs" 
            value={stats.totalTechnicians} 
            icon={Wrench} 
            colorClass="text-indigo-500" 
          />
          <StatCard 
            title="Completed Today" 
            value={stats.completedJobs} 
            icon={CheckCircle2} 
            colorClass="text-brand-success" 
          />
          <StatCard 
            title="Pending Inv" 
            value={stats.pendingInvoices} 
            icon={Receipt} 
            colorClass="text-amber-500" 
          />
          <StatCard 
            title="Low Stock" 
            value={stats.lowStockItems} 
            icon={Package} 
            colorClass={stats.lowStockItems > 0 ? "text-rose-500" : "text-emerald-500"}
            borderClass={stats.lowStockItems > 0 ? "border-rose-500/30" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Attention Required & Live Operations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Attention Required */}
          <div className="bg-surface-primary border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-border-subtle bg-surface-secondary/50">
              <h2 className="text-sm font-black uppercase text-text-secondary tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Attention Required
              </h2>
            </div>
            <div className="p-5 flex-1 space-y-3">
              {stats.unassignedRequests > 0 ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">Unassigned Requests</h4>
                    <p className="text-xs font-semibold text-amber-700/80 dark:text-amber-500/80 mt-0.5">{stats.unassignedRequests} requests awaiting dispatch</p>
                  </div>
                  <Link to="/admin/dispatch" className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-amber-600 transition-colors">
                    Dispatch
                  </Link>
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  No unassigned requests. All tasks are dispatched.
                </div>
              )}

              {stats.lowStockItems > 0 ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">Low Stock Alert</h4>
                    <p className="text-xs font-semibold text-rose-700/80 dark:text-rose-500/80 mt-0.5">{stats.lowStockItems} inventory items running low</p>
                  </div>
                  <Link to="/admin/inventory" className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-600 transition-colors">
                    View Stock
                  </Link>
                </div>
              ) : null}

              {stats.pendingInvoices > 0 ? (
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-sky-700 dark:text-sky-400">Pending Invoices</h4>
                    <p className="text-xs font-semibold text-sky-700/80 dark:text-sky-500/80 mt-0.5">{stats.pendingInvoices} invoices await customer payment</p>
                  </div>
                  <Link to="/admin/invoices" className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-sky-600 transition-colors">
                    View Billing
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="lg:col-span-4">
          <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-text-secondary tracking-widest pl-1 mb-2">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <Link to="/admin/dispatch" className="group flex items-center justify-between p-3.5 bg-surface-primary border border-border-subtle hover:border-brand-accent/50 rounded-lg text-left transition-all hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-surface-secondary border border-border-subtle flex items-center justify-center text-text-secondary group-hover:text-brand-accent transition-colors">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">Dispatch Center</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-brand-accent transition-colors" />
              </Link>

              <Link to="/admin/requests" className="group flex items-center justify-between p-3.5 bg-surface-primary border border-border-subtle hover:border-brand-accent/50 rounded-lg text-left transition-all hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-surface-secondary border border-border-subtle flex items-center justify-center text-text-secondary group-hover:text-brand-accent transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">View Requests</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-brand-accent transition-colors" />
              </Link>
              
              <Link to="/admin/technicians" className="group flex items-center justify-between p-3.5 bg-surface-primary border border-border-subtle hover:border-brand-accent/50 rounded-lg text-left transition-all hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-surface-secondary border border-border-subtle flex items-center justify-center text-text-secondary group-hover:text-brand-accent transition-colors">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">Manage Technicians</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-brand-accent transition-colors" />
              </Link>
              
              <Link to="/admin/inventory" className="group flex items-center justify-between p-3.5 bg-surface-primary border border-border-subtle hover:border-brand-accent/50 rounded-lg text-left transition-all hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-surface-secondary border border-border-subtle flex items-center justify-center text-text-secondary group-hover:text-brand-accent transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-text-primary">Inventory</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary/50 group-hover:text-brand-accent transition-colors" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
