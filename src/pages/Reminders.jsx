import React from 'react';
import { Bell, Check, Clock, AlertTriangle, Play, CheckCircle } from 'lucide-react';

export default function Reminders({ reminders, onUpdateReminder, onNavigateToCustomer, searchQuery }) {
  const filtered = reminders.filter(r => 
    r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReminders = filtered.filter(r => r.status === 'Pending' || r.status === 'Snoozed');
  const pastReminders = filtered.filter(r => r.status === 'Completed' || r.status === 'Dismissed');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Reminders Deck</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Manage triggered occasions and follow-ups.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
              <Bell size={18} className="text-[#ca8a04]" /> Action Queue
            </h3>
            <div className="text-xs font-label font-semibold text-[#ca8a04] bg-[#ca8a04]/10 px-2 py-1 rounded-md">
              {pendingReminders.length} pending
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pendingReminders.length > 0 ? pendingReminders.map(r => (
            <div key={r.id} className="p-4 border border-outline-variant/20 rounded-xl bg-background flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:border-[#ca8a04]/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#ca8a04]/10 rounded-full mt-1">
                  <AlertTriangle size={20} className="text-[#ca8a04]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-base font-bold text-on-surface cursor-pointer hover:text-primary" onClick={() => onNavigateToCustomer(r.customer_id)}>
                      {r.customer_name}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant">
                      {r.status}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant mt-1">
                    Upcoming event on <span className="font-mono text-xs">{r.scheduled_date}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-12 sm:ml-0">
                <button 
                  onClick={() => onUpdateReminder(r.id, { status: 'Snoozed' })}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-highest rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Clock size={14} /> Snooze
                </button>
                <button 
                  onClick={() => onUpdateReminder(r.id, { status: 'Completed' })}
                  className="px-3 py-1.5 text-xs font-bold text-tertiary bg-tertiary/10 hover:bg-tertiary/20 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={14} /> Complete
                </button>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <CheckCircle size={32} className="text-tertiary opacity-50" />
              <p className="font-body text-sm text-on-surface-variant italic">All caught up! No pending reminders.</p>
            </div>
          )}

          {pastReminders.length > 0 && (
            <div className="mt-8">
              <h4 className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-2">Completed / Dismissed</h4>
              <div className="space-y-3 opacity-60">
                {pastReminders.map(r => (
                  <div key={r.id} className="p-3 border border-outline-variant/15 rounded-xl bg-surface-container flex justify-between items-center">
                    <div>
                      <span className="font-body text-sm font-bold text-on-surface">{r.customer_name}</span>
                      <span className="text-xs text-on-surface-variant ml-2">{r.occasion_name} on {new Date(r.scheduled_date).toISOString().split('T')[0]}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container-highest text-on-surface-variant">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
