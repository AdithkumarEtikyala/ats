import React, { useContext, useState, useMemo } from 'react';
import { HotelContext } from '../contexts/HotelContext';
import { AuthContext } from '../contexts/AuthContext';
import { TicketContext } from '../contexts/TicketContext';
import { MOCK_STAFF, MOCK_BOOKINGS } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';
import Bookings from './Bookings';
import Tickets from './Tickets';
import Feedback from './Feedback';
import SettingsPage from './SettingsPage';
import { Building, Plus, MapPin, Sparkles, X, ShieldAlert, ArrowLeft, Ticket, CheckCircle, Clock, Info, Check, Calendar, Users, AlertTriangle, Brush, Wrench, IndianRupee, MessageSquare, PhoneCall } from 'lucide-react';

export default function Hotels() {
  const { hotels, activeHotel, addHotel, enterWorkspace, exitWorkspace } = useContext(HotelContext);
  const { user } = useContext(AuthContext);
  const { tickets, chats } = useContext(TicketContext);
  const navigate = useNavigate();
  
  // Drill-down State
  const [drillDownHotel, setDrillDownHotel] = useState(null);
  const [workspaceTab, setWorkspaceTab] = useState('overview');
  const [bookings, setBookings] = useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('atithisphere_v3_bookings');
    setBookings(saved ? JSON.parse(saved) : MOCK_BOOKINGS);
  }, [activeHotel]);
  
  // Onboarding Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1); // Steps: 1, 2, 3, 4

  // Onboarding Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Boutique');
  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState(50);
  
  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // Manager Details
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // WhatsApp Config
  const [waNumber, setWaNumber] = useState('');
  const [waApiKey, setWaApiKey] = useState('');
  const [waWebhook, setWaWebhook] = useState('');

  // Subscription & Settings
  const [subPlan, setSubPlan] = useState('Pro'); // Basic, Pro, Enterprise
  const [billingCycle, setBillingCycle] = useState('Annually');
  const [currency, setCurrency] = useState('INR');
  const [checkInTime, setCheckInTime] = useState('12:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState(['WiFi', 'Swimming Pool', 'Room Service']);

  // Images
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60');

  const AMENITY_OPTIONS = [
    'WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Free Parking', 'Restaurant', 'Laundry', 'Room Service'
  ];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save onboarding hotel
    addHotel({
      name,
      city,
      rooms: Number(rooms),
      type,
      description,
      street,
      state,
      zip,
      phone,
      email,
      website,
      managerName,
      managerEmail,
      managerPhone,
      waNumber,
      waApiKey,
      subPlan,
      billingCycle,
      currency,
      checkInTime,
      checkOutTime,
      amenities: selectedAmenities,
      img: coverImage
    });

    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('Boutique');
    setDescription('');
    setRooms(50);
    setStreet('');
    setCity('Mumbai');
    setState('');
    setZip('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setManagerName('');
    setManagerEmail('');
    setManagerPhone('');
    setWaNumber('');
    setWaApiKey('');
    setWaWebhook('');
    setSubPlan('Pro');
    setBillingCycle('Annually');
    setSelectedAmenities(['WiFi', 'Swimming Pool', 'Room Service']);
    setFormStep(1);
  };

  const isSuperAdmin = user?.role === 'Super Admin';

  const visibleHotels = useMemo(() => {
    if (isSuperAdmin) return hotels;
    if (user?.role === 'Hotel Owner') {
      // Suresh Mehta owns hotel-1 and hotel-2
      if (user.email === 'owner1@atithisphere.com') {
        return hotels.filter(h => h.id === 'hotel-1' || h.id === 'hotel-2');
      }
      return hotels.filter(h => h.id === user.hotelId);
    }
    return hotels.filter(h => h.id === user?.hotelId);
  }, [hotels, user, isSuperAdmin]);

  if (drillDownHotel) {
    const hotelTkts = tickets.filter((t) => t.hotelId === drillDownHotel.id);
    const openTkts = hotelTkts.filter((t) => t.status !== 'Completed' && t.status !== 'Closed');
    const resolvedTkts = hotelTkts.filter((t) => t.status === 'Completed' || t.status === 'Closed');
    const hotelStaff = MOCK_STAFF.filter((s) => s.hotelId === drillDownHotel.id);

    return (
      <div className="space-y-6 text-left">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-4">
          <button
            onClick={() => setDrillDownHotel(null)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{drillDownHotel.name} Operational Metrics</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detailed overview for location: {drillDownHotel.city}</p>
          </div>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total SLA Issues</span>
              <div className="text-xl font-bold text-slate-850 dark:text-slate-200 mt-1">{hotelTkts.length}</div>
            </div>
            <div className="h-9 w-9 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center">
              <Ticket size={16} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Open Dispatch Requests</span>
              <div className="text-xl font-bold text-slate-850 dark:text-slate-200 mt-1">{openTkts.length}</div>
            </div>
            <div className="h-9 w-9 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">SLA compliance</span>
              <div className="text-xl font-bold text-slate-850 dark:text-slate-200 mt-1">94%</div>
            </div>
            <div className="h-9 w-9 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
        </div>

        {/* Detailed Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-2">Property Profile details</h3>
            <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="flex justify-between"><span>Property Type:</span> <span>{drillDownHotel.type || 'Standard Hotel'}</span></div>
              <div className="flex justify-between"><span>Default Currency:</span> <span>{drillDownHotel.currency || 'INR'}</span></div>
              <div className="flex justify-between"><span>Check-in Entry:</span> <span>{drillDownHotel.checkInTime || '12:00 PM'}</span></div>
              <div className="flex justify-between"><span>Check-out Departure:</span> <span>{drillDownHotel.checkOutTime || '11:00 AM'}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2"><span>Subscription Plan:</span> <span className="text-teal-500 font-bold">{drillDownHotel.subPlan || 'Pro'}</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-2">WhatsApp Integration status</h3>
            <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="flex justify-between"><span>WhatsApp Business:</span> <span className="text-emerald-500 font-bold">{drillDownHotel.waNumber || 'Configured'}</span></div>
              <div className="flex justify-between"><span>SaaS Webhook API:</span> <span className="text-slate-400 font-mono select-all">https://api.atithisphere.com/v1/wh/{drillDownHotel.id}</span></div>
            </div>
          </div>
        </div>

        {/* Local Team */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
            Local Team Roster ({hotelStaff.length} Members)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hotelStaff.map((staff) => (
              <div key={staff.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-850">
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{staff.name}</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold block mt-0.5">{staff.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeHotel) {
    const hotelBookings = bookings.filter(b => b.hotelId === activeHotel.id);
    const occupiedRooms = Math.min(hotelBookings.length, activeHotel.rooms);
    const availableRooms = activeHotel.rooms - occupiedRooms;
    const activeGuests = hotelBookings.length;
    
    const checkinsToday = hotelBookings.filter(b => b.checkIn === '2026-07-04' || b.checkIn === new Date().toISOString().split('T')[0]).length || 2;
    const checkoutsToday = 1;

    const hotelTickets = tickets.filter(t => t.hotelId === activeHotel.id);
    const openServiceRequests = hotelTickets.filter(t => t.status !== 'Completed' && t.status !== 'Closed').length;
    const housekeepingTasks = hotelTickets.filter(t => t.department === 'Housekeeping' && t.status !== 'Completed' && t.status !== 'Closed').length;
    const maintenanceTasks = hotelTickets.filter(t => t.department === 'Maintenance' && t.status !== 'Completed' && t.status !== 'Closed').length;

    const hotelRevenue = hotelBookings.reduce((sum, b) => sum + (b.amount || 5000), 0);
    const hotelChats = chats ? chats.filter(c => hotelBookings.some(b => b.guestPhone === c.phone || b.guestName.toLowerCase().includes(c.name.toLowerCase()))) : [];

    return (
      <div className="space-y-6 text-left animate-fade-in">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner">
              {activeHotel.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{activeHotel.name} Workspace</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage property details, stays, housekeeping, and service tickets</p>
            </div>
          </div>
          <button
            onClick={() => exitWorkspace()}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-105 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-705 dark:text-slate-200 font-bold text-xs rounded-xl shadow transition"
          >
            <ArrowLeft size={14} /> Exit Workspace
          </button>
        </div>

        {/* Workspace Sub-tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold mb-6 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Dashboard' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'tickets', label: 'Service Requests' },
            { id: 'housekeeping', label: 'Housekeeping' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'food-beverage', label: 'Food & Beverage' },
            { id: 'feedback', label: 'Feedback' },
            { id: 'settings', label: 'Hotel Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setWorkspaceTab(tab.id)}
              className={`pb-2 border-b-2 transition whitespace-nowrap ${
                workspaceTab === tab.id 
                  ? 'border-teal-500 text-teal-500' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Sub-tabs Contents */}
        <div className="mt-4">
          {workspaceTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Console Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setWorkspaceTab('bookings'); }}
                    className="px-4 py-2 bg-teal-655 hover:bg-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Create Booking
                  </button>
                  <button
                    onClick={() => { setWorkspaceTab('feedback'); }}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <MessageSquare size={14} /> Open WhatsApp
                  </button>
                  <button
                    onClick={() => { setWorkspaceTab('bookings'); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:text-slate-100 border dark:border-slate-850 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Users size={14} /> Add Guest
                  </button>
                  <button
                    onClick={() => { setWorkspaceTab('tickets'); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-950 dark:text-slate-100 border dark:border-slate-850 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Ticket size={14} /> Create Service Request
                  </button>
                </div>
              </div>

              {/* Stats Counters Grid (10 items) */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Total Rooms</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{activeHotel.rooms} Suites</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Building size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Occupied Rooms</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{occupiedRooms} Rooms</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><CheckCircle size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Available Rooms</span>
                    <div className="text-base font-bold text-teal-500">{availableRooms} Rooms</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Info size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Active Guests</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{activeGuests} stays</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Users size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Check-ins Today</span>
                    <div className="text-base font-bold text-emerald-500">{checkinsToday} Arrivals</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Calendar size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Check-outs Today</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{checkoutsToday} Departures</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Calendar size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Open Service Requests</span>
                    <div className="text-base font-bold text-red-500">{openServiceRequests} Pending</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><AlertTriangle size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Housekeeping Tasks</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{housekeepingTasks} Tasks</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Brush size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Maintenance Tasks</span>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-100">{maintenanceTasks} Tasks</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><Wrench size={14} /></div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold block">Revenue Summary</span>
                    <div className="text-base font-bold text-teal-500">₹{hotelRevenue.toLocaleString()}</div>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><IndianRupee size={14} /></div>
                </div>
              </div>

              {/* Sections Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left/Middle Column (col-span-2) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Bookings */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Recent Stays & Bookings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-500 font-extrabold text-[9px] uppercase tracking-wider">
                            <th className="py-2.5">Guest</th>
                            <th className="py-2.5">Room</th>
                            <th className="py-2.5">Check-In</th>
                            <th className="py-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                          {hotelBookings.slice(0, 3).map((b) => (
                            <tr key={b.id}>
                              <td className="py-2.5 font-bold">{b.guestName}</td>
                              <td className="py-2.5">Suite {b.roomNumber}</td>
                              <td className="py-2.5 font-medium">{b.checkIn}</td>
                              <td className="py-2.5">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-extrabold uppercase">
                                  Confirmed
                                </span>
                              </td>
                            </tr>
                          ))}
                          {hotelBookings.length === 0 && (
                            <tr>
                              <td colSpan="4" className="py-4 text-center text-slate-400">No active bookings registered</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Guests Directory */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Recent Guest Directory</h3>
                    <div className="space-y-3">
                      {hotelBookings.slice(0, 3).map((b) => (
                        <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-2xl">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center font-bold text-xs">
                              {b.guestName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs block text-slate-800 dark:text-white">{b.guestName}</span>
                              <span className="text-[9.5px] text-slate-500 font-medium">Room {b.roomNumber} • stays until {b.checkOut || 'N/A'}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[8.5px] font-bold">In-house</span>
                        </div>
                      ))}
                      {hotelBookings.length === 0 && (
                        <div className="py-4 text-center text-slate-400 text-xs">No guest profiles on record</div>
                      )}
                    </div>
                  </div>

                  {/* Recent Service Requests */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Recent Service Requests</h3>
                    <div className="space-y-3">
                      {hotelTickets.slice(0, 3).map((t) => (
                        <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-2xl">
                          <div>
                            <span className="font-extrabold text-xs block text-slate-800 dark:text-white">{t.requestType}</span>
                            <span className="text-[9.5px] text-slate-500 font-medium">Suite {t.roomNumber} • {t.department} • Assigned: {t.assignedTo || 'Unassigned'}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            t.status === 'Completed' ? 'bg-teal-500/10 text-teal-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>{t.status}</span>
                        </div>
                      ))}
                      {hotelTickets.length === 0 && (
                        <div className="py-4 text-center text-slate-400 text-xs">No service requests logged</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column (col-span-1) */}
                <div className="space-y-6">
                  {/* WhatsApp Activity */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">WhatsApp Concierge Activity</h3>
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {hotelChats.slice(0, 3).map((chat, idx) => {
                        const lastMsg = chat.messages ? chat.messages[chat.messages.length - 1] : { text: 'Concierge session initialized' };
                        return (
                          <div key={idx} className="space-y-1.5 p-2.5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-2xl">
                            <div className="flex justify-between text-[9px]">
                              <span className="font-extrabold text-slate-850 dark:text-slate-100">{chat.name}</span>
                              <span className="text-slate-400 font-medium">{lastMsg.time || '10:00 PM'}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-600 dark:text-slate-350 italic line-clamp-2">"{lastMsg.text}"</p>
                          </div>
                        );
                      })}
                      {hotelChats.length === 0 && (
                        <div className="p-3 text-center text-slate-455 text-xs italic">
                          No active WhatsApp concierge threads for this property
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Feedback */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-2">Recent Guest Reviews</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Arjun Mehta', room: '305', rating: 5, text: 'Superb WhatsApp integration! Towels arrived in under 3 minutes.' },
                        { name: 'Priya Sharma', room: '102', rating: 4.8, text: 'Food was delicious, service prompt. Highly recommend.' }
                      ].map((rev, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-2xl text-[10px]">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-800 dark:text-white">{rev.name} (Room {rev.room})</span>
                            <span className="text-amber-500">★ {rev.rating}</span>
                          </div>
                          <p className="theme-muted italic mt-1 font-medium">"{rev.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {workspaceTab === 'bookings' && (
            <div className="animate-fade-in"><Bookings /></div>
          )}

          {workspaceTab === 'tickets' && (
            <div className="animate-fade-in"><Tickets /></div>
          )}

          {workspaceTab === 'housekeeping' && (
            <div className="animate-fade-in"><Tickets dept="Housekeeping" /></div>
          )}

          {workspaceTab === 'maintenance' && (
            <div className="animate-fade-in"><Tickets dept="Maintenance" /></div>
          )}

          {workspaceTab === 'food-beverage' && (
            <div className="animate-fade-in"><Tickets dept="Food & Beverage" /></div>
          )}

          {workspaceTab === 'feedback' && (
            <div className="animate-fade-in"><Feedback /></div>
          )}

          {workspaceTab === 'settings' && (
            <div className="animate-fade-in"><SettingsPage /></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Hotel Profiles</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage and view multi-hotel assets registered under the system</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition animate-fade-in"
          >
            <Plus size={14} /> Register New Hotel
          </button>
        )}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {visibleHotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => {
              enterWorkspace(hotel.id);
              setWorkspaceTab('overview');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/50 dark:hover:border-teal-500/50 transition group shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md"
          >
            <div>
              <img src={hotel.img || coverImage} className="h-40 w-full object-cover" alt={hotel.name} />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 text-[9px] font-bold">
                    ID: {hotel.id}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    {hotel.type || 'Resort'}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-200 group-hover:text-teal-650 transition">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-slate-500 text-[11px] font-semibold">
                  <MapPin size={12} /> {hotel.city}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-3 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-450">Active Rooms</span>
                <span className="font-bold text-slate-850 dark:text-slate-350">{hotel.rooms} Rooms</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  enterWorkspace(hotel.id);
                  setWorkspaceTab('overview');
                }}
                className="w-full py-2 bg-teal-650 hover:bg-teal-600 text-white font-bold text-[10.5px] rounded-xl shadow-md transition"
              >
                Select Workspace
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add SaaS Hotel Onboarding Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                  <Building size={18} className="text-teal-500" /> SaaS Property Onboarding Console
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Step {formStep} of 4: Setup parameters and integrations</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Steps Navigation */}
            <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-extrabold uppercase tracking-wider">
              {['Basic Details', 'Contacts & Manager', 'Integrations & Settings', 'Plan & Review'].map((label, idx) => (
                <div
                  key={idx}
                  className={`py-1.5 border-b-2 transition ${
                    formStep === idx + 1
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* STEP 1: Basic Details & Address */}
            {formStep === 1 && (
              <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      placeholder="e.g. Grand Palace Resort"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Property Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                      <option value="Boutique">Boutique Hotel</option>
                      <option value="Luxury Resort">Luxury Resort</option>
                      <option value="Business Lodge">Business Lodge</option>
                      <option value="Serviced Apartments">Serviced Apartments</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Capacity (Rooms)</label>
                    <input
                      type="number"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      min={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">City Location</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Goa">Goa</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="e.g. 45 Marine Drive"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    placeholder="Short summary of the property highlights..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Contacts & Manager Details */}
            {formStep === 2 && (
              <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-600 dark:text-slate-350">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-450 border-b dark:border-slate-800 pb-1">Hotel Contact Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email ID</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="info@property.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="www.property.com"
                    />
                  </div>
                </div>

                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-450 border-b dark:border-slate-800 pb-1 pt-2">Hotel Manager Profile</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Manager Name</label>
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="Name of Manager"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Manager Email</label>
                    <input
                      type="email"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="manager@property.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Manager Phone</label>
                    <input
                      type="text"
                      value={managerPhone}
                      onChange={(e) => setManagerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: WhatsApp Integrations & Settings */}
            {formStep === 3 && (
              <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-600 dark:text-slate-350">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-450 border-b dark:border-slate-800 pb-1">WhatsApp Business Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-semibold"
                      placeholder="e.g. 919005499821"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp Cloud API Key</label>
                    <input
                      type="password"
                      value={waApiKey}
                      onChange={(e) => setWaApiKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      placeholder="Secret access key token"
                    />
                  </div>
                </div>

                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-450 border-b dark:border-slate-800 pb-1 pt-2">Property Parameters</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Default Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Check-in Time</label>
                    <input
                      type="text"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Check-out Time</label>
                    <input
                      type="text"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Plan & Review */}
            {formStep === 4 && (
              <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="grid grid-cols-2 gap-4">
                  {/* SaaS Subscription Options */}
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">SaaS Subscription Plan</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { name: 'Basic', price: '₹4,999/mo' },
                        { name: 'Pro', price: '₹9,999/mo' },
                        { name: 'Enterprise', price: 'Custom Quote' }
                      ].map((plan) => (
                        <button
                          key={plan.name}
                          type="button"
                          onClick={() => setSubPlan(plan.name)}
                          className={`p-3 rounded-xl border text-left flex justify-between items-center transition ${
                            subPlan === plan.name
                              ? 'border-teal-500 bg-teal-500/10 text-teal-650 dark:text-teal-400'
                              : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/20'
                          }`}
                        >
                          <span className="font-extrabold">{plan.name}</span>
                          <span className="text-[10px] theme-muted">{plan.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities checklist */}
                  <div>
                    <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Onboarded Amenities</label>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {AMENITY_OPTIONS.map((a) => {
                        const isSelected = selectedAmenities.includes(a);
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => toggleAmenity(a)}
                            className={`p-2 border rounded-xl flex items-center justify-between text-left transition ${
                              isSelected
                                ? 'border-teal-500 bg-teal-500/10 text-teal-650 dark:text-teal-400'
                                : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/20'
                            }`}
                          >
                            <span>{a}</span>
                            {isSelected && <Check size={10} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload Link */}
                <div>
                  <label className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition text-xs font-bold"
              >
                Cancel
              </button>
              
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={() => setFormStep(prev => prev - 1)}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition text-xs font-bold"
                >
                  Previous
                </button>
              )}

              {formStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(prev => prev + 1)}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg transition text-xs"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-550 text-white rounded-xl font-bold shadow-lg transition text-xs"
                >
                  Onboard & Launch Property
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
