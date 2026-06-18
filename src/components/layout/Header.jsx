import React, { useState, useRef, useEffect } from 'react';
import { Search, PlusCircle, Menu, Bell, User, Settings, Check } from 'lucide-react';

export default function Header({ 
  title = 'Gifting Occasion Calendar & Customer Relationship Tracker', 
  searchQuery, 
  onSearchChange, 
  userAvatar,
  userName = 'CRM Admin',
  onOpenAddPurchase, 
  onOpenSidebar,
  onNavigate
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0f172a&color=fff`;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 right-0 z-40 flex justify-between items-center h-14 px-4 sm:px-6 w-full bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant/15 flat no shadows docked top-0">
      {/* Page Title & Sidebar toggle for mobile */}
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button 
            onClick={onOpenSidebar}
            className="lg:hidden p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-highest cursor-pointer focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="font-headline text-base sm:text-lg font-semibold text-on-surface select-none truncate">
          {title}
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Rounded Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input 
            type="text" 
            placeholder="Search records, client occasions..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/15 rounded-full text-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all placeholder:text-on-surface-variant"
          />
        </div>

        {/* Action icons / text triggers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search mobile toggle */}
          <button 
            onClick={() => {
              const query = prompt('Enter client search query:');
              if (query !== null) onSearchChange(query);
            }}
            className="md:hidden p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-highest/50 cursor-pointer"
          >
            <Search size={20} />
          </button>

          {/* Quick Gift Icon (mobile friendly) */}
          <button 
            onClick={onOpenAddPurchase}
            className="sm:hidden p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-highest/50 cursor-pointer"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/30 mx-0.5 sm:mx-1"></div>

        {/* Premium Trailing Actions - Hidden on extra small mobile screens, but interactive */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onOpenAddPurchase}
            className="hidden sm:inline-block text-xs sm:text-sm font-label font-medium text-tertiary hover:text-[#a47e3c] transition-colors cursor-pointer mr-2"
          >
            Add Purchase
          </button>

          {/* Minimal Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-highest/50 cursor-pointer"
            >
              <Bell size={18} strokeWidth={1.5} />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-[#ca8a04] rounded-full ring-2 ring-surface"></span>
            </button>
            
            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                <div className="p-3 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low">
                  <h4 className="font-headline font-bold text-sm text-on-surface">Notifications</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  <div className="p-2 flex gap-3 hover:bg-surface-container-highest/30 rounded-lg transition-colors cursor-pointer group">
                    <div className="mt-1 p-1.5 bg-primary/10 text-primary rounded-full shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Bell size={12} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-on-surface font-medium leading-tight">Reminder triggered: Sylvia Vance's Birthday</p>
                      <p className="font-body text-xs text-on-surface-variant mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="p-2 flex gap-3 hover:bg-surface-container-highest/30 rounded-lg transition-colors cursor-pointer group">
                    <div className="mt-1 p-1.5 bg-[#ca8a04]/10 text-[#ca8a04] rounded-full shrink-0 group-hover:bg-[#ca8a04] group-hover:text-white transition-colors">
                      <Check size={12} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-on-surface font-medium leading-tight">New customer created successfully.</p>
                      <p className="font-body text-xs text-on-surface-variant mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-outline-variant/15 text-center bg-surface-container-low">
                  <button 
                    onClick={() => { setIsNotifOpen(false); onNavigate('reminders'); }}
                    className="text-xs font-bold text-primary hover:text-primary-container transition-colors cursor-pointer"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20 ml-1 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <img 
                alt="User avatar" 
                className="w-full h-full object-cover ring-2 ring-transparent hover:ring-tertiary/20 cursor-pointer transition-all" 
                src={userAvatar || fallbackAvatar}
                referrerPolicy="no-referrer"
              />
            </button>
            
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn py-1">
                <div className="px-4 py-3 border-b border-outline-variant/15 bg-surface-container-low mb-1">
                  <p className="font-headline font-bold text-sm text-on-surface truncate">{userName}</p>
                  <p className="font-body text-xs text-on-surface-variant truncate">admin@occasionflow.com</p>
                </div>
                
                <button 
                  onClick={() => { setIsProfileOpen(false); onNavigate('settings'); }}
                  className="w-full text-left px-4 py-2 text-sm font-body font-medium text-on-surface hover:bg-surface-container-highest/50 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-on-surface-variant" /> My Profile
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); onNavigate('settings'); }}
                  className="w-full text-left px-4 py-2 text-sm font-body font-medium text-on-surface hover:bg-surface-container-highest/50 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={14} className="text-on-surface-variant" /> Settings
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
