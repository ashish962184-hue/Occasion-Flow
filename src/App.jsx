import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Occasions from './pages/Occasions';
import PurchaseHistory from './pages/PurchaseHistory';
import Reminders from './pages/Reminders';
import Reports from './pages/Reports';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';
import { 
  Plus, 
  X, 
  CheckCircle, 
  XCircle, 
  Loader2
} from 'lucide-react';

export default function App() {
  // Navigation states
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Data sets
  const [dashboardData, setDashboardData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [reportsData, setReportsData] = useState(null);
  const [currentCustomerDetail, setCurrentCustomerDetail] = useState(null);

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('crm_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Occasion Flow Admin',
      email: 'admin@occasionflow.com',
      theme: 'system',
      emailNotifications: true,
      smsNotifications: false
    };
  });

  useEffect(() => {
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [settings]);

  // Global utilities
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dialog panels
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState('client');

  // Quick form fields
  const [qName, setQName] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qPref, setQPref] = useState('');
  const [qType, setQType] = useState('Standard');

  const [qOccCust, setQOccCust] = useState('');
  const [qOccType, setQOccType] = useState('Birthday');
  const [qOccDate, setQOccDate] = useState('2026-06-12');
  const [qOccDays, setQOccDays] = useState(7);

  const [qGiftCust, setQGiftCust] = useState('');
  const [qGiftItem, setQGiftItem] = useState('');
  const [qGiftAmt, setQGiftAmt] = useState('');
  const [qGiftDate, setQGiftDate] = useState('2026-06-12');

  // Trigger Toast Messages helper
  const triggerToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Rest API getters
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [resDash, resC, resO, resP, resR, resRep] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/dashboard`),
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/customers?q=${encodeURIComponent(searchQuery)}`),
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/occasions`),
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/purchase-history`),
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/reminders`),
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports`)
      ]);

      if (resDash.ok) setDashboardData((await resDash.json()).data);
      if (resC.ok) setCustomers((await resC.json()).data);
      if (resO.ok) setOccasions((await resO.json()).data);
      if (resP.ok) setPurchaseHistory((await resP.json()).data);
      if (resR.ok) setReminders((await resR.json()).data);
      if (resRep.ok) setReportsData((await resRep.json()).data);

    } catch (err) {
      console.error('[REST Error]', err);
      triggerToast('Failed to connect to backend APIs.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerDetail = async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customers/${id}`);
      if (res.ok) {
        const payload = await res.json();
        setCurrentCustomerDetail(payload.data);
      } else {
        triggerToast('Client profile data loading error.', 'error');
      }
    } catch (err) {
      console.error('[REST Error]', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDetail(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const handleNavigate = (screen) => {
    setSearchQuery('');
    setCurrentScreen(screen);
    setSelectedCustomerId(null);
    setCurrentCustomerDetail(null);
  };

  const handleNavigateToCustomerDetail = (customerNameOrId) => {
    let cust = customers.find(c => c.id === customerNameOrId || c.name.toLowerCase() === customerNameOrId.toLowerCase() || c.name.toLowerCase().includes(customerNameOrId.toLowerCase()));
    if (cust) {
      setSelectedCustomerId(cust.id);
      setCurrentScreen('customer-detail');
    } else {
      triggerToast(`Could not find client`, 'error');
    }
  };

  // API Mutating Procedures
  const handleAddCustomer = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Client profile created successfully.');
        fetchAllData();
      }
    } catch(err) { console.error(err); }
  };

  const handleEditCustomer = async (id, data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Client profile updated successfully.');
        fetchAllData();
        if (selectedCustomerId === id) fetchCustomerDetail(id);
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer? All their associated data will be removed.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        triggerToast('Client profile deleted successfully.');
        fetchAllData();
        if (currentScreen === 'customer-detail' && selectedCustomerId === id) {
          handleNavigate('customers');
        }
      }
    } catch(err) { console.error(err); }
  };

  const handleAddOccasion = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/occasions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Occasion scheduled successfully.');
        fetchAllData();
        if (selectedCustomerId && selectedCustomerId === data.customer_id) fetchCustomerDetail(selectedCustomerId);
      }
    } catch(err) { console.error(err); }
  };

  const handleEditOccasion = async (id, data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/occasions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Occasion updated.');
        fetchAllData();
        if (selectedCustomerId) fetchCustomerDetail(selectedCustomerId);
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteOccasion = async (id) => {
    if (!window.confirm("Are you sure you want to remove this occasion?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/occasions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        triggerToast('Occasion removed successfully.');
        fetchAllData();
        if (selectedCustomerId) fetchCustomerDetail(selectedCustomerId);
      }
    } catch(err) { console.error(err); }
  };

  const handleAddPurchase = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/purchase-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Purchase recorded.');
        fetchAllData();
        if (selectedCustomerId && selectedCustomerId === data.customer_id) fetchCustomerDetail(selectedCustomerId);
      }
    } catch(err) { console.error(err); }
  };

  const handleUpdateReminder = async (id, data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchAllData();
    } catch(err) { console.error(err); }
  };

  const handleUpdateWorkflow = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/workflow/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        triggerToast('Workflow status updated.');
        fetchAllData();
        if (selectedCustomerId) fetchCustomerDetail(selectedCustomerId);
      }
    } catch(err) { console.error(err); }
  };

  // Opens Quick Add modal pre-filled with context
  const handleOpenQuickAddWithContext = (tab, customerId) => {
    if (tab === 'occasion') setQOccCust(customerId);
    if (tab === 'purchase') setQGiftCust(customerId);
    setQuickAddTab(tab);
    setIsQuickAddOpen(true);
  };

  // Quick Add submission dispatcher
  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (quickAddTab === 'client') {
      if (!qName.trim()) return;
      handleAddCustomer({
        name: qName,
        phone: qPhone,
        email: qEmail,
        customerType: qType,
        preferences: qPref.split(',').map(p=>p.trim()).filter(Boolean),
      });
      setQName(''); setQPhone(''); setQEmail(''); setQPref(''); setQType('Standard');
    } else if (quickAddTab === 'occasion') {
      if (!qOccCust || !qOccDate) return;
      handleAddOccasion({
        customer_id: qOccCust,
        occasion_type: qOccType,
        occasion_date: qOccDate,
        reminder_days: qOccDays,
      });
    } else if (quickAddTab === 'purchase') {
      if (!qGiftCust || !qGiftItem || !qGiftAmt) return;
      handleAddPurchase({
        customer_id: qGiftCust,
        gift_item: qGiftItem,
        amount: parseFloat(qGiftAmt),
        order_date: qGiftDate,
      });
      setQGiftItem(''); setQGiftAmt('');
    }
    setIsQuickAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-dim font-sans antialiased text-on-surface transition-colors duration-300">
      <Sidebar 
        currentScreen={currentScreen} 
        userName={settings.name}
        userAvatar={settings.avatar}
        onNavigate={handleNavigate} 
        onOpenQuickAdd={() => {
          setQOccCust(customers[0]?.id || '');
          setQGiftCust(customers[0]?.id || '');
          setIsQuickAddOpen(true);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header  
          title={
            currentScreen === 'dashboard' ? 'Occasion Flow' : 
            currentScreen === 'customers' ? 'Clients Directory' : 
            currentScreen === 'occasions' ? 'Milestones Calendar' : 
            currentScreen === 'purchase-history' ? 'Purchase Ledger' : 
            currentScreen === 'reminders' ? 'Reminders Deck' : 
            currentScreen === 'reports' ? 'Executive Boardroom' : 
            currentCustomerDetail ? `Profile · ${currentCustomerDetail.name}` : 'Gifting Occasion Calendar & Customer Relationship Tracker'
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userAvatar={settings.avatar}
          userName={settings.name}
          onOpenAddPurchase={() => {
            setQGiftCust(customers[0]?.id || '');
            setQuickAddTab('purchase');
            setIsQuickAddOpen(true);
          }}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigate={handleNavigate}
          reminders={reminders}
        />

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {isLoading && !selectedCustomerId && !dashboardData ? (
            <div className="flex flex-col items-center justify-center py-44 gap-3">
              <Loader2 className="text-primary animate-spin" size={32} />
              <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Syncing Occasion Flow...</p>
            </div>
          ) : (
            <>
              {currentScreen === 'dashboard' && dashboardData && (
                <Dashboard 
                  metrics={dashboardData}
                  occasions={occasions}
                  reminders={reminders}
                  onNavigateToCustomer={handleNavigateToCustomerDetail}
                  onNavigateToAllOccasions={() => handleNavigate('occasions')}
                />
              )}

              {currentScreen === 'customers' && (
                <Customers 
                  customers={customers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onAddCustomer={handleAddCustomer}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onNavigateToDetail={handleNavigateToCustomerDetail}
                  onOpenQuickAdd={handleOpenQuickAddWithContext}
                />
              )}

              {currentScreen === 'occasions' && (
                <Occasions 
                  occasions={occasions}
                  customers={customers}
                  onAddOccasion={handleAddOccasion}
                  onEditOccasion={handleEditOccasion}
                  onDeleteOccasion={handleDeleteOccasion}
                  onNavigateToCustomer={handleNavigateToCustomerDetail}
                  searchQuery={searchQuery}
                />
              )}

              {currentScreen === 'purchase-history' && (
                <PurchaseHistory 
                  purchaseHistory={purchaseHistory}
                  customers={customers}
                  onAddPurchase={handleAddPurchase}
                  onNavigateToCustomer={handleNavigateToCustomerDetail}
                  searchQuery={searchQuery}
                />
              )}

              {currentScreen === 'reminders' && (
                <Reminders 
                  reminders={reminders}
                  onUpdateReminder={handleUpdateReminder}
                  onNavigateToCustomer={handleNavigateToCustomerDetail}
                  searchQuery={searchQuery}
                />
              )}

              {currentScreen === 'reports' && reportsData && (
                <Reports reportsData={reportsData} />
              )}

              {currentScreen === 'settings' && (
                <Settings 
                  settings={settings} 
                  onSaveSettings={setSettings} 
                />
              )}

              {currentScreen === 'customer-detail' && (
                isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-44 gap-3">
                    <Loader2 className="text-primary animate-spin" size={32} />
                    <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Loading Customer Dossier...</p>
                  </div>
                ) : (
                  currentCustomerDetail && (
                    <CustomerDetail 
                      customer={currentCustomerDetail}
                      onBack={() => handleNavigate('customers')}
                      onEditCustomer={handleEditCustomer}
                      onDeleteCustomer={() => handleDeleteCustomer(currentCustomerDetail.id)}
                      onAddOccasion={handleAddOccasion}
                      onDeleteOccasion={handleDeleteOccasion}
                      onAddPurchase={handleAddPurchase}
                      onUpdateWorkflow={handleUpdateWorkflow}
                    />
                  )
                )
              )}
            </>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-on-primary border border-outline-variant/10 px-5 py-3 rounded-xl shadow-2xl animate-slideIn">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="text-tertiary" size={18} />
          ) : (
            <XCircle className="text-error" size={18} />
          )}
          <span className="font-label text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/20 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low shrink-0 select-none">
              <div className="flex gap-4">
                <button 
                  onClick={() => setQuickAddTab('client')}
                  className={`font-headline text-base font-bold pb-1.5 border-b-2 transition-all cursor-pointer ${
                    quickAddTab === 'client' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  Add Client
                </button>
                <button 
                  onClick={() => setQuickAddTab('occasion')}
                  className={`font-headline text-base font-bold pb-1.5 border-b-2 transition-all cursor-pointer ${
                    quickAddTab === 'occasion' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  Schedule Event
                </button>
                <button 
                  onClick={() => setQuickAddTab('purchase')}
                  className={`font-headline text-base font-bold pb-1.5 border-b-2 transition-all cursor-pointer ${
                    quickAddTab === 'purchase' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  Log Purchase
                </button>
              </div>
              <button onClick={() => setIsQuickAddOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              {quickAddTab === 'client' && (
                <div className="space-y-4 font-body">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Profile Name *</label>
                    <input required type="text" value={qName} onChange={e=>setQName(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Phone Number</label>
                      <input type="text" value={qPhone} onChange={e=>setQPhone(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Email Address</label>
                      <input type="email" value={qEmail} onChange={e=>setQEmail(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Preferences (comma separated)</label>
                    <input type="text" value={qPref} onChange={e=>setQPref(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
              )}

              {quickAddTab === 'occasion' && (
                <div className="space-y-4 font-body">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Client *</label>
                    <select required value={qOccCust} onChange={e=>setQOccCust(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary">
                      <option value="" disabled>Select Client</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Event Type *</label>
                      <select value={qOccType} onChange={e=>setQOccType(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary">
                        <option value="Birthday">Birthday</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Festival">Festival</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Date *</label>
                      <input required type="date" value={qOccDate} onChange={e=>setQOccDate(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}

              {quickAddTab === 'purchase' && (
                <div className="space-y-4 font-body">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Client *</label>
                    <select required value={qGiftCust} onChange={e=>setQGiftCust(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary">
                      <option value="" disabled>Select Client</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Gift/Purchase Name *</label>
                    <input required type="text" value={qGiftItem} onChange={e=>setQGiftItem(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Amount ($) *</label>
                      <input required type="number" step="0.01" value={qGiftAmt} onChange={e=>setQGiftAmt(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs font-semibold text-on-surface-variant">Date *</label>
                      <input required type="date" value={qGiftDate} onChange={e=>setQGiftDate(e.target.value)} className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 mt-4 border-t border-outline-variant/15 flex justify-end gap-3">
                <button type="button" onClick={() => setIsQuickAddOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
