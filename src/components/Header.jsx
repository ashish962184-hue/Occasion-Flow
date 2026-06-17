import React from 'react';
import { Search, PlusCircle, Menu } from 'lucide-react';

export default function Header({ 
  title = 'Alexandria CRM', 
  searchQuery, 
  onSearchChange, 
  userAvatar,
  userName = 'CRM Admin',
  onOpenAddPurchase, 
  onOpenSidebar
}) {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0f172a&color=fff`;

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
            className="hidden sm:inline-block text-xs sm:text-sm font-label font-medium text-primary hover:text-primary-container transition-colors cursor-pointer"
          >
            Add Purchase
          </button>

          {/* User profile avatar */}
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20 ml-1 shrink-0">
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover ring-2 ring-transparent hover:ring-primary/20 cursor-pointer transition-all" 
              src={userAvatar || fallbackAvatar}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
