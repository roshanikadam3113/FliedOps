import React from 'react';
import { Save, Building, Shield, Bell, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Company Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Configure your organization parameters and operational rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold w-full text-left">
              <Building className="w-4 h-4" /> Company Info
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-[#64748B] hover:bg-gray-50 rounded-lg text-sm font-semibold w-full text-left transition-colors">
              <MapPin className="w-4 h-4" /> Regions & Zones
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-[#64748B] hover:bg-gray-50 rounded-lg text-sm font-semibold w-full text-left transition-colors">
              <Shield className="w-4 h-4" /> Security & Roles
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-[#64748B] hover:bg-gray-50 rounded-lg text-sm font-semibold w-full text-left transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
          </nav>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-bold text-[#0F172A]">Company Information</h2>
              <p className="text-xs text-[#64748B] mt-1">Update your company name, contact, and branding.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Company Name</label>
                    <input type="text" defaultValue="FieldOps Solutions Inc." className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Support Email</label>
                    <input type="email" defaultValue="support@fieldops.com" className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-[#334155]">Headquarters Address</label>
                    <input type="text" defaultValue="123 Dispatch Way, Suite 100, San Francisco, CA" className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Dispatch Rule (Auto-Assign)</label>
                    <select className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Manual Only</option>
                      <option>AI Recommended</option>
                      <option>Nearest Technician</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Default Currency</label>
                    <select className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
                  <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
