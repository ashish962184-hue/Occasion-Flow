import React, { useState } from 'react';
import { Search, Plus, X, MoreVertical, Edit2, Shield, Calendar, Phone, Mail, FileText, Briefcase, DollarSign, Users, Trash2 } from 'lucide-react';

export default function Customers({ 
  customers, 
  searchQuery, 
  onSearchChange, 
  onAddCustomer, 
  onEditCustomer, 
  onDeleteCustomer,
  onNavigateToDetail 
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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
          <div className="text-xs font-label font-semibold text-on-surface-variant">
            {customers.length} records
          </div>
        </div>

        {/* Desktop Table */}
        <div className="flex-1 overflow-x-auto">
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
