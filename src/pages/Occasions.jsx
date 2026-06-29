import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar as CalendarIcon, Edit2, ChevronLeft, ChevronRight, Eye, Trash2, LayoutGrid, List, CheckCircle } from 'lucide-react';

export default function Occasions({ 
  occasions, 
  customers,
  onAddOccasion, 
  onEditOccasion, 
  onDeleteOccasion,
  onNavigateToCustomer,
  searchQuery 
}) {
  const [viewMode, setViewMode] = useState('Month'); // Month or Week
  const [displayMode, setDisplayMode] = useState(() => localStorage.getItem('occasions_view_mode') || 'card');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('occasions_view_mode', displayMode);
  }, [displayMode]);

  const [customerId, setCustomerId] = useState('');
  const [occType, setOccType] = useState('Birthday');
  const [occDate, setOccDate] = useState(new Date().toISOString().split('T')[0]);
  const [occDays, setOccDays] = useState(7);
  const [status, setStatus] = useState('Upcoming');

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const getHeaderText = () => {
    if (viewMode === 'Month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      return `Week of ${start.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const filtered = occasions.filter(o => {
    const searchMatch = o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.occasion_type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!searchMatch) return false;

    if (!o.occasion_date) return true;
    
    const occDateObj = new Date(o.occasion_date);
    occDateObj.setHours(0,0,0,0);
    
    if (viewMode === 'Month') {
      return occDateObj.getMonth() === currentDate.getMonth() && 
             occDateObj.getFullYear() === currentDate.getFullYear();
    } else {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0,0,0,0);
      
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23,59,59,999);
      
      return occDateObj >= start && occDateObj <= end;
    }
  });

  const handleOpenEdit = (occ) => {
    setCustomerId(occ.customer_id);
    setOccType(occ.occasion_type);
    setOccDate(occ.occasion_date ? occ.occasion_date.split('T')[0] : '');
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
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={handlePrev} className="p-1 text-on-surface-variant hover:text-on-surface"><ChevronLeft size={20}/></button>
                <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface flex items-center gap-2 min-w-[120px] sm:min-w-[140px] justify-center"><CalendarIcon size={18}/> <span className="hidden sm:inline">{getHeaderText()}</span><span className="sm:hidden">{viewMode}</span></h3>
                <button onClick={handleNext} className="p-1 text-on-surface-variant hover:text-on-surface"><ChevronRight size={20}/></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface border border-outline-variant/30 rounded-lg p-0.5 flex">
                <button 
                  onClick={() => setDisplayMode('card')}
                  className={`p-1.5 rounded-md transition-colors ${displayMode === 'card' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="Card View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setDisplayMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${displayMode === 'table' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>
              <div className="text-xs font-label font-semibold text-on-surface-variant hidden sm:block">
                {filtered.length} upcoming events
              </div>
            </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-dim/30">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <CalendarIcon size={32} className="opacity-20 mb-3" />
              <p className="font-body text-sm italic">No occasions found.</p>
            </div>
          ) : displayMode === 'table' ? (
            <div className="w-full overflow-x-auto">
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
                    {new Date(o.occasion_date).toISOString().split('T')[0]}
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
                      o.status === 'Due Today' ? 'bg-blue-500/15 text-blue-600' :
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
                        title="View Customer"
                      >
                        <Eye size={16} />
                      </button>
                      {o.status !== 'Completed' && (
                        <button 
                          onClick={() => onEditOccasion(o.id, { ...o, status: 'Completed' })}
                          className="p-1.5 text-on-surface-variant hover:text-tertiary bg-surface-container hover:bg-tertiary/10 rounded-md transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteOccasion(o.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error bg-surface-container hover:bg-error/10 rounded-md transition-colors"
                        title="Delete Occasion"
                      >
                        <Trash2 size={16} />
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
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(o => (
            <div key={o.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-on-surface-variant mb-1">{new Date(o.occasion_date).toISOString().split('T')[0]}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider w-fit ${
                    o.status === 'Completed' ? 'bg-tertiary/15 text-tertiary' :
                    o.status === 'Triggered' ? 'bg-[#eab308]/15 text-[#ca8a04]' :
                    o.status === 'Due Today' ? 'bg-blue-500/15 text-blue-600' :
                    o.status === 'Missed' ? 'bg-error/15 text-error' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 bg-surface-container-low p-1 rounded-lg">
                  {o.status !== 'Completed' && (
                    <button onClick={() => onEditOccasion(o.id, { ...o, status: 'Completed' })} className="p-1 text-on-surface-variant hover:text-tertiary" title="Mark Completed"><CheckCircle size={14}/></button>
                  )}
                  <button onClick={() => handleOpenEdit(o)} className="p-1 text-on-surface-variant hover:text-primary" title="Edit"><Edit2 size={14}/></button>
                  <button onClick={() => onDeleteOccasion(o.id)} className="p-1 text-on-surface-variant hover:text-error" title="Delete"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">{o.occasion_type}</h3>
                <div 
                  className="font-body text-sm font-semibold text-primary hover:text-primary-container transition-colors mt-2 cursor-pointer flex items-center gap-1.5"
                  onClick={() => onNavigateToCustomer(o.customer_id)}
                >
                  <Eye size={14} className="text-on-surface-variant" /> {o.customer_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
