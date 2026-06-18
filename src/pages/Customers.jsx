import React, { useState, useEffect } from 'react';
import { Search, Plus, X, MoreVertical, Edit2, Shield, Calendar, Phone, Mail, FileText, Briefcase, DollarSign, Users, Trash2, LayoutGrid, List, Eye, Gift } from 'lucide-react';

export default function Customers({ 
  customers, 
  searchQuery, 
  onSearchChange, 
  onAddCustomer, 
  onEditCustomer, 
  onDeleteCustomer,
  onNavigateToDetail,
  onOpenQuickAdd
}) {
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('customers_view_mode') || 'card');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('customers_view_mode', viewMode);
  }, [viewMode]);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState('Standard');
  const [preferences, setPreferences] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedOwner, setAssignedOwner] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCustomerType('Standard');
    setPreferences('');
    setBudgetRange('');
    setNotes('');
    setAssignedOwner('');
    setEditingId(null);
  };

  const handleOpenEdit = (customer) => {
    setName(customer.name || '');
    setPhone(customer.phone || '');
    setEmail(customer.email || '');
    setCustomerType(customer.customerType || 'Standard');
    setPreferences((customer.preferences || []).join(', '));
    setBudgetRange(customer.budgetRange || '');
    setNotes(customer.notes || '');
    setAssignedOwner(customer.assignedOwner || '');
    setEditingId(customer.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
      phone,
      email,
      customerType,
      preferences: preferences.split(',').map(p => p.trim()).filter(Boolean),
      budgetRange,
      notes,
      assignedOwner
    };

    if (editingId) {
      onEditCustomer(editingId, data);
    } else {
      onAddCustomer(data);
    }
    
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Clients Directory</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Manage profiles, preferences, and relationships.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={18} />
          <span>New Client</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-low flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant/50 rounded-xl text-sm font-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface border border-outline-variant/30 rounded-lg p-0.5 flex">
              <button 
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                title="Card View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
            <div className="text-xs font-label font-semibold text-on-surface-variant hidden sm:block">
              {customers.length} records
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-dim/30">
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <Users size={32} className="opacity-20 mb-3" />
              <p className="font-body text-sm italic">No matching clients found.</p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label text-xs uppercase tracking-wider border-b border-outline-variant/15">
                <th className="px-6 py-4 font-bold">Client Details</th>
                <th className="px-6 py-4 font-bold">Type & Budget</th>
                <th className="px-6 py-4 font-bold">Preferences</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map((c) => (
                <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/20 transition-colors group">
                  <td className="px-6 py-4 cursor-pointer" onClick={() => onNavigateToDetail(c.name)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-body text-sm font-bold text-on-surface hover:text-primary transition-colors">{c.name}</div>
                        <div className="font-body text-[11px] text-on-surface-variant flex gap-2 mt-0.5">
                          {c.email && <span className="flex items-center gap-1"><Mail size={10} /> {c.email}</span>}
                          {c.phone && <span className="flex items-center gap-1"><Phone size={10} /> {c.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit ${
                        c.customerType === 'VIP' ? 'bg-[#ca8a04]/15 text-[#ca8a04]' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {c.customerType}
                      </span>
                      {c.budgetRange && <span className="text-[11px] font-mono text-on-surface-variant border border-outline-variant/30 rounded px-1.5 py-0.5 w-fit">{c.budgetRange}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(c.preferences || []).slice(0, 2).map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full border border-outline-variant/20 bg-background text-[10px] font-body text-on-surface-variant truncate max-w-[120px]">
                          {p}
                        </span>
                      ))}
                      {(c.preferences || []).length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[10px] font-body text-on-surface-variant">
                          +{(c.preferences || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }}
                        className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 rounded-md transition-colors"
                        title="Edit Profile"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteCustomer(c.id); }}
                        className="p-1.5 text-on-surface-variant hover:text-error bg-surface-container hover:bg-error/20 rounded-md transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                      <Users size={32} className="opacity-20" />
                      <p className="font-body text-sm italic">No matching clients found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <div key={c.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateToDetail(c.name)}>
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-lg shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface group-hover:text-tertiary transition-colors leading-tight">{c.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        c.customerType === 'VIP' ? 'bg-[#ca8a04]/15 text-[#ca8a04]' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {c.customerType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(c)} className="p-1 text-on-surface-variant hover:text-primary"><Edit2 size={14}/></button>
                  <button onClick={() => onDeleteCustomer(c.id)} className="p-1 text-on-surface-variant hover:text-error"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                {c.email && <p className="font-body text-xs text-on-surface-variant flex items-center gap-2"><Mail size={12}/> {c.email}</p>}
                {c.phone && <p className="font-body text-xs text-on-surface-variant flex items-center gap-2"><Phone size={12}/> {c.phone}</p>}
                {c.budgetRange && <p className="font-body text-xs text-on-surface-variant flex items-center gap-2"><DollarSign size={12}/> {c.budgetRange}</p>}
              </div>

              {c.preferences && c.preferences.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {c.preferences.slice(0, 3).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded border border-outline-variant/30 bg-surface text-[10px] text-on-surface-variant">{p}</span>
                  ))}
                  {c.preferences.length > 3 && <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-on-surface-variant">+{c.preferences.length - 3}</span>}
                </div>
              )}

              {/* Action Layer */}
              <div className="pt-4 mt-auto border-t border-outline-variant/15 flex justify-between gap-2">
                <button 
                  onClick={() => onNavigateToDetail(c.name)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-surface hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-label font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Eye size={14} /> Profile
                </button>
                <button 
                  onClick={() => onOpenQuickAdd('occasion', c.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-surface hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-label font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Calendar size={14} /> Occasion
                </button>
                <button 
                  onClick={() => onOpenQuickAdd('purchase', c.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-surface hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-label font-bold text-tertiary hover:text-[#a47e3c] transition-colors"
                >
                  <Gift size={14} /> Gift
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/20 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {editingId ? 'Edit Client Profile' : 'New Client Profile'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Full Name *</label>
                  <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-background border border-outline-variant/50 rounded-lg pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-background border border-outline-variant/50 rounded-lg pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Customer Type</label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <select value={customerType} onChange={e=>setCustomerType(e.target.value)} className="w-full bg-background border border-outline-variant/50 rounded-lg pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary">
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Budget Range</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="text" placeholder="e.g. $1000 - $5000" value={budgetRange} onChange={e=>setBudgetRange(e.target.value)} className="w-full bg-background border border-outline-variant/50 rounded-lg pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Assigned Owner</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="text" placeholder="Owner ID or Name" value={assignedOwner} onChange={e=>setAssignedOwner(e.target.value)} className="w-full bg-background border border-outline-variant/50 rounded-lg pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Preferences (comma separated)</label>
                  <input type="text" placeholder="e.g. Fine Wine, Watches, Leather Goods" value={preferences} onChange={e=>setPreferences(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary" />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Notes</label>
                  <textarea rows="3" value={notes} onChange={e=>setNotes(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary resize-none" />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant/15 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-bold bg-primary text-on-primary rounded-xl hover:bg-primary/90 shadow-md hover:shadow-lg transition-all cursor-pointer">
                  {editingId ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
