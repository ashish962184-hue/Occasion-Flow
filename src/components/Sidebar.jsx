import React from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  History, 
  Bell, 
  Plus, 
  Settings,
  LayoutDashboard,
  X
} from 'lucide-react';

export default function Sidebar({ currentScreen, userName, userAvatar, onNavigate, onOpenQuickAdd, isOpen = false, onClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'occasions', label: 'Occasions', icon: Calendar },
    { id: 'purchase-history', label: 'Purchase History', icon: History },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const initial = userName ? userName.charAt(0).toUpperCase() : 'A';

  return (
    <>
      {/* Mobile Sidebar backdrop/overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="lg:hidden fixed inset-0 z-45 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <nav 
        className={`fixed left-0 top-0 h-full flex flex-col border-r border-outline-variant/15 bg-surface-container-low dark:bg-surface-dim shadow-sm w-64 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                onNavigate('dashboard');
                if (onClose) onClose();
              }}
              className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-xl cursor-pointer overflow-hidden border border-outline-variant/20 shrink-0"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="overflow-hidden">
              <h1 
                onClick={() => {
                  onNavigate('dashboard');
                  if (onClose) onClose();
                }}
                className="font-headline text-lg font-bold text-on-surface cursor-pointer hover:opacity-90 truncate"
              >
                Alexandria CRM
              </h1>
              <p className="font-body text-[11px] tracking-tight text-on-surface-variant truncate">{userName || 'CRM Admin'}</p>
            </div>
          </div>

          {/* Close button inside mobile menu */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface rounded-md hover:bg-surface-container-highest cursor-pointer focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Add CTA */}
        <div className="p-4">
          <button 
            onClick={() => {
              onOpenQuickAdd();
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-tertiary to-[#a47e3c] dark:to-[#b8860b] text-white font-label text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer border border-[#c49a3b]/20"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (item.id === 'customers' && currentScreen === 'customer-detail');
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 px-4 py-2.5 transition-all rounded-lg group ${
                  isActive
                    ? 'text-primary font-bold bg-secondary-container/50 scale-[0.98]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-150 ${
                    isActive ? 'text-primary scale-110' : 'text-on-surface-variant group-hover:scale-105'
                  }`} 
                />
                <span className="font-label text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Footer Settings Block */}
        <div className="p-4 border-t border-outline-variant/15 mt-auto">
          <a
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('settings');
              if (onClose) onClose();
            }}
            className={`flex items-center gap-3 px-4 py-2 transition-colors rounded-lg group ${
              currentScreen === 'settings' 
                ? 'text-primary font-bold bg-secondary-container/50'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
            }`}
          >
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-label text-sm font-medium">Settings</span>
          </a>
        </div>
      </nav>
    </>
  );
}
