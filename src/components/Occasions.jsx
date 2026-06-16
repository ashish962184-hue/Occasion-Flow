import React, { useState } from 'react';
import { Search, Plus, Calendar as CalendarIcon, Edit2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function Occasions({ 
  occasions, 
  customers,
  onAddOccasion, 
  onEditOccasion, 
  onNavigateToCustomer,
  searchQuery 
}) {
  const [viewMode, setViewMode] = useState('Month'); // Month or Week
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [customerId, setCustomerId] = useState('');
  const [occType, setOccType] = useState('Birthday');
  const [occDate, setOccDate] = useState('2026-06-12');
  const [occDays, setOccDays] = useState(7);
  const [status, setStatus] = useState('Upcoming');

  const filtered = occasions.filter(o => 
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.occasion_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (occ) => {
    setCustomerId(occ.customer_id);
    setOccType(occ.occasion_type);
    setOccDate(occ.occasion_date);
    setOccDays(occ.reminder_days);
    setStatus(occ.status);
    setEditingId(occ.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      customer_id: customerId,
      occasion_type: occType,
      occasion_date: occDate,
      reminder_days: occDays,
      status
    };
    if (editingId) {
      onEditOccasion(editingId, data);
    } else {
      onAddOccasion(data);
    }
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Occasion Calendar</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Track milestones and special events.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container-highest rounded-lg p-1">
            <button 
              onClick={() => setViewMode('Month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'Month' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('Week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'Week' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Week
            </button>
          </div>
          <button 
            onClick={() => { setEditingId(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header / Search */}
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button className="p-1 text-on-surface-variant hover:text-on-surface"><ChevronLeft size={20}/></button>
                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><CalendarIcon size={18}/> June 2026</h3>
                <button className="p-1 text-on-surface-variant hover:text-on-surface"><ChevronRight size={20}/></button>
            </div>
            <div className="text-xs font-label font-semibold text-on-surface-variant">
              {filtered.length} upcoming events
            </div>
        </div>

        {/* List View matching the calendar conceptual style */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label text-xs uppercase tracking-wider border-b border-outline-variant/15">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Occasion Type</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((o) => (
                <tr key={o.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
                    {o.occasion_date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm font-bold text-on-surface cursor-pointer hover:text-primary" onClick={() => onNavigateToCustomer(o.customer_id)}>
                      {o.customer_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm text-on-surface-variant">{o.occasion_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      o.status === 'Completed' ? 'bg-tertiary/15 text-tertiary' :
                      o.status === 'Triggered' ? 'bg-[#eab308]/15 text-[#ca8a04]' :
                      o.status === 'Missed' ? 'bg-error/15 text-error' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(o)}
                        className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onNavigateToCustomer(o.customer_id)}
                        className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 rounded-md transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant italic text-sm">
                    No occasions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant/20 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">{editingId ? 'Edit Occasion' : 'Schedule Occasion'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Client *</label>
                <select required value={customerId} onChange={e=>setCustomerId(e.target.value)} disabled={!!editingId} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="" disabled>Select Client</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Event Type *</label>
                <select value={occType} onChange={e=>setOccType(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Festival">Festival</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Date *</label>
                <input required type="date" value={occDate} onChange={e=>setOccDate(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Triggered">Triggered</option>
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
