import React from 'react';
import { CreditCard, DollarSign, Download, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function AdminPayments() {
  const mockPayments = [
    { id: 'PAY-1001', customer: 'Alice Johnson', amount: 450.00, status: 'Completed', date: '2023-10-06T10:30:00Z', method: 'Credit Card (Stripe)' },
    { id: 'PAY-1002', customer: 'Bob Smith', amount: 120.50, status: 'Pending', date: '2023-10-07T08:15:00Z', method: 'Bank Transfer' },
    { id: 'PAY-1003', customer: 'Charlie Brown', amount: 890.00, status: 'Completed', date: '2023-10-05T14:20:00Z', method: 'Credit Card (Stripe)' },
    { id: 'PAY-1004', customer: 'Diana Prince', amount: 75.00, status: 'Failed', date: '2023-10-07T09:05:00Z', method: 'Credit Card (Stripe)' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Payments Reconciliation</h1>
          <p className="text-sm text-[#64748B] mt-1">Track payment statuses, webhooks, and transactions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] text-sm font-bold rounded-lg shadow-xs hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#64748B] mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Collected</span>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">$14,250.00</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% from last week
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#64748B] mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Pending Processing</span>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">$1,240.50</div>
          <div className="flex items-center gap-1 text-xs text-orange-600 mt-2 font-semibold">
            Awaiting bank confirmation
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#64748B] mb-2">
            <CreditCard className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Failed Transactions</span>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">$75.00</div>
          <div className="flex items-center gap-1 text-xs text-rose-600 mt-2 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" /> 1 action required
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
          <h2 className="text-sm font-bold text-[#0F172A]">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-semibold text-blue-600">{payment.id}</td>
                  <td className="p-4 text-[#334155] font-medium">{payment.customer}</td>
                  <td className="p-4 font-bold text-[#0F172A]">${payment.amount.toFixed(2)}</td>
                  <td className="p-4 text-[#64748B]">{new Date(payment.date).toLocaleString()}</td>
                  <td className="p-4 text-[#64748B]">{payment.method}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                      payment.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      payment.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
