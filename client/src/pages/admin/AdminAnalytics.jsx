import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, Download, TrendingUp, Users, CheckCircle, Clock, AlertTriangle, Package, Activity } from 'lucide-react';
import { 
  getAnalyticsOverview, 
  getOperationsAnalytics,
  getTechnicianAnalytics,
  getCustomerAnalytics,
  getFinanceAnalytics,
  getInventoryAnalytics
} from '../../services/analyticsService';
import { getServiceInsights } from '../../services/aiService';

const COLORS = ['#0284C7', '#F97316', '#10B981', '#F59E0B', '#EF4444', '#64748B'];
const STATUS_COLORS = {
  pending: '#F59E0B',
  assigned: '#0284C7',
  'in-progress': '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444'
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  
  const [overview, setOverview] = useState(null);
  const [operations, setOperations] = useState(null);
  const [technicians, setTechnicians] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [finance, setFinance] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        overviewData,
        operationsData,
        techData,
        customerData,
        financeData,
        inventoryData,
        aiData
      ] = await Promise.all([
        getAnalyticsOverview(dateRange),
        getOperationsAnalytics(dateRange),
        getTechnicianAnalytics(dateRange),
        getCustomerAnalytics(dateRange),
        getFinanceAnalytics(dateRange),
        getInventoryAnalytics(dateRange),
        getServiceInsights()
      ].map(p => p.catch(e => null))); // Catch individual errors to not fail entire page

      if (overviewData) setOverview(overviewData);
      if (operationsData) setOperations(operationsData);
      if (techData) setTechnicians(techData);
      if (customerData) setCustomers(customerData);
      if (financeData) setFinance(financeData);
      if (inventoryData) setInventory(inventoryData);
      
      // Filter ai insights to show a brief
      if (aiData) {
        setAiInsights(aiData.slice(0, 3));
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const handleExportCSV = () => {
    // A simple tabular export of technicians
    if (!technicians?.technicianMetrics) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Technician Name,Rating,Status,Active Jobs,Completed Jobs,Cancelled Jobs\n";
    
    technicians.technicianMetrics.forEach(row => {
      const rowString = `"${row.name}",${row.rating},${row.availabilityStatus},${row.activeJobs},${row.completedJobs},${row.cancelledJobs}`;
      csvContent += rowString + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Technician_Performance_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-text-secondary">Compiling analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-text-primary max-w-7xl mx-auto pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">Business Analytics</h1>
          <p className="text-sm font-semibold text-text-secondary">
            Data-driven insights from live FieldOps operational data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-primary border border-border-subtle rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-surface-primary border border-border-subtle text-text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Requests" value={overview?.totalRequests || 0} icon={Activity} color="text-text-secondary" />
        <MetricCard title="Completed Jobs" value={overview?.completedJobs || 0} icon={CheckCircle} color="text-emerald-500" />
        <MetricCard title="Active Jobs" value={overview?.activeJobs || 0} icon={Clock} color="text-sky-500" />
        <MetricCard title="Total Paid" value={`₹${overview?.totalPaid?.toLocaleString() || 0}`} icon={TrendingUp} color="text-brand-accent" />
        <MetricCard title="Pending Amount" value={`₹${overview?.totalPending?.toLocaleString() || 0}`} icon={AlertTriangle} color="text-rose-500" />
        <MetricCard title="Avg Rating" value={overview?.avgRating ? `${overview.avgRating} / 5` : 'N/A'} icon={Users} color="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OPERATIONS: REQUESTS OVER TIME */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-black text-text-primary mb-4 uppercase tracking-widest">Requests Over Time</h2>
          {operations?.requestsOverTime?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={operations.requestsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" tick={{fontSize: 10, fill: 'var(--color-text-secondary)'}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10, fill: 'var(--color-text-secondary)'}} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-primary)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }} />
                  <Line type="monotone" dataKey="count" stroke="#0284C7" strokeWidth={3} dot={{r: 3, fill: '#0284C7', strokeWidth: 2}} activeDot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No request data available for this period." />
          )}
        </div>

        {/* OPERATIONS: REQUESTS BY STATUS */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-black text-text-primary mb-4 uppercase tracking-widest">Requests by Status</h2>
          {operations?.requestsByStatus?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operations.requestsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {operations.requestsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-primary)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }} formatter={(value, name) => [value, name.toUpperCase()]} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No status distribution available." />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SERVICE DEMAND */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-black text-text-primary mb-4 uppercase tracking-widest">Service Demand</h2>
          {operations?.requestsByCategory?.length > 0 ? (
            <div className="space-y-3">
              {operations.requestsByCategory.map((cat, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border-subtle pb-2 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-text-secondary">{cat.category}</span>
                  <span className="text-xs font-black bg-surface-secondary text-text-primary border border-border-subtle px-2 py-0.5 rounded-md">{cat.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No categories requested." />
          )}
        </div>

        {/* FINANCE: PAYMENT TREND */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-black text-text-primary mb-4 uppercase tracking-widest">Revenue Trend (Paid)</h2>
          {finance?.paymentTrend?.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finance.paymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" tick={{fontSize: 10, fill: 'var(--color-text-secondary)'}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10, fill: 'var(--color-text-secondary)'}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-primary)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }} formatter={(value) => `₹${value}`} cursor={{fill: 'var(--color-surface-secondary)', opacity: 0.4}} />
                  <Bar dataKey="amount" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No revenue recorded for this period." />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TECHNICIAN WORKLOAD */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm overflow-hidden flex flex-col h-full">
          <h2 className="text-sm font-black text-text-primary mb-4 uppercase tracking-widest">Technician Workload</h2>
          {technicians?.technicianMetrics?.length > 0 ? (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[10px] uppercase font-black text-text-secondary">
                    <th className="pb-2">Technician</th>
                    <th className="pb-2 text-center">Active Jobs</th>
                    <th className="pb-2 text-center">Completed</th>
                    <th className="pb-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-text-primary">
                  {technicians.technicianMetrics.map(tech => (
                    <tr key={tech._id} className="border-b border-border-subtle last:border-0 hover:bg-surface-secondary/50">
                      <td className="py-2.5 font-bold">{tech.name}</td>
                      <td className="py-2.5 text-center">
                        <span className="bg-sky-500/10 text-sky-600 border border-sky-500/20 px-2.5 py-0.5 rounded-md font-black">{tech.activeJobs}</span>
                      </td>
                      <td className="py-2.5 text-emerald-500 font-black text-center">{tech.completedJobs}</td>
                      <td className="py-2.5 text-amber-500 font-bold text-right">{tech.rating} ★</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No technician activity." />
          )}
        </div>

        {/* INVENTORY INSIGHTS */}
        <div className="bg-surface-primary border border-border-subtle rounded-xl p-5 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">Inventory Analytics</h2>
            <div className="text-[10px] font-black text-text-secondary bg-surface-secondary border border-border-subtle px-2 py-1 rounded-md uppercase tracking-wider">
              Est. Value: ₹{(inventory?.currentInventoryValue || 0).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Most Consumed Parts</h3>
              {inventory?.mostConsumedParts?.length > 0 ? (
                <div className="space-y-2">
                  {inventory.mostConsumedParts.map((part, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-surface-secondary/50 p-2 rounded-lg border border-border-subtle">
                      <span className="font-bold text-text-primary">{part.name}</span>
                      <span className="font-semibold text-text-secondary">Qty: {part.quantity} <span className="opacity-70">(used in {part.jobs} jobs)</span></span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No parts consumed." minimal />
              )}
            </div>
            
            <div className="pt-4 border-t border-border-subtle">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3">Stock Alerts</h3>
              <div className="flex gap-3">
                <div className="flex-1 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-center shadow-sm">
                  <div className="text-xl font-black text-rose-600">{inventory?.outOfStockParts?.length || 0}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-rose-600 mt-1">Out of Stock</div>
                </div>
                <div className="flex-1 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center shadow-sm">
                  <div className="text-xl font-black text-amber-500">{inventory?.lowStockParts?.length || 0}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-amber-500 mt-1">Low Stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-surface-primary border border-border-subtle p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-text-primary/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[9px] font-black text-text-secondary uppercase tracking-widest leading-tight">{title}</h3>
        <Icon className={`w-5 h-5 ${color} opacity-80`} />
      </div>
      <div className="text-xl md:text-2xl font-black text-text-primary tracking-tight">{value}</div>
    </div>
  );
}

function EmptyState({ message, minimal = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${minimal ? 'py-4' : 'py-12'}`}>
      {!minimal && <Package className="w-10 h-10 text-text-secondary opacity-20 mb-3" />}
      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{message}</p>
    </div>
  );
}
