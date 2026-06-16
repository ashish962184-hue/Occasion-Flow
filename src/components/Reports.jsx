import React from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function Reports({ reportsData }) {
  if (!reportsData) return null;

  const {
    totalCustomers = 0,
    totalOccasions = 0,
    totalPurchases = 0,
    totalRevenue = 0,
    vipCount = 0,
    standardCount = 0,
    monthlyRevenue = {}
  } = reportsData;

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/reports?format=csv');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Alexandria_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to export CSV');
    }
  };

  const handleExportPDF = () => {
    alert('PDF Export functionality is mocked for this prototype.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Executive Boardroom</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Operational metrics and revenue reports.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface rounded-xl font-label text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Purchases Logged</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalPurchases}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Client Base</span>
            <div className="p-2 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6]">
              <Users size={18} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalCustomers}
          </div>
          <div className="mt-2 text-xs font-body text-on-surface-variant flex gap-2">
            <span>VIP: <strong className="text-on-surface">{vipCount}</strong></span>
            <span>STD: <strong className="text-on-surface">{standardCount}</strong></span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Occasions Managed</span>
            <div className="p-2 rounded-lg bg-[#ca8a04]/10 text-[#ca8a04]">
              <Calendar size={18} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalOccasions}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden p-6">
        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-primary" /> Monthly Revenue (Mocked Chart)
        </h3>
        <div className="h-64 flex items-end gap-2 border-b border-l border-outline-variant/30 pl-2 pb-2">
          {/* Simple CSS bar chart visualization */}
          {monthlyRevenue && Object.keys(monthlyRevenue).map(month => {
            const val = monthlyRevenue[month];
            const maxVal = Math.max(...Object.values(monthlyRevenue), 1);
            const heightPct = (val / maxVal) * 100;
            return (
              <div key={month} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                <div
                  className="w-full max-w-[40px] bg-primary/60 group-hover:bg-primary transition-all rounded-t-sm relative"
                  style={{ height: `${Math.max(heightPct, 5)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-surface px-2 py-1 rounded">
                    ${val}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
