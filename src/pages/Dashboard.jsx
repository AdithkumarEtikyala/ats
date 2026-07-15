import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { HotelContext } from '../contexts/HotelContext';
import { TicketContext } from '../contexts/TicketContext';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Compass,
  CheckCircle,
  Clock,
  ClipboardList,
  AlertTriangle,
  Flame,
  Utensils,
  Wrench,
  Brush,
  ShieldCheck,
  MessageSquare,
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Building,
  TrendingUp,
  Award,
  Send,
  Plus,
  Settings,
  Bell,
  X,
  FileText,
  User,
  Shield,
  Activity,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  Info,
  UserPlus
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { hotels, activeHotel, selectHotel, addHotel } = useContext(HotelContext);
  const { tickets, createTicket, updateTicketStatus, chats, sendChatMessage } = useContext(TicketContext);
  const navigate = useNavigate();

  // Navigation Sub-Views: 'dashboard', 'hotel-detail', 'bookings', 'inbox', 'analytics', 'settings', 'profile'
  const [activeView, setActiveView] = useState('dashboard');
  const [drillDownHotel, setDrillDownHotel] = useState(null);

  // Search & Filter state
  const [searchHotelQuery, setSearchHotelQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  // Booking form states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bkName, setBkName] = useState('');
  const [bkPhone, setBkPhone] = useState('');
  const [bkEmail, setBkEmail] = useState('');
  const [bkHotelId, setBkHotelId] = useState(activeHotel?.id || '');
  const [bkRoom, setBkRoom] = useState('');
  const [bkRoomType, setBkRoomType] = useState('Standard Queen');
  const [bkArrival, setBkArrival] = useState('');
  const [bkCheckout, setBkCheckout] = useState('');

  // Ticket form states
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [tkGuest, setTkGuest] = useState('');
  const [tkRoom, setTkRoom] = useState('');
  const [tkDept, setTkDept] = useState('Housekeeping');
  const [tkType, setTkType] = useState('');
  const [tkPriority, setTkPriority] = useState('Medium');

  // Add Hotel modal states
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('');
  const [newHotelRooms, setNewHotelRooms] = useState(80);
  const [newHotelRestaurant, setNewHotelRestaurant] = useState('Atithi Dining Hall');

  // Add Staff modal states
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Front Desk');

  // WhatsApp reply states
  const [replyTargetPhone, setReplyTargetPhone] = useState('');
  const [replyText, setReplyText] = useState('');

  // Map markers state
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Mock profile picture state
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

  // Location selector for Owner Dashboard
  const [selectedLocation, setSelectedLocation] = useState('Entire Property');

  // Dynamic booking state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  // Keep bookings synched
  useEffect(() => {
    localStorage.setItem('atithisphere_v3_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Sync route queries
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const action = params.get('action');
    if (tab) {
      setActiveView(tab);
    } else {
      setActiveView('dashboard');
    }
    if (action === 'create-booking') {
      setBookingModalOpen(true);
    } else if (action === 'create-ticket') {
      setTicketModalOpen(true);
    }
  }, [window.location.search]);


  const role = user?.role || 'Guest';
  const isAdmin = ['Super Admin', 'Hotel Admin', 'Manager'].includes(role);
  const activeHotelTickets = tickets.filter((t) => t.hotelId === activeHotel?.id || activeHotel?.id === 'all');

  const openTickets = activeHotelTickets.filter((t) => t.status !== 'Completed' && t.status !== 'Closed');
  const closedTickets = activeHotelTickets.filter((t) => t.status === 'Completed' || t.status === 'Closed');

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchQuery = h.name.toLowerCase().includes(searchHotelQuery.toLowerCase()) || h.city.toLowerCase().includes(searchHotelQuery.toLowerCase());
      const matchCity = filterCity === 'All' || h.city === filterCity;
      return matchQuery && matchCity;
    });
  }, [hotels, searchHotelQuery, filterCity]);

  // Calculations for stats
  const activeGuestsCount = bookings
    .filter(b => !activeHotel || b.hotelId === activeHotel.id)
    .filter(b => b.status === 'checked-in').length;
  const todayCheckinsCount = bookings
    .filter(b => !activeHotel || b.hotelId === activeHotel.id)
    .filter(b => b.status === 'checked-in').length;
  const revenueToday = bookings
    .filter(b => !activeHotel || b.hotelId === activeHotel.id)
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleAddHotel = (e) => {
    e.preventDefault();
    if (!newHotelName || !newHotelCity) return;
    addHotel({
      name: newHotelName,
      city: newHotelCity,
      rooms: parseInt(newHotelRooms),
      restaurantName: newHotelRestaurant
    });
    setHotelModalOpen(false);
    setNewHotelName('');
    setNewHotelCity('');
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!bkName || !bkPhone || !bkRoom || !bkArrival) return;

    const selectedH = hotels.find(h => h.id === bkHotelId);
    const newBk = {
      id: `bk-${Math.floor(Math.random() * 9000) + 1000}`,
      hotelId: bkHotelId,
      guestName: bkName,
      guestPhone: bkPhone,
      restaurantName: selectedH?.restaurantName || 'Atithi Dining Hall',
      roomNumber: bkRoom,
      roomType: bkRoomType,
      checkIn: bkArrival,
      checkOut: bkCheckout || '2026-07-15',
      status: 'checked-in',
      amount: bkRoomType === 'Standard Queen' ? 6000 : 12000
    };

    setBookings([newBk, ...bookings]);
    setBookingModalOpen(false);
    setBkName('');
    setBkPhone('');
    setBkRoom('');
  };

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!tkGuest || !tkRoom || !tkType) return;
    createTicket({
      hotelId: activeHotel?.id || 'hotel-1',
      guestName: tkGuest,
      roomNumber: tkRoom,
      requestType: tkType,
      department: tkDept,
      priority: tkPriority
    });
    setTicketModalOpen(false);
    setTkGuest('');
    setTkRoom('');
    setTkType('');
  };

  const handleSendWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!replyTargetPhone || !replyText) return;
    sendChatMessage(replyTargetPhone, replyText, 'bot');
    setReplyText('');
    setReplyTargetPhone('');
  };

  const handleOpenHotelDetail = (hotel) => {
    setDrillDownHotel(hotel);
    setActiveView('hotel-detail');
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Views Router Wrapper */}

      {activeView === 'dashboard' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* UNIFIED GLOBAL LANDING / WORKSPACE PORTAL */}
          {!activeHotel && (
            <div className="space-y-6">
              {/* Header Panel */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200">AtithiSphere Workspace Central</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a hotel workspace to manage property operations, bookings, tickets, and settings</p>
                </div>
              </div>

              {/* Welcome card */}
              <div className="p-6 bg-gradient-to-r from-teal-900/40 via-teal-950/20 to-emerald-950/20 border border-teal-500/20 rounded-3xl space-y-2">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="text-teal-400" size={16} /> Welcome back, {user?.name}!
                </h3>
                <p className="text-xs text-slate-350 max-w-2xl leading-relaxed">
                  To view occupancy metrics, stay ledgers, WhatsApp chat threads, housekeeping compliance status, and service tickets, select an active workspace from your registered properties below or click Hotels in the sidebar.
                </p>
              </div>

              {/* Workspace Selector Cards */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Active Hotel Workspaces</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hotels
                    .filter(h => {
                      if (user?.role === 'Hotel Owner' && user?.email === 'owner1@atithisphere.com') {
                        return h.id === 'hotel-1' || h.id === 'hotel-2';
                      }
                      return true;
                    })
                    .map(h => (
                      <div key={h.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-teal-500/50 transition duration-300 shadow-sm">
                        <div className="space-y-1.5 mb-4">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Location: {h.city}</span>
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{h.name}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => enterWorkspace(h.id)}
                          className="w-full py-2 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                        >
                          Enter Workspace
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}          {/* 2. HOTEL OWNER DASHBOARD */}
          {user?.role === 'Hotel Owner' && (
            <div className="space-y-6">
              
              {/* Top Summary Banner */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner">
                    {activeHotel?.name?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200">{activeHotel?.name} Owner Cockpit</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time occupancy performance, SaaS revenue graphs, and operations indicators</p>
                  </div>
                </div>
              </div>

              {/* Top Stats Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Occupancy Rate</span>
                    <div className="text-lg font-bold text-teal-500">84.5%</div>
                    <span className="text-[8px] text-emerald-500 font-bold">↑ 4.2% from last week</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><CheckCircle size={16} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Revenue Today</span>
                    <div className="text-lg font-bold text-slate-850 dark:text-slate-100">₹42,500</div>
                    <span className="text-[8px] text-slate-400">Default Currency: {activeHotel?.currency || 'INR'}</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">₹</div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Guest Satisfaction</span>
                    <div className="text-lg font-bold text-slate-850 dark:text-slate-100">4.85 / 5.0</div>
                    <span className="text-[8px] text-emerald-500 font-bold">★ Excellent Score</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Award size={16} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Open Critical SLA Issues</span>
                    <div className="text-lg font-bold text-red-500">2 Pending</div>
                    <span className="text-[8px] text-red-400 font-bold">1 Overdue SLA Breach</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><AlertTriangle size={16} /></div>
                </div>
              </div>



              {/* OWNER GRAPHICAL ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Revenue Charts */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenues & Bookings Trends</h3>
                    <span className="text-[8.5px] uppercase bg-teal-500/10 text-teal-600 px-2.5 py-0.5 rounded font-bold">Daily / Weekly / Monthly Scope</span>
                  </div>
                  <div className="h-44 w-full flex items-end justify-between gap-4 pt-4">
                    {[
                      { l: 'Mon', h: 42 },
                      { l: 'Tue', h: 58 },
                      { l: 'Wed', h: 50 },
                      { l: 'Thu', h: 72 },
                      { l: 'Fri', h: 88 },
                      { l: 'Sat', h: 95 },
                      { l: 'Sun', h: 110 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[8px] text-slate-400 font-extrabold">₹{(bar.h * 100).toLocaleString()}</span>
                        <div className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition hover:brightness-105" style={{ height: `${bar.h}px` }}></div>
                        <span className="text-[9px] text-slate-500 font-extrabold">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy and Satisfaction trends */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Guest satisfaction Trends</h3>
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <span className="text-3xl font-black text-slate-850 dark:text-slate-100">4.85 / 5</span>
                      <span className="block text-[8.5px] text-slate-500 font-bold uppercase tracking-widest mt-1">SLA Rating Score trends</span>
                    </div>
                    
                    {/* SVG Line chart vector */}
                    <div className="h-20 w-full relative">
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <path d="M 0,35 Q 25,10 50,20 T 100,5" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
                        <circle cx="50" cy="20" r="3" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
                        <circle cx="100" cy="5" r="3" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
                      </svg>
                      <span className="absolute bottom-0 left-1 text-[7.5px] text-slate-500 font-bold">1 week ago</span>
                      <span className="absolute top-0 right-1 text-[7.5px] text-slate-500 font-bold">Present</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOOKING INSIGHTS & HOTEL PERFORMANCE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Booking Insights */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Booking Insights Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Total Bookings</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">124 Reservations</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Upcoming Arrivals</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">18 Bookings</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Cancelled bookings</span>
                      <span className="text-sm font-black text-red-500">4 Bookings</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Repeat & VIP Guests</span>
                      <span className="text-sm font-black text-teal-500">32 Members</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Performance */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Hotel Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Best Performing Dept</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">Housekeeping (100% SLA)</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Average Response Time</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">4.2 Minutes SLA</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">SLA Compliance Rate</span>
                      <span className="text-sm font-black text-emerald-500">96.8% compliant</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850">
                      <span className="text-[8px] text-slate-400 block mb-1">Staff efficiency rating</span>
                      <span className="text-sm font-black text-teal-500">92% shift coverage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHATSAPP INSIGHTS & GUEST FEEDBACK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* WhatsApp Insights */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">WhatsApp Concierge Analytics</h3>
                  <div className="space-y-3 text-xs font-semibold text-slate-650 dark:text-slate-350">
                    <div className="flex justify-between"><span>Total WhatsApp Conversations:</span> <span>1,420 dialogues</span></div>
                    <div className="flex justify-between"><span>Most Common Guest Request:</span> <span className="text-teal-500">Room Cleaning Service</span></div>
                    <div className="flex justify-between"><span>Average Bot Resolution Rate:</span> <span className="text-emerald-500">88.5% automated</span></div>
                  </div>
                </div>

                {/* Guest feedback reviews ledger */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Recent Guest Reviews</h3>
                  <div className="space-y-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl dark:border-slate-850">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-800 dark:text-white">Arjun Mehta (Suite 305)</span>
                        <span className="text-amber-500">★ 5.0</span>
                      </div>
                      <p className="text-[9.5px] theme-muted mt-1 font-medium italic">"Excellent WhatsApp concierge response! Requested laundry, resolved in minutes."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* REVENUE SECTION & FORECASTS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Revenue Streams & Monthly Forecasts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold text-xs">
                  
                  {/* Revenue by Room Type */}
                  <div className="space-y-2 border-r dark:border-slate-800 pr-4 last:border-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Revenue by Room Class</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span>Deluxe Suite:</span> <span>₹6,80,000 (55%)</span></div>
                      <div className="flex justify-between"><span>Standard Queen:</span> <span><span>₹4,34,000 (35%)</span></span></div>
                      <div className="flex justify-between text-slate-400"><span>Single Standard:</span> <span>₹1,26,000 (10%)</span></div>
                    </div>
                  </div>

                  {/* Revenue by Service Area */}
                  <div className="space-y-2 border-r dark:border-slate-800 pr-4 last:border-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Revenue by Service Segment</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span>Stay Room Rate:</span> <span>₹8,90,000</span></div>
                      <div className="flex justify-between"><span>F&B Dining:</span> <span>₹2,30,000</span></div>
                      <div className="flex justify-between text-slate-400"><span>Spa & Laundry:</span> <span>₹1,20,000</span></div>
                    </div>
                  </div>

                  {/* Monthly Forecast model */}
                  <div className="space-y-2 last:border-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Next Month Forecast model</span>
                    <div className="space-y-1">
                      <span className="text-lg font-black text-teal-500">₹14,20,000</span>
                      <span className="text-[8px] text-slate-400 block font-bold mt-0.5">Based on 92% occupancy predictions and winter peak seasons indicators</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* OWNER QUICK ACTION TRIGGERS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Owner Console Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigate('/hotels')} className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl shadow-sm transition">View Property Profiles</button>
                  <button onClick={() => alert('Financial Invoice Ledger exported successfully.')} className="px-4 py-2 bg-teal-650 hover:bg-teal-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition">Download financial Reports</button>
                  <button onClick={() => navigate('/staff')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border dark:border-slate-850 dark:bg-slate-950 dark:text-slate-100 font-extrabold text-xs rounded-xl transition">View team Rosters</button>
                </div>
              </div>


            </div>
          )}

          {/* 3. HOTEL MANAGER / FRONT DESK DASHBOARD */}
          {(user?.role === 'Manager' || user?.role === 'Front Desk') && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200">{activeHotel?.name} Operations Cockpit</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monitor today's arrivals, check-outs, staff roster, and housekeeping tasks</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="px-3.5 py-1.5 bg-teal-650 hover:bg-teal-600 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Plus size={12} /> Log Booking
                  </button>
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-805 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 hover:bg-slate-850 transition"
                  >
                    <Plus size={12} /> Log Service Issue
                  </button>
                  {user?.role === 'Manager' && (
                    <button
                      onClick={() => navigate('/staff?action=register')}
                      className="px-3.5 py-1.5 bg-slate-900 border border-slate-805 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 hover:bg-slate-850 transition"
                    >
                      <UserPlus size={12} /> Register Staff
                    </button>
                  )}
                </div>
              </div>

              {/* Operational Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Today's Check-ins</span>
                    <div className="text-lg font-bold text-teal-600">4 Arrivals</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Calendar size={16} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Today's Check-outs</span>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">3 Departures</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Calendar size={16} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Open Tickets Queue</span>
                    <div className="text-lg font-bold text-red-500">{tickets.filter(t => t.hotelId === activeHotel?.id && t.status !== 'Completed').length} Pending</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><AlertTriangle size={16} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Housekeeping Clean</span>
                    <div className="text-lg font-bold text-slate-850 dark:text-slate-100">12 / 16 clean</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Brush size={16} /></div>
                </div>
              </div>

              {/* Main operational checklists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bookings Queue */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Arrivals Stay Queue</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-150 dark:border-slate-850 text-slate-500 font-extrabold text-[9px] uppercase tracking-wider">
                          <th className="py-2.5">Guest</th>
                          <th className="py-2.5">Room</th>
                          <th className="py-2.5">Check-In</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {bookings.filter(b => b.hotelId === activeHotel?.id).slice(0, 4).map((b) => (
                          <tr key={b.id}>
                            <td className="py-2.5 font-bold">{b.guestName}</td>
                            <td className="py-2.5 font-bold">Suite {b.roomNumber}</td>
                            <td className="py-2.5 font-medium">{b.checkIn}</td>
                            <td className="py-2.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-extrabold uppercase">
                                Confirmed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Operations checklist & Maintenance status */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Active Maintenance & SLA</h3>
                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/40 border rounded-xl dark:border-slate-850">
                      <div>
                        <span className="block font-bold">AC Water Leaking</span>
                        <span className="text-[9px] text-slate-500">Suite 305 • Wrench</span>
                      </div>
                      <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">High Priority</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/40 border rounded-xl dark:border-slate-850">
                      <div>
                        <span className="block font-bold">Linen Replacement</span>
                        <span className="text-[9px] text-slate-500">Suite 102 • Housekeeping</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Hotel Details drill-down view */}
      {activeView === 'hotel-detail' && drillDownHotel && (
        <div className="space-y-6 text-left animate-fade-in">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{drillDownHotel.name} Operational Overview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed stats for property: {drillDownHotel.city}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b pb-2 dark:border-slate-800">Rooms & Capacity</h3>
              <ul className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
                <li className="flex justify-between"><span>Total Rooms:</span> <span>{drillDownHotel.rooms} Suites</span></li>
                <li className="flex justify-between"><span>Active Checked-in Guests:</span> <span>{bookings.filter(b => b.hotelId === drillDownHotel.id).length} stays</span></li>
                <li className="flex justify-between"><span>Restaurant Dining Hall:</span> <span>{drillDownHotel.restaurantName}</span></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b pb-2 dark:border-slate-800">Tickets & SLA</h3>
              <ul className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
                <li className="flex justify-between"><span>Active Tickets:</span> <span className="text-red-500">{tickets.filter(t => t.hotelId === drillDownHotel.id && t.status !== 'Completed').length} Pending</span></li>
                <li className="flex justify-between"><span>Completed Requests:</span> <span className="text-teal-500">{tickets.filter(t => t.hotelId === drillDownHotel.id && t.status === 'Completed').length} Resolved</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Inbox View */}
      {activeView === 'inbox' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 text-left animate-fade-in">
          <div className="flex items-center gap-3 border-b dark:border-slate-800 pb-3">
            <button
              onClick={() => {
                navigate('/dashboard');
                setActiveView('dashboard');
              }}
              className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">WhatsApp Live Inbox</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monitor active guest conversations and trigger quick responses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Chats list */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {chats.map((c) => (
                <div
                  key={c.guestPhone}
                  onClick={() => setReplyTargetPhone(c.guestPhone)}
                  className={`p-3 border rounded-2xl transition cursor-pointer ${
                    replyTargetPhone === c.guestPhone
                      ? 'bg-teal-950/20 border-teal-500/50 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{c.guestName}</span>
                    <span className="text-[8px] text-slate-450 font-bold">{c.messages[c.messages.length - 1]?.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-405 truncate font-semibold">
                    {c.messages[c.messages.length - 1]?.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Room */}
            <div className="md:col-span-2 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between min-h-[350px] bg-slate-50 dark:bg-slate-950/20">
              {replyTargetPhone ? (
                <>
                  {/* Message logs */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 max-h-[300px]">
                    {chats
                      .find((c) => c.guestPhone === replyTargetPhone)
                      ?.messages.map((m) => {
                        const isBot = m.sender === 'bot';
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col max-w-[80%] ${
                              isBot ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}
                          >
                            <div
                              className={`p-3 rounded-2xl leading-relaxed text-[11px] ${
                                isBot
                                  ? 'bg-teal-650 text-white rounded-tr-none'
                                  : 'bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-150 border border-slate-200 dark:border-slate-800 rounded-tl-none font-semibold'
                              }`}
                            >
                              {m.text}
                            </div>
                            <span className="text-[8px] text-slate-400 mt-1 font-semibold">{m.time}</span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Send input form */}
                  <form onSubmit={handleSendWhatsAppSubmit} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-teal-500 transition"
                      placeholder="Type reply as Concierge bot..."
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-teal-650 hover:bg-teal-600 text-white rounded-xl transition"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                  <MessageSquare size={36} className="mb-2 text-slate-600" />
                  Select a guest conversation to inspect message ledger.
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Profile Settings View */}
      {activeView === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 text-left animate-fade-in">
          <div className="flex items-center gap-3 border-b dark:border-slate-800 pb-3">
            <button
              onClick={() => {
                navigate('/dashboard');
                setActiveView('dashboard');
              }}
              className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">My Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage login credentials and system configuration settings</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b pb-6 dark:border-slate-800">
              <img src={profilePic} className="h-16 w-16 rounded-full object-cover border-2 border-teal-500" alt="Avatar" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{user?.name}</h3>
                <span className="text-[10px] text-slate-455 uppercase tracking-wider font-extrabold font-mono">{user?.role} Workspace</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Security details updated successfully.'); }} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">User Email</label>
                <input
                  type="email"
                  value={user?.email || 'admin@atithisphere.com'}
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-450 font-bold"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Change Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  placeholder="Type new password..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Save Profile Parameters
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modals & Overlays section */}

      {/* Booking creation Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4 relative animate-fade-in">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-700 transition"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar size={16} className="text-teal-500" /> Create New Stay Booking
            </h3>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-slate-800 dark:text-slate-200">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Guest Full Name</label>
                <input
                  type="text"
                  value={bkName}
                  onChange={(e) => setBkName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-teal-500 transition"
                  placeholder="Arjun Mehta"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={bkPhone}
                  onChange={(e) => setBkPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-teal-500 transition"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Select Hotel</label>
                  <select
                    value={bkHotelId}
                    onChange={(e) => setBkHotelId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Code</label>
                  <input
                    type="text"
                    value={bkRoom}
                    onChange={(e) => setBkRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-teal-500 transition"
                    placeholder="e.g. 305"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={bkArrival}
                  onChange={(e) => setBkArrival(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-350"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Save Stay Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket creation Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4 relative animate-fade-in">
            <button
              onClick={() => setTicketModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-700 transition"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ClipboardList size={16} className="text-teal-500" /> Dispatch Operational Ticket
            </h3>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5 text-slate-800 dark:text-slate-200">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={tkGuest}
                  onChange={(e) => setTkGuest(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                  placeholder="e.g. Arjun Mehta"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room</label>
                  <input
                    type="text"
                    value={tkRoom}
                    onChange={(e) => setTkRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                    placeholder="305"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Department</label>
                  <select
                    value={tkDept}
                    onChange={(e) => setTkDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Service Type Description</label>
                <input
                  type="text"
                  value={tkType}
                  onChange={(e) => setTkType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                  placeholder="e.g. Extra Towels delivery"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Log Ticket to Dispatch Queue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Hotel Modal */}
      {hotelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4 relative animate-fade-in">
            <button
              onClick={() => setHotelModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-700 transition"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building size={16} className="text-teal-500" /> Add Hotel Property
            </h3>

            <form onSubmit={handleAddHotel} className="space-y-3.5 text-slate-800 dark:text-slate-200">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Property Name</label>
                <input
                  type="text"
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                  placeholder="e.g. Grand Palace Hotel"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">City Location</label>
                  <input
                    type="text"
                    value={newHotelCity}
                    onChange={(e) => setNewHotelCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                    placeholder="e.g. Mumbai"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Rooms</label>
                  <input
                    type="number"
                    value={newHotelRooms}
                    onChange={(e) => setNewHotelRooms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Add Property Configuration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
