import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar, Filter } from 'lucide-react';

export default function Reports({ reportsData }) {
  const [dateFilter, setDateFilter] = useState('YTD');

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
      a.download = `CRM_Report_${new Date().toISOString().split('T')[0]}.csv`;
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
          <div className="flex bg-surface-container-highest rounded-lg p-1 mr-2 hidden md:flex">
            {['This Month', 'Last Quarter', 'YTD'].map(filter => (
              <button 
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dateFilter === filter ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/30 font-label text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-surface-container text-tertiary group-hover:bg-tertiary-container/30 transition-colors">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs font-body text-on-surface-variant mt-3 flex items-center gap-1"><TrendingUp size={12} className="text-[#16a34a]" /> +12.5% vs last period</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">Purchases Logged</span>
            <div className="p-2 rounded-xl bg-surface-container text-primary group-hover:bg-primary-container/30 transition-colors">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalPurchases}
          </div>
          <p className="text-xs font-body text-on-surface-variant mt-3 flex items-center gap-1"><TrendingUp size={12} className="text-[#16a34a]" /> +4.2% vs last period</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client Base</span>
            <div className="p-2 rounded-xl bg-surface-container text-[#8b5cf6] group-hover:bg-[#8b5cf6]/10 transition-colors">
              <Users size={20} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalCustomers}
          </div>
          <div className="mt-3 text-[11px] font-label font-semibold tracking-wider text-on-surface-variant flex gap-3 uppercase">
            <span>VIP: <strong className="text-on-surface ml-0.5">{vipCount}</strong></span>
            <span>STD: <strong className="text-on-surface ml-0.5">{standardCount}</strong></span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">Occasions Managed</span>
            <div className="p-2 rounded-xl bg-surface-container text-[#ca8a04] group-hover:bg-[#ca8a04]/10 transition-colors">
              <Calendar size={20} />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {totalOccasions}
          </div>
          <p className="text-xs font-body text-on-surface-variant mt-3 flex items-center gap-1"><TrendingUp size={12} className="text-[#16a34a]" /> +8.1% vs last period</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant/15 pb-4">
          <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            <BarChart3 size={20} className="text-tertiary" /> Revenue Trend
          </h3>
          <div className="flex items-center gap-2 text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
            <Filter size={14} /> Filtered by: {dateFilter}
          </div>
        </div>
        <div className="h-72 flex items-end gap-3 md:gap-6 border-b border-l border-outline-variant/30 pl-4 pb-4">
          {/* Simple CSS bar chart visualization */}
          {monthlyRevenue && Object.keys(monthlyRevenue).map(month => {
            const val = monthlyRevenue[month];
            const maxVal = Math.max(...Object.values(monthlyRevenue), 1);
            const heightPct = (val / maxVal) * 100;
            return (
              <div key={month} className="flex-1 flex flex-col items-center justify-end gap-3 group relative h-full">
                <div
                  className="w-full max-w-[48px] bg-tertiary/20 group-hover:bg-tertiary/80 transition-all rounded-t-md relative border border-tertiary/30 group-hover:border-tertiary"
                  style={{ height: `${Math.max(heightPct, 5)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-surface px-2.5 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                    ${val.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-label font-semibold text-on-surface-variant absolute -bottom-7">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
