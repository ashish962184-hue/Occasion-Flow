import React, { useState, useEffect } from 'react';
import { Search, Plus, History, Eye, LayoutGrid, List, Gift, Trash2 } from 'lucide-react';

export default function PurchaseHistory({ 
  purchaseHistory, 
  customers,
  onAddPurchase, 
  onDeletePurchase,
  onNavigateToCustomer,
  searchQuery 
}) {
  const [displayMode, setDisplayMode] = useState(() => localStorage.getItem('purchases_view_mode') || 'card');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('purchases_view_mode', displayMode);
  }, [displayMode]);

  const [customerId, setCustomerId] = useState('');
  const [giftItem, setGiftItem] = useState('');
  const [amount, setAmount] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filtered = purchaseHistory.filter(p => 
    p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gift_item?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPurchase({
      customer_id: customerId,
      gift_item: giftItem,
      amount: parseFloat(amount),
      order_date: orderDate,
      notes
    });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Purchase Ledger</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Track repeat opportunities and order history.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          <span>Log Purchase</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2"><History size={18}/> All Records</h3>
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
                {filtered.length} purchases
              </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface-dim/30">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <Gift size={32} className="opacity-20 mb-3" />
              <p className="font-body text-sm italic">No purchase records found.</p>
            </div>
          ) : displayMode === 'table' ? (
            <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label text-xs uppercase tracking-wider border-b border-outline-variant/15">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Item / Gift</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((p) => {
                 const diff = (new Date() - new Date(p.order_date)) / (1000*3600*24);
                 const isRepeat = diff > 300 && diff < 365;

                 return (
                <tr key={p.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
                    {new Date(p.order_date).toISOString().split('T')[0]}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm font-bold text-on-surface cursor-pointer hover:text-primary" onClick={() => onNavigateToCustomer(p.customer_id)}>
                      {p.customer_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm text-on-surface-variant">{p.gift_item}</div>
                    {isRepeat && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#22c55e]/15 text-[#16a34a]">Repeat Opp</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-headline text-sm font-bold text-on-surface">${Number(p.amount).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button 
                        onClick={() => onNavigateToCustomer(p.customer_id)}
                        className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 rounded-md transition-colors"
                        title="View Customer"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onDeletePurchase && onDeletePurchase(p.id)}
                        className="p-1.5 text-on-surface-variant hover:text-red-600 bg-surface-container hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete Purchase"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant italic text-sm">
                    No purchase records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => {
             const diff = (new Date() - new Date(p.order_date)) / (1000*3600*24);
             const isRepeat = diff > 300 && diff < 365;

             return (
              <div key={p.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-on-surface-variant mb-1">{new Date(p.order_date).toISOString().split('T')[0]}</span>
                    <span className="font-headline text-sm font-bold text-on-surface">${Number(p.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1 transition-opacity">
                    <button onClick={() => onNavigateToCustomer(p.customer_id)} className="p-1 text-on-surface-variant hover:text-primary" title="View Customer"><Eye size={14}/></button>
                    <button onClick={() => onDeletePurchase && onDeletePurchase(p.id)} className="p-1 text-on-surface-variant hover:text-red-600" title="Delete Purchase"><Trash2 size={14}/></button>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">{p.gift_item}</h3>
                  {isRepeat && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#22c55e]/15 text-[#16a34a]">Repeat Opp</span>}
                  <div 
                    className="font-body text-sm font-semibold text-primary hover:text-primary-container transition-colors mt-2 cursor-pointer flex items-center gap-1.5"
                    onClick={() => onNavigateToCustomer(p.customer_id)}
                  >
                    <Eye size={14} className="text-on-surface-variant" /> {p.customer_name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant/20 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Log Purchase</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Client *</label>
                <select required value={customerId} onChange={e=>setCustomerId(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm">
                  <option value="" disabled>Select Client</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Item *</label>
                <input required type="text" value={giftItem} onChange={e=>setGiftItem(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Amount *</label>
                <input required type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant">Date *</label>
                <input required type="date" value={orderDate} onChange={e=>setOrderDate(e.target.value)} className="w-full mt-1 bg-background border border-outline-variant/50 rounded-lg px-3 py-2 text-sm" />
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
