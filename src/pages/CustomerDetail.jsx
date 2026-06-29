import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Edit2, 
  Plus,
  Calendar,
  History,
  Activity,
  Bell,
  CheckCircle,
  Clock,
  Briefcase,
  Trash2
} from 'lucide-react';

export default function CustomerDetail({ 
  customer, 
  onBack, 
  onEditCustomer, 
  onDeleteCustomer,
  onAddOccasion,
  onDeleteOccasion,
  onAddPurchase,
  onUpdateWorkflow 
}) {
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  const [occType, setOccType] = useState('Birthday');
  const [occDate, setOccDate] = useState('2026-06-12');
  const [occDays, setOccDays] = useState(7);

  const [purItem, setPurItem] = useState('');
  const [purAmount, setPurAmount] = useState('');
  const [purDate, setPurDate] = useState('2026-06-12');

  const [wfStatus, setWfStatus] = useState('FOLLOW_UP');
  const [wfNotes, setWfNotes] = useState('');

  const nextFollowUp = customer.workflow_history?.find(w => w.status === 'FOLLOW_UP');
  
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-surface-container hover:bg-surface-container-highest rounded-full transition-colors cursor-pointer text-on-surface-variant"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-3xl shrink-0 shadow-sm border border-outline-variant/20">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-3">
                {customer.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${customer.customerType === 'VIP' ? 'bg-[#ca8a04]/15 text-[#ca8a04]' : 'bg-secondary-container text-on-secondary-container'}`}>
                  {customer.customerType}
                </span>
                <span className="font-body text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Client Profile</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onDeleteCustomer}
            className="p-2 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-colors cursor-pointer flex items-center gap-2 font-label text-sm font-bold"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete Client</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Profile & CRM States */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/15 pb-3">Overview</h3>
            
            <div className="space-y-4">
              {customer.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 bg-surface-container rounded-md text-on-surface-variant"><Mail size={16} /></div>
                  <span className="font-body text-on-surface truncate">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 bg-surface-container rounded-md text-on-surface-variant"><Phone size={16} /></div>
                  <span className="font-body text-on-surface">{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm mt-4 pt-4 border-t border-outline-variant/10">
                <div className="p-1.5 bg-surface-container rounded-md text-on-surface-variant"><Briefcase size={16} /></div>
                <div>
                  <span className="block font-label text-[10px] uppercase text-on-surface-variant">Assigned Owner</span>
                  <span className="font-body text-on-surface font-semibold">{customer.assignedOwner || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm mt-2">
                <div className="p-1.5 bg-surface-container rounded-md text-on-surface-variant"><Clock size={16} /></div>
                <div>
                  <span className="block font-label text-[10px] uppercase text-on-surface-variant">Next Follow-up</span>
                  <span className="font-body text-on-surface font-semibold">{nextFollowUp ? 'Pending action' : 'None Scheduled'}</span>
                </div>
              </div>

              {customer.budgetRange && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10">
                  <span className="block font-label text-[10px] uppercase text-on-surface-variant mb-1">Budget Range</span>
                  <span className="font-mono text-sm text-on-surface font-semibold">{customer.budgetRange}</span>
                </div>
              )}

              {customer.preferences && customer.preferences.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10">
                  <span className="block font-label text-[10px] uppercase text-on-surface-variant mb-2">Preferences</span>
                  <div className="flex flex-wrap gap-2">
                    {customer.preferences.map((p, i) => (
                      <span key={i} className="px-2 py-1 rounded-full border border-outline-variant/20 bg-background text-[11px] font-body text-on-surface-variant">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {customer.notes && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10">
                  <span className="block font-label text-[10px] uppercase text-on-surface-variant mb-1">Notes</span>
                  <p className="font-body text-sm text-on-surface-variant whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle & Right: History & Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Occasions Panel */}
            <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><Calendar size={18} className="text-tertiary"/> Occasions</h3>
                <button onClick={() => setIsOccasionModalOpen(true)} className="p-1.5 bg-surface-container hover:bg-tertiary-container/30 text-tertiary rounded-md transition-colors"><Plus size={16}/></button>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {customer.occasions?.length > 0 ? customer.occasions.map((o) => (
                  <div key={o.id} className="p-3 border border-outline-variant/15 rounded-xl bg-background flex justify-between items-center">
                    <div>
                      <p className="font-label text-sm font-bold text-on-surface">{o.occasion_type}</p>
                      <p className="font-mono text-xs text-on-surface-variant mt-0.5">{o.occasion_date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'Completed' ? 'bg-tertiary/15 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                        {o.status}
                      </span>
                      <button 
                        onClick={() => onDeleteOccasion(o.id)}
                        className="p-1 text-on-surface-variant hover:text-error bg-surface-container hover:bg-error/10 rounded-md transition-colors"
                        title="Delete Occasion"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant italic text-center py-4">No occasions scheduled.</p>
                )}
              </div>
            </div>

            {/* Purchase History Panel */}
            <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><History size={18} className="text-tertiary"/> Purchases</h3>
                <button onClick={() => setIsPurchaseModalOpen(true)} className="p-1.5 bg-surface-container hover:bg-tertiary-container/30 text-tertiary rounded-md transition-colors"><Plus size={16}/></button>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {customer.purchase_history?.length > 0 ? customer.purchase_history.map((g) => (
                  <div key={g.id} className="p-3 border border-outline-variant/15 rounded-xl bg-background">
                    <p className="font-label text-sm font-bold text-on-surface truncate">{g.gift_item}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-mono text-xs text-on-surface-variant">{g.order_date}</p>
                      <p className="font-headline text-sm font-bold text-on-surface">${g.amount}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant italic text-center py-4">No purchase history.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reminder History Panel */}
            <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low">
                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><Bell size={18} className="text-[#ca8a04]"/> Reminders</h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {customer.reminders?.length > 0 ? customer.reminders.map((r) => (
                  <div key={r.id} className="flex gap-3 items-start p-2">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#ca8a04] shrink-0" />
                    <div>
                      <p className="font-label text-xs font-bold text-on-surface">Target: {r.scheduled_date}</p>
                      <p className="font-body text-[11px] text-on-surface-variant uppercase mt-0.5">Status: {r.status}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant italic text-center py-4">No reminders found.</p>
                )}
              </div>
            </div>

            {/* Workflow Timeline Panel */}
            <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><Activity size={18} className="text-[#8b5cf6]"/> Workflow</h3>
                <button onClick={() => setIsWorkflowModalOpen(true)} className="text-xs font-bold font-label text-tertiary hover:underline">Update</button>
              </div>
              <div className="p-4 space-y-4 max-h-64 overflow-y-auto relative before:absolute before:inset-0 before:ml-[21px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
                {customer.workflow_history?.length > 0 ? customer.workflow_history.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map((w) => (
                  <div key={w.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-[#8b5cf6] text-on-primary shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                      <CheckCircle size={10} />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">{w.status}</span>
                        <time className="font-mono text-[10px] text-on-surface-variant">{w.created_at?.split('T')[0]}</time>
                      </div>
                      <p className="font-body text-[11px] text-on-surface-variant">{w.notes}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant italic text-center py-4 relative z-10 bg-background">No workflow history.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Occasion Modal */}
      {isOccasionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant/20 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Add Occasion</h3>
            <div className="space-y-4">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Event Type</label>
                <select value={occType} onChange={e=>setOccType(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Festival">Festival</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Date</label>
                <input type="date" value={occDate} onChange={e=>setOccDate(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setIsOccasionModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg">Cancel</button>
                <button onClick={() => {
                  onAddOccasion({ customer_id: customer.id, occasion_type: occType, occasion_date: occDate, reminder_days: occDays });
                  setIsOccasionModalOpen(false);
                }} className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant/20 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Log Purchase</h3>
            <div className="space-y-4">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Item Name</label>
                <input type="text" value={purItem} onChange={e=>setPurItem(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Amount *</label>
                <input type="number" min="0" step="0.01" value={purAmount} onChange={e=>setPurAmount(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Date</label>
                <input type="date" value={purDate} onChange={e=>setPurDate(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setIsPurchaseModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg">Cancel</button>
                <button onClick={() => {
                  onAddPurchase({ customer_id: customer.id, gift_item: purItem, amount: parseFloat(purAmount), order_date: purDate });
                  setIsPurchaseModalOpen(false);
                }} className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Modal */}
      {isWorkflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant/20 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Update Workflow Status</h3>
            <div className="space-y-4">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Status</label>
                <select value={wfStatus} onChange={e=>setWfStatus(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="NEW">NEW</option>
                  <option value="FOLLOW_UP">FOLLOW_UP</option>
                  <option value="SUGGESTED">SUGGESTED</option>
                  <option value="ORDERED">ORDERED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="MISSED">MISSED</option>
                </select>
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Notes</label>
                <textarea rows="3" value={wfNotes} onChange={e=>setWfNotes(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setIsWorkflowModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg">Cancel</button>
                <button onClick={() => {
                  onUpdateWorkflow({ customer_id: customer.id, status: wfStatus, notes: wfNotes });
                  setIsWorkflowModalOpen(false);
                }} className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
