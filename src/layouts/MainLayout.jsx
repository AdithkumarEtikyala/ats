import React, { useContext, useState, useEffect, useMemo } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { HotelContext } from '../contexts/HotelContext';
import { TicketContext } from '../contexts/TicketContext';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  CalendarCheck,
  Ticket,
  Users2,
  BarChart3,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Sparkles,
  Search,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Wrench,
  Utensils,
  Brush,
  Zap,
  User,
  UserCheck
} from 'lucide-react';

export default function MainLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { hotels, activeHotel, activeWorkspaceHotel, selectHotel, enterWorkspace, exitWorkspace, darkMode, toggleDarkMode } = useContext(HotelContext);
  const { tickets, chats } = useContext(TicketContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hotelsTreeExpanded, setHotelsTreeExpanded] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'Guest';
  const isAdmin = ['Super Admin', 'Hotel Admin', 'Manager'].includes(role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isItemVisibleForRole = (name, role) => {
    if (role === 'Super Admin') return true;
    if (role === 'Hotel Owner') {
      return ['Dashboard', 'Bookings', 'Guest Requests', 'Staff Management', 'Reports & Analytics', 'Feedback Management', 'Hotels', 'Settings'].includes(name);
    }
    if (role === 'Manager') {
      return ['Dashboard', 'Bookings', 'Guest Requests', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Staff Management', 'Feedback Management', 'Settings'].includes(name);
    }
    if (role === 'Front Desk') {
      return ['Dashboard', 'Bookings', 'Guest Requests', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Staff Management', 'Feedback Management', 'Settings'].includes(name);
    }
    if (role === 'Housekeeping') {
      return ['Dashboard', 'Housekeeping', 'Settings'].includes(name);
    }
    if (role === 'Maintenance') {
      return ['Dashboard', 'Maintenance', 'Settings'].includes(name);
    }
    if (role === 'Food & Beverage') {
      return ['Dashboard', 'Food & Beverage', 'Settings'].includes(name);
    }
    return false;
  };


  // Menu Navigation Items for Platform vs Hotel Workspace sidebars
  const navItems = useMemo(() => {
    // MAIN PLATFORM SIDEBAR WITH HIERARCHY TREE
    return [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, visible: isItemVisibleForRole('Dashboard', role) },
      { 
        name: role === 'Hotel Owner' ? 'My Branches' : 'Hotels', 
        path: '/hotels', 
        icon: Building2, 
        visible: isItemVisibleForRole('Hotels', role),
        children: [
          { name: 'Owner', path: '/hotel-owners', icon: UserCheck, visible: role === 'Super Admin' },
          { name: 'Staff', path: '/staff', icon: Users2, visible: isItemVisibleForRole('Staff Management', role) },
          { name: 'Customers', path: '/bookings?tab=guests', icon: User, visible: true },
          { name: 'Hotel Operations', path: '/hotels', icon: Settings, visible: true }
        ]
      },
      { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, visible: isItemVisibleForRole('Reports & Analytics', role) },
      { name: 'Feedback Management', path: '/feedback', icon: MessageSquare, visible: isItemVisibleForRole('Feedback Management', role) },
      { name: 'Settings', path: '/settings', icon: Settings, visible: isItemVisibleForRole('Settings', role) }
    ].filter(item => item.visible !== false);
  }, [role]);

  return (
    <div className={`h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-teal-500/20 overflow-hidden ${
      darkMode ? 'dark bg-[#070A13] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Enterprise Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#070A13] border-b border-slate-200 dark:border-slate-900 shadow-lg shadow-black/5 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/50"
          >
            <Menu size={18} />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-650 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-extrabold bg-gradient-to-r from-teal-400 via-teal-200 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                AtithiSphere
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold font-mono">Hotel Operations</span>
            </div>
          </Link>

          {activeWorkspaceHotel && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 pl-4 border-l border-slate-200 dark:border-slate-800">
              <span>Dashboard</span>
              <span>&gt;</span>
              <Link to="/hotels" className="hover:text-teal-500 transition">Hotels</Link>
              <span>&gt;</span>
              <span className="text-slate-800 dark:text-white font-black">{activeWorkspaceHotel.name} Workspace</span>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative max-w-xs w-full mx-8">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition"
            placeholder="Global search console..."
          />
        </div>

        <div className="flex items-center gap-3">
          


          {/* WhatsApp Connected Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-450 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            WA ONLINE
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/50 relative"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl p-3 z-50 text-left text-xs space-y-2 animate-fade-in">
                <h4 className="font-bold border-b dark:border-slate-800 pb-1.5">Notifications Ledger</h4>
                <div className="space-y-2 text-[10px]">
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                    <span className="font-bold block">🚨 Ticket SLA Alert</span>
                    <span className="text-slate-500">AC Leaking Water ticket is approaching breach.</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                    <span className="font-bold block">💬 Guest Message Received</span>
                    <span className="text-slate-500">New WhatsApp request from Arjun Mehta.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/50 transition"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative border-l border-slate-200 dark:border-slate-850 pl-3">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'U'}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl p-2 z-50 text-left text-xs space-y-1 animate-fade-in">
                <div className="px-3 py-2 border-b dark:border-slate-800">
                  <span className="font-bold block leading-none">{user?.name}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase">{user?.role}</span>
                </div>
                <Link
                  to="/dashboard?tab=profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-950/50 rounded-lg transition block"
                >
                  My Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg transition block"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Left Sidebar */}
        <aside className={`hidden lg:flex flex-col bg-white dark:bg-[#070A13] border-r border-slate-200 dark:border-slate-900 p-4 space-y-1.5 transition-all duration-300 relative ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 h-6 w-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-500 hover:text-white rounded-full flex items-center justify-center shadow-md z-25 hover:scale-105"
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          <div className="flex-1 flex flex-col space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => item.visible !== false)
              .map((item, idx) => {
                const Icon = item.icon;
                const itemPathBase = item.path.split('?')[0];
                const itemQuery = item.path.split('?')[1] || '';
                const isPathMatch = location.pathname === itemPathBase;
                
                const isQueryMatch = itemQuery 
                  ? location.search.includes(itemQuery) 
                  : (!location.search.includes('dept=') && !location.search.includes('filter=') && !location.search.includes('tab='));
                  
                const isActive = isPathMatch && isQueryMatch;
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/15'
                            : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40'
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        {!sidebarCollapsed && <span>{item.name}</span>}
                      </Link>
                      {!sidebarCollapsed && hasChildren && (
                        <button
                          type="button"
                          onClick={() => setHotelsTreeExpanded(!hotelsTreeExpanded)}
                          className="p-1.5 text-slate-400 hover:text-teal-500 rounded-lg"
                        >
                          <ChevronDown size={14} className={`transition-transform ${hotelsTreeExpanded ? '' : '-rotate-90'}`} />
                        </button>
                      )}
                    </div>

                    {!sidebarCollapsed && hasChildren && hotelsTreeExpanded && (
                      <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                        {item.children
                          .filter(child => child.visible !== false)
                          .map((child, cIdx) => {
                            const ChildIcon = child.icon;
                            const isChildActive = (location.pathname + location.search) === child.path;
                            return (
                              <Link
                                key={cIdx}
                                to={child.path}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                                  isChildActive
                                    ? 'text-teal-500 font-extrabold bg-teal-500/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40'
                                }`}
                              >
                                <span className="text-slate-300 dark:text-slate-700 font-mono text-[10px]">└─</span>
                                <ChildIcon size={13} className="shrink-0 text-teal-500/80" />
                                <span className="truncate">{child.name}</span>
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>



          {/* Quick Actions Shortcuts Box */}
          {!sidebarCollapsed && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl text-left space-y-2">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-extrabold flex items-center gap-1 font-mono">
                <Zap size={10} className="text-teal-500" /> Platform Shortcuts
              </span>
              <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-650 dark:text-slate-350">
                <Link to="/dashboard?action=create-booking" className="hover:text-teal-500 transition">Create Booking</Link>
                <Link to="/dashboard?action=create-ticket" className="hover:text-teal-500 transition">Log Request Ticket</Link>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 max-w-xs bg-white dark:bg-[#070A13] p-6 flex flex-col space-y-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-extrabold text-teal-600">AtithiSphere</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 flex flex-col space-y-1 overflow-y-auto">
                {navItems
                  .filter((item) => item.visible !== false)
                  .map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path.split('?')[0];
                    const hasChildren = item.children && item.children.length > 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={16} />
                            <span>{item.name}</span>
                          </div>
                        </Link>

                        {hasChildren && (
                          <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                            {item.children
                              .filter(child => child.visible !== false)
                              .map((child, cIdx) => {
                                const ChildIcon = child.icon;
                                const isChildActive = (location.pathname + location.search) === child.path;
                                return (
                                  <Link
                                    key={cIdx}
                                    to={child.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                      isChildActive
                                        ? 'text-teal-500 font-extrabold bg-teal-500/10'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white'
                                    }`}
                                  >
                                    <span className="text-slate-300 dark:text-slate-700 font-mono text-[10px]">└─</span>
                                    <ChildIcon size={13} className="shrink-0 text-teal-500" />
                                    <span>{child.name}</span>
                                  </Link>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Content Panel Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

      </div>
    </div>
  );
}
