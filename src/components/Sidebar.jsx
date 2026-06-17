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
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentScreen, userName, userAvatar, onNavigate, onOpenQuickAdd, isOpen = false, onClose, isCollapsed, onToggleCollapse }) {
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
        className={`fixed left-0 top-0 h-full flex flex-col border-r border-outline-variant/15 bg-surface-container-low shadow-sm z-50 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="px-4 py-8 flex items-center justify-between relative">
          <div className="flex items-center gap-3 w-full">
            <div 
              onClick={() => {
                onNavigate('dashboard');
                if (onClose) onClose();
              }}
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center cursor-pointer overflow-hidden border border-outline-variant/20 shrink-0 mx-auto lg:mx-0 shadow-sm"
              title="Dashboard"
            >
              <img src="/logo.png" alt="Concierge Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden animate-fadeIn">
                <h1 
                  onClick={() => {
                    onNavigate('dashboard');
                    if (onClose) onClose();
                  }}
                  className="font-headline text-[12px] leading-tight font-bold text-on-surface cursor-pointer hover:opacity-90 tracking-wide uppercase"
                >
                  Concierge CRM
                </h1>
                <p className="font-body text-[10px] tracking-widest text-on-surface-variant truncate uppercase mt-0.5">{userName || 'CRM Admin'}</p>
              </div>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-10 bg-surface border border-outline-variant/20 rounded-full p-1 text-on-surface-variant hover:text-on-surface shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Close button inside mobile menu */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface rounded-md hover:bg-surface-container-highest cursor-pointer focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Add CTA */}
        <div className="p-4 flex justify-center">
          <button 
            onClick={() => {
              onOpenQuickAdd();
              if (onClose) onClose();
            }}
            title="Quick Add"
            className={`py-2.5 rounded-xl bg-gradient-to-r from-tertiary to-[#a47e3c] text-white font-label text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border border-[#c49a3b]/20 ${isCollapsed ? 'w-12 px-0' : 'w-full px-4 gap-2'}`}
          >
            <Plus size={18} strokeWidth={2} />
            {!isCollapsed && <span>Quick Add</span>}
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
                title={isCollapsed ? item.label : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`flex items-center px-4 py-3 transition-all group relative ${
                  isActive
                    ? 'text-primary font-bold bg-surface'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary rounded-r-full shadow-[0_0_8px_rgba(180,140,54,0.4)]"></div>
                )}
                <Icon 
                  size={20} 
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 ${
                    isActive ? 'text-tertiary' : 'text-on-surface-variant group-hover:scale-105'
                  }`} 
                />
                {!isCollapsed && <span className="font-label text-[13px] tracking-wide font-medium">{item.label}</span>}
              </a>
            );
          })}
        </div>

        {/* Footer Settings Block */}
        <div className="p-4 border-t border-outline-variant/15 mt-auto">
          <a
            href="#settings"
            title={isCollapsed ? "Settings" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('settings');
              if (onClose) onClose();
            }}
            className={`flex items-center py-3 transition-colors relative group ${
              currentScreen === 'settings' 
                ? 'text-primary font-bold bg-surface'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            {currentScreen === 'settings' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary rounded-r-full"></div>
            )}
            <Settings size={20} strokeWidth={1.5} className={`transition-transform duration-300 ${currentScreen === 'settings' ? 'text-tertiary' : 'group-hover:rotate-45'}`} />
            {!isCollapsed && <span className="font-label text-[13px] tracking-wide font-medium">Settings</span>}
          </a>
        </div>
      </nav>
    </>
  );
}
