import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Palette, Save, CheckCircle } from 'lucide-react';

export default function Settings({ settings, onSaveSettings }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [name, setName] = useState(settings?.name || 'Occasion Flow Admin');
  const [email, setEmail] = useState(settings?.email || 'admin@occasionflow.com');
  const [emailNotifications, setEmailNotifications] = useState(settings?.emailNotifications ?? true);
  const [smsNotifications, setSmsNotifications] = useState(settings?.smsNotifications ?? false);
  const [theme, setTheme] = useState(settings?.theme || 'system');
  const [avatar, setAvatar] = useState(settings?.avatar || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("File size exceeds 800K");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings({ name, email, emailNotifications, smsNotifications, theme, avatar });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="font-headline text-2xl font-bold text-on-surface">System Settings</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">Manage your account preferences and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-label text-sm font-bold ${
                activeTab === 'profile' 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <User size={18} /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-label text-sm font-bold ${
                activeTab === 'notifications' 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-label text-sm font-bold ${
                activeTab === 'appearance' 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Palette size={18} /> Appearance
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-label text-sm font-bold ${
                activeTab === 'security' 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Shield size={18} /> Security
            </button>
          </nav>
        </div>

        {/* Settings Form Content */}
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant/15 rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSave}>
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-headline text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3">Personal Information</h3>
                
                <div className="flex items-center gap-6">
                  <div 
                    className="w-20 h-20 rounded-full bg-surface-container-highest border border-outline-variant/20 overflow-hidden relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img 
                      src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-highest rounded-lg font-label text-sm font-bold transition-colors"
                      >
                        Upload Avatar
                      </button>
                      {avatar && (
                        <button 
                          type="button" 
                          onClick={() => setAvatar(null)}
                          className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-label text-sm font-bold transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant font-body">JPG, GIF or PNG. Max size of 800K</p>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/gif" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-headline text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl cursor-pointer hover:bg-surface-container-highest/20 transition-colors">
                    <div>
                      <p className="font-label text-sm font-bold text-on-surface">Email Reminders</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">Receive daily summary of pending follow-ups.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotifications} 
                      onChange={(e) => setEmailNotifications(e.target.checked)} 
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl cursor-pointer hover:bg-surface-container-highest/20 transition-colors">
                    <div>
                      <p className="font-label text-sm font-bold text-on-surface">SMS Alerts</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">Get texted for high-priority VIP occasions.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={smsNotifications} 
                      onChange={(e) => setSmsNotifications(e.target.checked)} 
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-headline text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3">App Appearance</h3>
                
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">Theme Mode</label>
                  <select 
                    value={theme} 
                    onChange={e => setTheme(e.target.value)} 
                    className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary transition-colors"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                  <p className="font-body text-xs text-on-surface-variant mt-1">Select how you'd like the CRM to look.</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-headline text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3">Security & Access</h3>
                
                <div className="space-y-4 max-w-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">Current Password</label>
                    <input type="password" placeholder="••••••••" className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">New Password</label>
                    <input type="password" placeholder="••••••••" className="bg-background border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <button type="button" className="text-xs font-bold font-label text-primary hover:text-primary-container transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-outline-variant/15 flex items-center gap-4">
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save size={16} /> Save Changes
              </button>
              
              {isSaved && (
                <span className="flex items-center gap-1.5 text-sm font-bold font-label text-tertiary animate-fadeIn">
                  <CheckCircle size={16} /> Settings saved
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
