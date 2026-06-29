import React, { useState, useEffect } from 'react';
import { 
  History, 
  Filter, 
  Download, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowUpRight, 
  X,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

export default function GiftHistory({ 
  giftOrders, 
  customers, 
  onAddGiftOrder, 
  onEditGiftOrder, 
  onDeleteGiftOrder,
  onNavigateToCustomer,
  searchQuery
}) {
  const [selectedOrderId, setSelectedOrderId] = useState(giftOrders[0]?.id || null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [giftSearchQuery, setGiftSearchQuery] = useState('');

  // Sync with global header search query
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== null) {
      setGiftSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [giftName, setGiftName] = useState('');
  const [category, setCategory] = useState('Spirits');
  const [amount, setAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Processing');
  const [notes, setNotes] = useState('');

  const selectedOrder = giftOrders.find(g => g.id === selectedOrderId);
  const selectedOrderCustomer = selectedOrder ? customers.find(c => c.id === selectedOrder.customer_id) : null;

  // Filter application
  const filteredOrders = giftOrders.filter(g => {
    // 1. Status Filter
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    if (!matchesStatus) return false;

    // 2. Category Filter
    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;
    if (!matchesCategory) return false;

    // 3. Date Range Filter
    if (startDate && g.purchase_date < startDate) return false;
    if (endDate && g.purchase_date > endDate) return false;

    // 4. Amount Range Filter
    const val = Number(g.amount);
    if (minAmount && val < parseFloat(minAmount)) return false;
    if (maxAmount && val > parseFloat(maxAmount)) return false;

    // 5. Gift Search Query (checks item name, recipient name, or notes)
    if (giftSearchQuery) {
      const q = giftSearchQuery.toLowerCase();
      const itemMatch = g.gift_name.toLowerCase().includes(q);
      const recipient = customers.find(c => c.id === g.customer_id);
      const recipientMatch = recipient ? recipient.name.toLowerCase().includes(q) : false;
      const notesMatch = g.notes ? g.notes.toLowerCase().includes(q) : false;
      if (!itemMatch && !recipientMatch && !notesMatch) return false;
    }

    return true;
  });

  // Derive metrics over the filtered set for luxury dynamic feedback!
  const totalSpend = filteredOrders.reduce((sum, g) => sum + Number(g.amount), 0);
  const activeDeliveries = filteredOrders.filter(g => g.status === 'Processing' || g.status === 'Shipped').length;
  
  // Calculate average order
  const avgOrderVal = filteredOrders.length > 0 ? (totalSpend / filteredOrders.length) : 0;

  // Extract unique categories for filter
  const categories = ['all', ...Array.from(new Set(giftOrders.map(g => g.category)))];

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setGiftSearchQuery('');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!customerId || !giftName || !amount) return;
    onAddGiftOrder({
      customer_id: customerId,
      gift_name: giftName,
      category,
      amount: parseFloat(amount),
      purchase_date: purchaseDate,
      status,
      notes,
    });
    setIsAddOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this recorded gift order?')) {
      onDeleteGiftOrder(id);
      if (selectedOrderId === id) {
         setSelectedOrderId(null);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Customer Name,Gift Name,Category,Amount,Purchase Date,Status,Notes\n';
    const rows = giftOrders.map(g => {
      const cust = customers.find(c => c.id === g.customer_id);
      return `"${g.id}","${cust ? cust.name : 'Unknown'}","${g.gift_name.replace(/"/g, '""')}","${g.category}",${g.amount},"${g.purchase_date}","${g.status}","${(g.notes || '').replace(/"/g, '""')}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'CRM_Gift_Ledger.csv');
    a.click();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto animate-fadeIn min-h-[calc(100vh-6rem)] px-4 sm:px-0">
      {/* Ledger Block (Left - 8 Columns) */}
      <section className="flex-1 bg-surface border border-outline-variant/15 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        {/* Metric widgets inside history ledger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/15 border-b border-outline-variant/15 bg-surface-container-lowest py-4">
          <div className="px-6 py-2 sm:py-0 text-center sm:text-left">
            <span className="text-on-surface-variant font-label text-[10px] tracking-wider uppercase font-semibold">Total Ledger Volume</span>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface mt-1">${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="px-6 py-2 sm:py-0 text-center sm:text-left">
            <span className="text-on-surface-variant font-label text-[10px] tracking-wider uppercase font-semibold">Average Gift Value</span>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface mt-1">${avgOrderVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="px-6 py-2 sm:py-0 text-center sm:text-left">
            <span className="text-on-surface-variant font-label text-[10px] tracking-wider uppercase font-semibold">Active Curation Cycles</span>
            <div className="font-headline text-xl sm:text-2xl font-bold text-tertiary mt-1">{activeDeliveries} Processing</div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="px-4 sm:px-6 py-4 border-b border-outline-variant/15 flex flex-col gap-4 bg-surface">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Selectors */}
              <div className="flex flex-wrap gap-2">
                {['all', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label font-bold border transition-colors cursor-pointer select-none ${
                      statusFilter === st
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border-outline-variant/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Universal Discoverable Search Box */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-on-surface-variant" size={14} />
                <input 
                  id="gift-toolbar-search"
                  type="text" 
                  placeholder="Search gifts, recipients..." 
                  value={giftSearchQuery}
                  onChange={(e) => setGiftSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-1.5 bg-surface-container border border-outline-variant/15 rounded-lg text-xs font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 sm:w-60 transition-all placeholder:text-on-surface-variant"
                />
                {giftSearchQuery && (
                  <button onClick={() => setGiftSearchQuery('')} className="absolute right-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button 
                id="btn-gift-advanced-filters"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-label font-bold rounded-lg transition-all border cursor-pointer select-none ${
                  showAdvancedFilters || startDate || endDate || minAmount || maxAmount || categoryFilter !== 'all'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-outline-variant/15'
                }`}
              >
                <Filter size={14} />
                <span>Fine Controls</span>
              </button>

              <select
                id="select-gift-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-surface-container border border-outline-variant/15 rounded-lg font-label text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer outline-none"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label text-xs font-bold border border-outline-variant/15 rounded-lg transition-colors cursor-pointer select-none"
              >
                <Download size={14} />
                <span>CSV</span>
              </button>

              <button 
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm select-none"
              >
                <Plus size={14} />
                <span>Log Gift</span>
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Row */}
          {showAdvancedFilters && (
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/25 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs font-semibold text-on-surface-variant">Investment Range (USD)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="input-gift-min-amount"
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="Min $'s"
                    className="bg-background border border-outline-variant/40 rounded-lg px-2 py-1.5 text-xs outline-none w-full focus:border-primary font-mono"
                  />
                  <span className="text-on-surface-variant text-xs">-</span>
                  <input
                    id="input-gift-max-amount"
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="Max $'s"
                    className="bg-background border border-outline-variant/40 rounded-lg px-2 py-1.5 text-xs outline-none w-full focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs font-semibold text-on-surface-variant">Acquisition Dates</label>
                <div className="flex items-center gap-2">
                  <input
                    id="input-gift-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-background border border-outline-variant/40 rounded-lg px-1 text-[11px] h-8 outline-none w-full focus:border-primary font-mono text-on-surface cursor-pointer"
                  />
                  <span className="text-on-surface-variant text-xs">to</span>
                  <input
                    id="input-gift-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-background border border-outline-variant/40 rounded-lg px-1 text-[11px] h-8 outline-none w-full focus:border-primary font-mono text-on-surface cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 hover:bg-surface-container-high hover:text-error text-on-surface-variant font-label text-xs font-bold border border-outline-variant/15 rounded-lg transition-colors cursor-pointer w-full text-center"
                >
                  Reset Active Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-[780px] w-full text-left font-body text-sm divide-y divide-outline-variant/10">
            <thead className="bg-surface-container-low text-on-surface-variant font-label text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Bespoke Curation Item</th>
                <th className="px-5 py-3.5 font-medium">Category</th>
                <th className="px-5 py-3.5 font-medium text-right">Investment</th>
                <th className="px-5 py-3.5 font-medium">Purchase Date</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface">
              {filteredOrders.map((order) => {
                const customer = customers.find(c => c.id === order.customer_id);
                const initials = customer ? customer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CL';

                let stampColor = 'bg-surface-container-highest text-on-surface-variant';
                let circleColor = 'bg-outline';

                if (order.status === 'Processing') {
                  stampColor = 'bg-tertiary-container/30 text-tertiary border border-tertiary/20';
                  circleColor = 'bg-tertiary';
                } else if (order.status === 'Shipped') {
                  stampColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-500/10';
                  circleColor = 'bg-blue-500';
                } else if (order.status === 'Delivered') {
                  stampColor = 'bg-primary-container/20 text-primary border border-primary/20';
                  circleColor = 'bg-primary';
                }

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`hover:bg-surface-container/50 cursor-pointer transition-colors ${
                      selectedOrderId === order.id ? 'bg-secondary-container/40' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          customer?.isVIP ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {initials}
                        </div>
                        <span className="font-semibold text-on-surface leading-snug truncate max-w-[120px] inline-block">{customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-on-surface-variant max-w-[150px] truncate">{order.gift_name}</td>
                    <td className="px-5 py-3.5"><span className="text-xs bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full">{order.category}</span></td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium">${Number(order.amount).toFixed(2)}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{order.purchase_date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold leading-normal font-label uppercase ${stampColor}`}>
                        <span className={`w-1 h-1 rounded-full ${circleColor}`}></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => handleDelete(order.id, e)}
                        className="p-1 hover:bg-surface-container text-on-surface-variant hover:text-error rounded-md transition-colors cursor-pointer"
                        title="Delete order record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant font-medium">
                    No matching gift records in catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Right Side Drawer / Details Panel */}
      <aside className="w-full xl:w-[420px] shrink-0">
        {selectedOrder ? (
          <div className="bg-surface border border-outline-variant/15 rounded-2xl p-5 shadow-sm space-y-5 animate-slideIn">
            <div className="flex justify-between items-start border-b border-outline-variant/15 pb-4">
              <div>
                <span className="text-[10px] font-mono bg-surface-container font-semibold px-2 py-0.5 rounded-full border border-outline-variant/10 text-on-surface-variant mb-1.5 inline-block">{selectedOrder.id}</span>
                <h3 className="font-headline font-semibold text-lg text-on-surface">Curation Dossier</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderId(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex justify-between items-center group">
              <div>
                <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold">Recipient</span>
                <div 
                  onClick={() => onNavigateToCustomer(selectedOrderCustomer?.name || 'Eleanor Vance')}
                  className="font-headline font-extrabold text-base text-primary hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                >
                  {selectedOrderCustomer?.name}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">{selectedOrderCustomer?.city}</p>
              </div>
              {selectedOrderCustomer?.isVIP && (
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-tertiary-container/30 text-tertiary border border-tertiary/30 font-label">
                  VIP
                </span>
              )}
            </div>

            <div className="bg-gradient-to-br from-surface-container-low to-surface-container-high rounded-2xl p-5 border border-outline-variant/15 space-y-3.5 relative overflow-hidden shadow-sm">
              <div>
                <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-wider">Item Details</span>
                <h4 className="font-headline font-bold text-base text-on-surface mt-1 leading-snug">{selectedOrder.gift_name}</h4>
                <p className="text-xs bg-outline-variant/20 text-on-surface-variant px-2.5 py-0.5 rounded-full border border-outline-variant/10 w-fit mt-2 font-medium">{selectedOrder.category}</p>
              </div>

              <div className="border-t border-outline-variant/15 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold">Financing</span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-on-surface mt-0.5">${Number(selectedOrder.amount).toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold">Purchase Date</span>
                  <div className="font-mono text-xs text-on-surface-variant mt-0.5">{selectedOrder.purchase_date}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-wider">Workflow Progression</span>
              <div className="grid grid-cols-3 gap-1.5">
                {['Processing', 'Shipped', 'Delivered'].map((st) => {
                  const isActive = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => onEditGiftOrder(selectedOrder.id, { status: st })}
                      className={`py-2 px-1 text-center font-label text-[10px] font-semibold border rounded-lg transition-colors cursor-pointer select-none ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-high hover:bg-surface-container-highest border-outline-variant/15 text-on-surface-variant'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 border-t border-outline-variant/15 pt-4">
              <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-wider">Admin Log Notes</span>
              <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low/50 border border-outline-variant/15 rounded-xl p-3.5 italic whitespace-pre-wrap font-body">
                {selectedOrder.notes || '"No custom logistical annotations recorded for this premium curation."'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-outline-variant/15 rounded-2xl p-8 shadow-sm text-center">
            <ShoppingBag size={40} className="text-outline/40 mx-auto mb-3" />
            <h4 className="font-headline font-semibold text-base text-on-surface">Select a Log</h4>
            <p className="font-body text-xs text-on-surface-variant mt-1">Select any item in the history ledger of gift-orders to view admin annotations, invoices, and active tracking codes.</p>
          </div>
        )}
      </aside>

      {/* Log Gift Dialog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/20 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low shrink-0">
              <h3 className="font-headline text-lg font-bold text-on-surface">Log Bespoke Gift</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs font-semibold text-on-surface-variant">Select Client Target *</label>
                <select 
                  required 
                  value={customerId} 
                  onChange={e => setCustomerId(e.target.value)} 
                  className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm outline-none w-full focus:border-primary cursor-pointer"
                >
                  <option value="" disabled>Select recipient...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.isVIP ? '(VIP)' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Curation Item Name *</label>
                  <input required type="text" value={giftName} onChange={e => setGiftName(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2 text-sm outline-none w-full focus:border-primary" placeholder="e.g. Rare Macallan 18yr Single Malt" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Category *</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm outline-none w-full focus:border-primary cursor-pointer"
                  >
                    <option value="Spirits">Spirits</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Books">Books</option>
                    <option value="Fine Art">Fine Art</option>
                    <option value="Tableware">Tableware</option>
                    <option value="Gourmet">Gourmet Treats</option>
                    <option value="Leisure">Leisure / Toys</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Investment Amount (USD) *</label>
                  <input required type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2 text-sm outline-none w-full focus:border-primary font-mono" placeholder="1250.00" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Acquisition Date *</label>
                  <input required type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2 text-sm outline-none w-full focus:border-primary font-mono" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs font-semibold text-on-surface-variant">Dispatch Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm outline-none w-full focus:border-primary cursor-pointer"
                >
                  <option value="Processing">Processing / Sourcing</option>
                  <option value="Shipped">Dispatched / Shipped</option>
                  <option value="Delivered">Delivered & Closed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs font-semibold text-on-surface-variant">Admin Logistics Annotation</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  rows={3} 
                  className="bg-background border border-outline-variant/50 rounded-lg px-4 py-2 text-sm outline-none w-full focus:border-primary text-sm font-body leading-normal" 
                  placeholder="Vintage, design elements, customized engraving initial monograms etc." 
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/15 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2 hover:bg-surface-container-low rounded-lg font-label text-sm font-medium transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-label text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">Log Gift Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
