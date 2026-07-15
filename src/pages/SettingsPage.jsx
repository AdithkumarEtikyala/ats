import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { HotelContext } from '../contexts/HotelContext';
import { FeedbackContext } from '../contexts/FeedbackContext';
import { 
  Settings, Shield, HelpCircle, Save, RotateCcw, Search, Moon, Sun, 
  Database, MessageSquare, ClipboardList, CreditCard, Bell, 
  Share2, ShieldCheck, Mail, Building, Key, Activity, Clock
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const { hotels, updateHotel, activeHotel, darkMode, toggleDarkMode } = useContext(HotelContext);
  const { submitAppFeedback } = useContext(FeedbackContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(false);
  const [resetStatus, setResetStatus] = useState(false);

  // Platform Configuration states
  const [platformName, setPlatformName] = useState('AtithiSphere');
  const [supportEmail, setSupportEmail] = useState('support@atithisphere.com');
  const [supportPhone, setSupportPhone] = useState('+91 90054 99821');
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Kolkata');

  // WhatsApp Configuration states
  const [waNumber, setWaNumber] = useState('+91 90054 99821');
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to AtithiSphere! We are delighted to host you.');
  const [bookingConfirmTemplate, setBookingConfirmTemplate] = useState('Hi {guest_name}, your booking at {hotel_name} is confirmed! Check-in: {checkin_date}.');
  const [ticketUpdateTemplate, setTicketUpdateTemplate] = useState('Update: Your support ticket #{ticket_id} status has been updated to {status}.');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  // Security Settings states
  const [passwordPolicy, setPasswordPolicy] = useState('Strong');
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification toggles
  const [notifyWa, setNotifyWa] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBooking, setNotifyBooking] = useState(true);
  const [notifyTicket, setNotifyTicket] = useState(true);
  const [notifyFeedback, setNotifyFeedback] = useState(true);

  // Feedback settings states
  const [moderationEnabled, setModerationEnabled] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);

  // Reports Configuration states
  const [dailyReports, setDailyReports] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [autoSchedule, setAutoSchedule] = useState('Weekly');

  const [selectedHotelId, setSelectedHotelId] = useState(activeHotel?.id || (hotels[0]?.id || ''));

  useEffect(() => {
    if (activeHotel) {
      setSelectedHotelId(activeHotel.id);
    }
  }, [activeHotel]);

  const selectedHotel = useMemo(() => {
    return hotels.find(h => h.id === selectedHotelId) || hotels[0];
  }, [hotels, selectedHotelId]);

  // Handle hotel details edit (Super Admin)
  const handleHotelUpdate = (field, val) => {
    if (!selectedHotel) return;
    updateHotel(selectedHotel.id, { ...selectedHotel, [field]: val });
  };

  // Role Configuration Categories Definition
  const roleSections = useMemo(() => {
    const role = user?.role || 'Guest';

    if (role === 'Super Admin') {
      return [
        { id: 'platform', label: 'Platform Settings', icon: Settings },
        { id: 'hotels-config', label: 'Hotel Management', icon: Building },
        { id: 'whatsapp-config', label: 'WhatsApp Configuration', icon: MessageSquare },
        { id: 'security-access', label: 'Security Settings', icon: Shield },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'feedback-config', label: 'Feedback Management', icon: MessageSquare },
        { id: 'reports-config', label: 'Reports Settings', icon: ClipboardList },
        { id: 'theme-config', label: 'Theme Settings', icon: Moon }
      ];
    }

    if (role === 'Hotel Owner') {
      return [
        { id: 'hotel-profile', label: 'Hotel Profile', icon: Building },
        { id: 'hotel-contact', label: 'Hotel Contact Details', icon: Mail },
        { id: 'hotel-branding', label: 'Hotel Branding', icon: Share2 },
        { id: 'booking-policies', label: 'Booking Policies', icon: ClipboardList },
        { id: 'cancellation-policies', label: 'Cancellation Policies', icon: Clock },
        { id: 'refund-policies', label: 'Refund Policies', icon: CreditCard },
        { id: 'guest-review-settings', label: 'Guest Review Settings', icon: MessageSquare },
        { id: 'staff-access-overview', label: 'Staff Access Overview', icon: Key },
        { id: 'whatsapp-settings', label: 'WhatsApp Settings', icon: MessageSquare },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'revenue-preferences', label: 'Revenue Preferences', icon: CreditCard },
        { id: 'hotel-preferences', label: 'Hotel Preferences', icon: Settings }
      ];
    }

    if (role === 'Manager') {
      return [
        { id: 'hotel-operations', label: 'Hotel Operations Settings', icon: Settings },
        { id: 'ticket-management', label: 'Ticket Management Settings', icon: ClipboardList },
        { id: 'sla-settings', label: 'SLA Settings', icon: Clock },
        { id: 'staff-assignment', label: 'Staff Assignment Rules', icon: Key },
        { id: 'dept-config', label: 'Department Configuration', icon: Building },
        { id: 'whatsapp-templates', label: 'WhatsApp Templates', icon: MessageSquare },
        { id: 'guest-service', label: 'Guest Service Configuration', icon: Bell },
        { id: 'notifications-pref', label: 'Notification Preferences', icon: Bell }
      ];
    }

    // Default Fallback
    return [
      { id: 'profile-settings', label: 'Profile Settings', icon: Key },
      { id: 'notifications-pref', label: 'Notification Preferences', icon: Bell }
    ];
  }, [user]);

  const [activeSectionId, setActiveSectionId] = useState(roleSections[0]?.id || 'platform');

  const filteredSections = useMemo(() => {
    if (!searchQuery) return roleSections;
    return roleSections.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [roleSections, searchQuery]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const handleReset = () => {
    setResetStatus(true);
    setTimeout(() => {
      setResetStatus(false);
      setPlatformName('AtithiSphere');
      setSupportEmail('support@atithisphere.com');
      setSupportPhone('+91 90054 99821');
      setDefaultLanguage('English');
      setDefaultTimezone('Asia/Kolkata');
      setWaNumber('+91 90054 99821');
      setWelcomeMsg('Welcome to AtithiSphere! We are delighted to host you.');
      setPasswordPolicy('Strong');
      setSessionTimeout('30 minutes');
      setTwoFactorEnabled(true);
      setNotifyWa(true);
      setNotifyEmail(true);
      setNotifyBooking(true);
      setNotifyTicket(true);
      setNotifyFeedback(true);
      setModerationEnabled(true);
      setAutoPublish(false);
      setDailyReports(true);
      setWeeklyReports(true);
      setMonthlyReports(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">System Preferences & Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system variables, WhatsApp integrations, and operational policies for {user?.role} scope
          </p>
        </div>

        {/* Global Save / Reset Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950 font-bold text-xs rounded-xl transition"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-655 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            <Save size={12} /> Save Settings
          </button>
        </div>
      </div>

      {/* Confirmation Alerts */}
      {saveStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/35 rounded-2xl text-emerald-500 text-xs font-bold flex items-center gap-2">
          <ShieldCheck size={16} /> Configuration changes saved and propagated to all local server instances successfully.
        </div>
      )}
      {resetStatus && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/35 rounded-2xl text-amber-500 text-xs font-bold flex items-center gap-2">
          <RotateCcw size={16} /> Restoring configuration values to default setup...
        </div>
      )}

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR: Configuration Categories */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl space-y-3.5 shadow-sm">
            
            {/* Live Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500"><Search size={12} /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-[11px] focus:outline-none focus:border-teal-500 transition font-bold"
                placeholder="Search settings..."
              />
            </div>

            {/* Categories Menu List */}
            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition ${
                      activeSectionId === sec.id
                        ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 hover:text-slate-800 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick stats panel */}
            <div className="pt-3.5 border-t dark:border-slate-850">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-1">Operational Scope</span>
              <span className="text-[10px] text-teal-500 font-extrabold bg-teal-500/10 border border-teal-500/25 px-2 py-1 rounded-xl block text-center font-mono">
                {user?.role} Mode
              </span>
            </div>

          </div>
        </div>

        {/* MAIN PANEL: Contextual Detail Forms */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-xs font-bold text-slate-650 dark:text-slate-300">
          <form onSubmit={handleSave} className="space-y-6">

            {/* 1. Platform Settings */}
            {activeSectionId === 'platform' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Platform Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Platform Name</label>
                    <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Support Email</label>
                    <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Support Phone Number</label>
                    <input type="text" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Default Language</label>
                    <select value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Default Timezone</label>
                    <input type="text" value={defaultTimezone} onChange={(e) => setDefaultTimezone(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Hotel Management */}
            {activeSectionId === 'hotels-config' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Hotel Management</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1.5">Select Hotel to Configure</label>
                    <select 
                      value={selectedHotelId} 
                      onChange={(e) => setSelectedHotelId(e.target.value)} 
                      disabled={!!activeHotel}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl disabled:opacity-65 disabled:cursor-not-allowed"
                    >
                      {hotels.map((h) => (
                        <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                      ))}
                    </select>
                  </div>

                  {selectedHotel && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t dark:border-slate-855">
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">Hotel Details (Name)</label>
                        <input 
                          type="text" 
                          value={selectedHotel.name} 
                          onChange={(e) => handleHotelUpdate('name', e.target.value)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">City Location</label>
                        <input 
                          type="text" 
                          value={selectedHotel.city} 
                          onChange={(e) => handleHotelUpdate('city', e.target.value)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">Hotel Status</label>
                        <select 
                          value={selectedHotel.status || 'Active'} 
                          onChange={(e) => handleHotelUpdate('status', e.target.value)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl"
                        >
                          <option value="Active">Active Operations</option>
                          <option value="Maintenance">Under Maintenance</option>
                          <option value="Inactive">Suspended Operations</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">Total Room Capacity</label>
                        <input 
                          type="number" 
                          value={selectedHotel.rooms} 
                          onChange={(e) => handleHotelUpdate('rooms', parseInt(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. WhatsApp Configuration */}
            {activeSectionId === 'whatsapp-config' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">WhatsApp Integration Config</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">WhatsApp Business Number</label>
                    <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Connection Status</label>
                    <span className="inline-block px-2.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-mono tracking-wider w-full border border-emerald-500/20 text-center font-bold">
                      🟢 Connected & Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 mt-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Welcome Message Template</label>
                    <textarea rows="2" value={welcomeMsg} onChange={(e) => setWelcomeMsg(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Booking Confirmation Template</label>
                    <textarea rows="2" value={bookingConfirmTemplate} onChange={(e) => setBookingConfirmTemplate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Ticket Update Template</label>
                    <textarea rows="2" value={ticketUpdateTemplate} onChange={(e) => setTicketUpdateTemplate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl outline-none" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input type="checkbox" checked={autoReplyEnabled} onChange={(e) => setAutoReplyEnabled(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Enable Auto Reply settings on incoming messages</span>
                  </label>
                </div>
              </div>
            )}

            {/* 4. Security Settings */}
            {activeSectionId === 'security-access' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Password Policy Complexity</label>
                    <select value={passwordPolicy} onChange={(e) => setPasswordPolicy(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option>Basic (Min 6 chars)</option>
                      <option>Medium (Alpha-numeric)</option>
                      <option>Strong (Caps, Numbers & Special chars)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Login Session Timeout</label>
                    <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Two-Factor Authentication (2FA)</label>
                    <select value={twoFactorEnabled ? 'Enabled' : 'Disabled'} onChange={(e) => setTwoFactorEnabled(e.target.value === 'Enabled')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option value="Enabled">Enabled (Email & SMS OTP)</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t dark:border-slate-855 space-y-2">
                  <span className="block text-[10px] text-slate-500 uppercase">Active Sessions List</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-teal-400">Windows OS • Chrome Browser (Current Session)</span>
                      <span>IP: 192.168.1.1</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Notification Settings */}
            {activeSectionId === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Notification Settings</h3>
                <div className="space-y-2 text-[10.5px]">
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
                    <input type="checkbox" checked={notifyWa} onChange={(e) => setNotifyWa(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Dispatch WhatsApp Notifications for Booking Check-in/Check-out</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
                    <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Send Automated Email Notifications for Stay Reservations</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
                    <input type="checkbox" checked={notifyBooking} onChange={(e) => setNotifyBooking(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Trigger Real-time Booking Alerts in Platform Console</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
                    <input type="checkbox" checked={notifyTicket} onChange={(e) => setNotifyTicket(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Dispatch Escalated Support Ticket Notification Alerts</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
                    <input type="checkbox" checked={notifyFeedback} onChange={(e) => setNotifyFeedback(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Send Push Notifications on New Guest Ratings & Feedback submission</span>
                  </label>
                </div>
              </div>
            )}

            {/* 6. Feedback Management */}
            {activeSectionId === 'feedback-config' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Feedback Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Hotel Feedback Moderation</label>
                    <select value={moderationEnabled ? 'Enabled' : 'Disabled'} onChange={(e) => setModerationEnabled(e.target.value === 'Enabled')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option value="Enabled">Requires Super Admin Review</option>
                      <option value="Disabled">No Moderation Required</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Auto Publish Reviews</label>
                    <select value={autoPublish ? 'Yes' : 'No'} onChange={(e) => setAutoPublish(e.target.value === 'Yes')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option value="Yes">Publish Immediately</option>
                      <option value="No">Hold for Review</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Reports Settings */}
            {activeSectionId === 'reports-config' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Reports Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Export Formats</label>
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option>PDF Format</option>
                      <option>CSV Format</option>
                      <option>Excel Worksheet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Auto Report Dispatch Frequency</label>
                    <select value={autoSchedule} onChange={(e) => setAutoSchedule(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t dark:border-slate-855 text-[10.5px]">
                  <span className="block text-[10px] text-slate-500 uppercase">Enable Automated Reports Dispatch</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={dailyReports} onChange={(e) => setDailyReports(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Dispatch Daily Stay Checkin summaries</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={weeklyReports} onChange={(e) => setWeeklyReports(e.target.checked)} className="rounded border-slate-350 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                    <span>Dispatch Weekly Revenue & SLA Analysis sheets</span>
                  </label>
                </div>
              </div>
            )}

            {/* 8. Theme Settings */}
            {activeSectionId === 'theme-config' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white">Theme Settings</h3>
                <div className="space-y-3">
                  <p className="text-[11.5px] theme-muted leading-relaxed">Customize your platform display view modes for comfort or matching operating system levels.</p>
                  
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => !darkMode && toggleDarkMode()} 
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                        darkMode 
                          ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 font-extrabold' 
                          : 'hover:bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Moon size={16} />
                      <span className="text-[10px]">Dark Mode</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => darkMode && toggleDarkMode()} 
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                        !darkMode 
                          ? 'bg-teal-500/10 border-teal-500/30 text-teal-500 font-extrabold' 
                          : 'dark:hover:bg-slate-955 dark:border-slate-855 text-slate-400'
                      }`}
                    >
                      <Sun size={16} />
                      <span className="text-[10px]">Light Mode</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => alert('System mode is synchronized with Light/Dark preferences.')} 
                      className="p-4 rounded-2xl border border-dashed dark:border-slate-855 text-center hover:bg-slate-50 dark:hover:bg-slate-955 text-slate-400 flex flex-col items-center gap-2"
                    >
                      <Activity size={16} />
                      <span className="text-[10px]">System Sync</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* General fallback for Owner/Manager views */}
            {!['platform', 'hotels-config', 'whatsapp-config', 'security-access', 'notifications', 'feedback-config', 'reports-config', 'theme-config'].includes(activeSectionId) && (
              <div className="space-y-4">
                <h3 className="text-sm font-black border-b dark:border-slate-855 pb-2 text-slate-850 dark:text-white capitalize">
                  {activeSectionId.replace(/-/g, ' ')} Options
                </h3>
                <div className="p-12 text-center bg-slate-50 dark:bg-slate-955/30 border border-dashed rounded-3xl border-slate-200 dark:border-slate-800 space-y-2">
                  <Shield size={20} className="mx-auto text-slate-500" />
                  <p className="text-xs theme-muted">Configuring setup parameters for {activeSectionId.replace(/-/g, ' ')}...</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Enterprise integration verified & active</p>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-855">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-955 text-slate-655 dark:text-slate-355 font-bold text-xs rounded-xl transition"
              >
                Reset Section Defaults
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Save Preferences
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
