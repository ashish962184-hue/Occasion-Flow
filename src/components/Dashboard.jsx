import React from 'react';
import { Users, Calendar, Clock, RotateCw, Activity, ArrowRight, Eye, Play } from 'lucide-react';

export default function Dashboard({ metrics, onNavigateToCustomer, onNavigateToAllOccasions }) {
  if (!metrics) return null;

  const getWeekOccasionsCount = (type) => {
    const today = new Date('2026-06-12');
    return metrics.upcomingOccasions.filter(o => {
      const d = new Date(o.occasion_date);
      const diff = (d - today) / (1000 * 3600 * 24);
      return o.occasion_type === type && diff >= 0 && diff <= 7;
    }).length;
  };

  const birthdaysThisWeek = getWeekOccasionsCount('Birthday');
  const anniversariesThisWeek = getWeekOccasionsCount('Anniversary');
  const festivalsThisWeek = getWeekOccasionsCount('Festival');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Customers', value: metrics.totalCustomers, icon: Users, color: 'text-primary' },
          { label: 'Upcoming Occasions (30d)', value: metrics.upcomingOccasions.length, icon: Calendar, color: 'text-tertiary' },
          { label: 'Pending Follow-ups', value: metrics.pendingFollowUps, icon: Clock, color: 'text-error' },
          { label: 'Reminder Queue', value: metrics.reminderQueue.length, icon: Activity, color: 'text-[#eab308]' },
          { label: 'Repeat Opportunities', value: metrics.repeatOpportunities, icon: RotateCw, color: 'text-[#22c55e]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg bg-surface-container ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Focus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="font-label text-[10px] uppercase font-bold text-on-surface-variant mb-1">Birthdays This Week</p>
                <p className="font-headline text-xl font-bold text-on-surface">{birthdaysThisWeek}</p>
            </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="font-label text-[10px] uppercase font-bold text-on-surface-variant mb-1">Anniversaries This Week</p>
                <p className="font-headline text-xl font-bold text-on-surface">{anniversariesThisWeek}</p>
            </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="font-label text-[10px] uppercase font-bold text-on-surface-variant mb-1">Festival Events</p>
                <p className="font-headline text-xl font-bold text-on-surface">{festivalsThisWeek}</p>
            </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="font-label text-[10px] uppercase font-bold text-on-surface-variant mb-1">Repeat Opportunities</p>
                <p className="font-headline text-xl font-bold text-on-surface">{metrics.repeatOpportunities}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table: Operational Overview */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-on-surface">Upcoming Occasions Queue</h3>
            <button onClick={onNavigateToAllOccasions} className="text-primary hover:text-primary-container text-xs font-bold font-label flex items-center gap-1">
              View Calendar <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/15">
                  <th className="px-4 py-3 font-label text-xs font-bold text-on-surface-variant uppercase">Customer</th>
                  <th className="px-4 py-3 font-label text-xs font-bold text-on-surface-variant uppercase">Occasion</th>
                  <th className="px-4 py-3 font-label text-xs font-bold text-on-surface-variant uppercase">Reminder Date</th>
                  <th className="px-4 py-3 font-label text-xs font-bold text-on-surface-variant uppercase">Status</th>
                  <th className="px-4 py-3 font-label text-xs font-bold text-on-surface-variant uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {metrics.upcomingOccasions.length > 0 ? (
                  metrics.upcomingOccasions.slice(0, 10).map((occ, idx) => {
                    const rDate = new Date(occ.occasion_date);
                    rDate.setDate(rDate.getDate() - occ.reminder_days);

                    return (
                      <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-body text-sm font-bold text-on-surface">{occ.customer_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-body text-sm text-on-surface-variant">{occ.occasion_type}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                          {rDate.toISOString().split('T')[0]}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            occ.status === 'Completed' ? 'bg-tertiary/15 text-tertiary' :
                            occ.status === 'Triggered' ? 'bg-[#eab308]/15 text-[#ca8a04]' :
                            occ.status === 'Missed' ? 'bg-error/15 text-error' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {occ.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => onNavigateToCustomer(occ.customer_id)}
                            className="inline-flex items-center justify-center p-1.5 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 rounded-md transition-colors"
                            title="Open Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant text-sm italic">
                      No upcoming occasions in the next 30 days.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reminder Activity Widget */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low flex items-center gap-2">
            <BellIcon />
            <h3 className="font-headline text-base font-bold text-on-surface">Recent Reminder Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {metrics.reminderQueue.length > 0 ? (
              metrics.reminderQueue.slice(0, 8).map((rem, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-outline-variant/10 pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#ca8a04] shrink-0" />
                  <div>
                    <p className="font-label text-xs font-bold text-on-surface">Reminder: {rem.status}</p>
                    <p className="font-body text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                      Triggered for event on {rem.scheduled_date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-on-surface-variant text-sm italic">
                No active reminder triggers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon() {
  return <Activity size={18} className="text-primary" />;
}
