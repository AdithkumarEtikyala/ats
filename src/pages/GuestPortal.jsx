import React, { useState, useMemo, useContext } from 'react';
import { FeedbackContext } from '../contexts/FeedbackContext';
import {
  Sparkles,
  Building,
  Users,
  Calendar,
  MessageSquare,
  Search,
  MapPin,
  Award,
  Send,
  Plus,
  Settings,
  Bell,
  X,
  User,
  Key,
  ClipboardList,
  CreditCard,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Clock,
  Navigation,
  Compass,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Brush,
  Wrench,
  Utensils,
  Car,
  Heart,
  Coffee,
  Bookmark,
  Share2,
  Check,
  Map,
  Star,
  CloudSun,
  ShieldAlert,
  Phone,
  Mail,
  HelpCircle as QuestionIcon,
  AlertOctagon,
  FileText,
  Download
} from 'lucide-react';

export default function GuestPortal() {
  const { submitHotelReview, hotelFeedback, submitAppFeedback } = useContext(FeedbackContext);

  // Guest Settings States
  const [guestSettingsSearch, setGuestSettingsSearch] = useState('');
  const [guestSettingsSection, setGuestSettingsSection] = useState('profile');
  const [guestAppFeedbackType, setGuestAppFeedbackType] = useState('Bug Report');
  const [guestAppFeedbackComment, setGuestAppFeedbackComment] = useState('');
  
  // Custom preferences states
  const [prefRoomType, setPrefRoomType] = useState('Deluxe Suite');
  const [prefBedType, setPrefBedType] = useState('King Bed');
  const [prefSmoking, setPrefSmoking] = useState('Non-Smoking');
  const [prefFloor, setPrefFloor] = useState('Upper Floor');
  const [prefCheckin, setPrefCheckin] = useState('12:00 PM');
  const [prefBudget, setPrefBudget] = useState('5000-8000');
  const [prefAmenities, setPrefAmenities] = useState(['WiFi', 'Swimming Pool', 'Spa']);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewExperience, setReviewExperience] = useState(5);
  const [reviewCleanliness, setReviewCleanliness] = useState(5);
  const [reviewBehavior, setReviewBehavior] = useState(5);
  const [reviewFood, setReviewFood] = useState(5);
  const [reviewService, setReviewService] = useState(5);
  const [reviewRecommend, setReviewRecommend] = useState('Yes');

  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Left Sidebar Collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Active Workspace Navigation View Tab
  const [activeTab, setActiveTab] = useState('explore');
  
  // Search Form Parameters
  const [searchCity, setSearchCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-07-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-07-14');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedRoomType, setSelectedRoomType] = useState('Deluxe Suite');

  // Breadcrumbs track
  const [breadcrumbs, setBreadcrumbs] = useState(['Explore', 'Search Stays']);

  // Dedicated Hotel Details View State
  const [viewingHotelDetail, setViewingHotelDetail] = useState(null);

  // Modals & Notifications
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Large Booking Engine Modal States
  const [bookingFormModalOpen, setBookingFormModalOpen] = useState(false);
  const [bookingSuccessModalOpen, setBookingSuccessModalOpen] = useState(false);
  const [bkGuestName, setBkGuestName] = useState('Arjun Mehta');
  const [bkGuestMobile, setBkGuestMobile] = useState('919005499821');
  const [bkGuestEmail, setBkGuestEmail] = useState('arjun@atithisphere.com');
  const [bkRoomsCount, setBkRoomsCount] = useState(1);
  const [bkAirportPickup, setBkAirportPickup] = useState(false);
  const [bkBreakfastIncluded, setBkBreakfastIncluded] = useState(true);
  const [bkSpecialRequests, setBkSpecialRequests] = useState('');

  // WhatsApp Floating chat
  const [waChatOpen, setWaChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'bot', text: 'Welcome Arjun! I am your AtithiSphere assistant. How can I help you with your booking or stay today?', time: '10:00 AM' }
  ]);

  // Wishlist state
  const [wishlist, setWishlist] = useState(['h-1']);

  // Guest bookings list
  const [myBookingsList, setMyBookingsList] = useState([
    {
      id: 'BK-5011',
      hotelName: 'Grand Palace Hotel & Spa',
      city: 'Mumbai',
      room: 'Deluxe Suite 305',
      checkIn: '2026-07-10',
      checkOut: '2026-07-14',
      guests: 2,
      totalPrice: 30000,
      status: 'Confirmed Stay',
      upcoming: true
    },
    {
      id: 'BK-4920',
      hotelName: 'Goa Coastal Palms Resort',
      city: 'Goa',
      room: 'Palms Cabana 104',
      checkIn: '2026-05-12',
      checkOut: '2026-05-15',
      guests: 2,
      totalPrice: 18600,
      status: 'Completed',
      upcoming: false
    }
  ]);

  // Service requests
  const [myRequests, setMyRequests] = useState([
    { id: 'REQ-102', type: 'Extra Towels', dept: 'Housekeeping', time: '10 mins ago', status: 'In Progress', icon: Brush, eta: '4 mins remaining' },
    { id: 'REQ-103', type: 'Mineral Water', dept: 'Food & Beverage', time: 'Just now', status: 'Pending Dispatch', icon: Utensils, eta: '12 mins remaining' }
  ]);

  // Help tickets
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-8801', type: 'Billing Enquiry', status: 'Closed', created: '2026-06-15', updated: '2026-06-16' }
  ]);

  // Problem reporting form
  const [problemCategory, setProblemCategory] = useState('Room Issue');
  const [problemDescription, setProblemDescription] = useState('');

  // Feedback rating
  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Mock Hotels
  const guestHotels = [
    {
      id: 'h-1',
      name: 'Grand Palace Hotel & Spa',
      city: 'Mumbai',
      price: 7500,
      rating: 4.8,
      reviews: 142,
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=400&q=80'
      ],
      description: 'Experience world-class luxury at the heart of Mumbai. Boasting sweeping sea views, Atithi Grand Palace offers state of the art amenities, clean rooms, and signature dining venues.',
      amenities: ['Free WiFi', 'Infinity Pool', 'Luxury Spa', 'Dining Room', 'Free Parking', 'Fitness Center', 'Room Service', 'Laundry Service'],
      attractions: ['Gateway of India (1.2 km)', 'Marine Drive (3.5 km)', 'Colaba Causeway (2.0 km)'],
      restaurants: ['Bayview Bistro', 'Spice Symphony Fine Dining'],
      weather: '28°C • Mostly Sunny',
      roomTypes: [
        { name: 'Deluxe Suite', price: 7500, available: 4 },
        { name: 'Executive Ocean Suite', price: 12000, available: 2 },
        { name: 'Presidential Penthouse', price: 25000, available: 1 }
      ]
    },
    {
      id: 'h-2',
      name: 'Goa Coastal Palms Resort',
      city: 'Goa',
      price: 6200,
      rating: 4.7,
      reviews: 98,
      img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80'
      ],
      description: 'Escape to a tropical beachside sanctuary. Indulge in custom pool-side drinks, white sand beach access, and live music dinners under palm trees.',
      amenities: ['Beachfront', 'Free WiFi', 'Bar & Lounge', 'Outdoor Pool', 'Free Parking', 'Fitness Center', 'Room Service', 'Laundry Service'],
      attractions: ['Baga Beach (0.5 km)', 'Fort Aguada (4.2 km)', 'Anjuna Market (2.8 km)'],
      restaurants: ['Palms Beach Grill', 'Tiki Lounge'],
      weather: '30°C • Breezy',
      roomTypes: [
        { name: 'Palms Queen Cabin', price: 6200, available: 3 },
        { name: 'Beachfront Suite', price: 9500, available: 2 }
      ]
    },
    {
      id: 'h-3',
      name: 'The Atithi Regency Suites',
      city: 'Pune',
      price: 4800,
      rating: 4.5,
      reviews: 64,
      img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Strategically located in Pune’s tech corridor. Features spacious workspaces, high-speed WiFi, conference halls, and premium bed comforts.',
      amenities: ['Free WiFi', 'Gym Center', 'Conference Hall', 'Valet Parking', 'Dining Room', 'Room Service'],
      attractions: ['Shaniwar Wada (1.5 km)', 'Aga Khan Palace (5.0 km)', 'Osho Ashram (3.2 km)'],
      restaurants: ['Regency Cafe', 'The Brew Lounge'],
      weather: '25°C • Pleasant',
      roomTypes: [
        { name: 'Business Comfort', price: 4800, available: 6 },
        { name: 'Executive Suite', price: 7200, available: 2 }
      ]
    }
  ];

  const filteredStays = useMemo(() => {
    return guestHotels.filter(h => {
      return h.name.toLowerCase().includes(searchCity.toLowerCase()) || h.city.toLowerCase().includes(searchCity.toLowerCase());
    });
  }, [searchCity]);

  const handleTabChange = (tab, label) => {
    setActiveTab(tab);
    setViewingHotelDetail(null);
    setBreadcrumbs(['Stay Hub', label]);
  };

  const handleOpenHotelDetail = (hotel) => {
    setViewingHotelDetail(hotel);
    setBreadcrumbs(['Explore Stays', hotel.name]);
  };

  const handleBackToExplore = () => {
    setViewingHotelDetail(null);
    setBreadcrumbs(['Explore Stays', 'Search Stays']);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    submitHotelReview({
      hotelId: viewingHotelDetail.id === 'h-1' ? 'hotel-1' : viewingHotelDetail.id === 'h-2' ? 'hotel-2' : 'hotel-3',
      guestName: 'Arjun Mehta',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      experienceRate: reviewExperience,
      cleanlinessRate: reviewCleanliness,
      behaviorRate: reviewBehavior,
      foodRate: reviewFood,
      serviceRate: reviewService,
      recommend: reviewRecommend
    });

    // Reset Review fields
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    setReviewExperience(5);
    setReviewCleanliness(5);
    setReviewBehavior(5);
    setReviewFood(5);
    setReviewService(5);
    setReviewRecommend('Yes');
    setReviewModalOpen(false);
  };

  const triggerWhatsAppDirect = (hotelName = 'Grand Palace Hotel & Spa', customMsgType = '') => {
    const hotelNumber = '919005499821';
    const guestName = 'Arjun Mehta';
    const bookingId = 'BK-5011';
    const roomNumber = 'Deluxe Suite 305';

    let customHeader = 'I would like assistance regarding my stay.';
    if (customMsgType) {
      customHeader = `I would like to request Guest Service: ${customMsgType}.`;
    }

    const message = `Hello,
${customHeader}

Hotel: ${hotelName}
Guest Name: ${guestName}
Booking ID: ${bookingId}
Room Number: ${roomNumber}

Please assist me.`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${hotelNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleSendWA = (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const userMsg = { id: `msg-u-${Date.now()}`, sender: 'guest', text: chatText, time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatText('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: `msg-b-${Date.now()}`, sender: 'bot', text: 'Service request updated. Feel free to check active status updates in Guest Services.', time: 'Just now' }
      ]);
    }, 1000);
  };

  const handleQuickConcierge = (itemType, customIcon = Coffee) => {
    const newReq = {
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      type: itemType,
      dept: ['Fresh Linen', 'Room Cleaning'].includes(itemType) ? 'Housekeeping' : 'Room Service',
      time: 'Just now',
      status: 'Pending Dispatch',
      icon: customIcon,
      eta: '10 mins remaining'
    };
    setMyRequests([newReq, ...myRequests]);
    setActiveTab('services');
    setBreadcrumbs(['Stay Hub', 'Guest Services']);
    triggerWhatsAppDirect('Grand Palace Hotel & Spa', itemType);
  };

  const handleReportProblem = (e) => {
    e.preventDefault();
    if (!problemDescription.trim()) return;
    const newTkt = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      type: problemCategory,
      status: 'Open',
      created: '2026-07-07',
      updated: '2026-07-07'
    };
    setSupportTickets([newTkt, ...supportTickets]);
    setProblemDescription('');
    alert('Problem report logged to support roster.');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    alert('Thank you for rating your stay experience!');
    setFeedbackText('');
  };

  const calculatedNights = useMemo(() => {
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  const activeCalculatedPrice = useMemo(() => {
    if (!viewingHotelDetail) return 0;
    const matchedRoom = viewingHotelDetail.roomTypes.find(r => r.name === selectedRoomType) || viewingHotelDetail.roomTypes[0];
    return matchedRoom.price * calculatedNights * guestCount;
  }, [viewingHotelDetail, selectedRoomType, calculatedNights, guestCount]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      darkMode ? 'dark bg-[#070913]' : 'bg-[#f8fafc]'
    }`}>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b flex items-center justify-between px-4 sm:px-6 h-16 transition-colors backdrop-blur-md bg-opacity-90 theme-card">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-650 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/10">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight leading-none">
              AtithiSphere
            </span>
            <span className="text-[7.5px] uppercase tracking-widest font-bold font-mono mt-0.5 theme-muted">Guest Workspace</span>
          </div>
        </div>

        {/* Global search stays */}
        <div className="hidden md:flex items-center relative max-w-xs w-full mx-8">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center theme-muted">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition theme-input"
            placeholder="Search city location..."
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-950 relative theme-fg"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2.5 w-64 rounded-2xl shadow-xl p-3 z-50 text-left text-xs space-y-2 animate-fade-in theme-card border">
                <h4 className="font-extrabold border-b pb-1.5">Stay Updates</h4>
                <div className="space-y-2 text-[10px]">
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                    <span className="font-bold block text-teal-450">✅ Stay Confirmed</span>
                    <span className="theme-muted">Your stay at Grand Palace Hotel & Spa is booked for July 10!</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-950 transition theme-fg"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User profiles dropdown */}
          <div className="relative pl-3 border-l theme-border">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-85 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
                A
              </div>
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 rounded-2xl shadow-xl p-2 z-50 text-left text-xs space-y-1 animate-fade-in theme-card border">
                <div className="px-3 py-2 border-b">
                  <span className="font-bold block">Arjun Mehta</span>
                  <span className="text-[9px] font-extrabold uppercase theme-muted">Guest Session</span>
                </div>
                <button
                  onClick={() => handleTabChange('profile-wishlist', 'Profile & Wishlist')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-950/50 rounded-lg transition block font-bold"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { alert('Logged out.'); window.location.href = '/'; }}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg font-bold block transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Body Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Collapsible Guest Navigation Sidebar */}
        <aside className={`hidden lg:flex flex-col border-r p-4 space-y-1.5 transition-all duration-300 relative theme-card ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 h-6 w-6 rounded-full flex items-center justify-center shadow-md z-20 hover:scale-105 theme-card border"
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          <div className="flex-1 flex flex-col space-y-1 overflow-y-auto font-bold">
            {[
              { name: 'Explore Stays', tab: 'explore', icon: Building },
              { name: 'My Stay Bookings', tab: 'my-bookings', icon: Calendar },
              { name: 'Guest Services', tab: 'services', icon: Coffee },
              { name: 'Help & Support', tab: 'help-support', icon: HelpCircle },
              { name: 'Wishlist & Profile', tab: 'profile-wishlist', icon: Heart },
              { name: 'Settings', tab: 'settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabChange(item.tab, item.name)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition w-full ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/15'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-900 theme-fg'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Workspace content frames */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-left theme-bg">
          
          {/* Breadcrumbs and previous page back buttons */}
          <div className="flex items-center justify-between border-b pb-3 theme-border">
            <div className="flex items-center gap-2 text-xs font-bold theme-muted">
              <button
                onClick={viewingHotelDetail ? handleBackToExplore : () => handleTabChange('explore', 'Explore Stays')}
                className="p-1.5 border rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition mr-2 theme-card"
                title="Back to previous page"
              >
                <ArrowLeft size={12} className="theme-fg" />
              </button>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight size={10} className="theme-muted" />}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-teal-400 font-extrabold font-mono uppercase tracking-wider' : ''}>{b}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* DEDICATED FULL-PAGE HOTEL DETAILS EXPERIENCE */}
          {viewingHotelDetail ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in items-start">
              
              {/* LEFT SIDE: Image Gallery, Name, Rating, Price, Description, Amenities, Room Types */}
              <div className="space-y-6 lg:col-span-1">
                
                {/* Image Gallery grid */}
                <div className="border rounded-3xl p-4 shadow-sm space-y-2 theme-card">
                  <img src={viewingHotelDetail.img} className="h-48 w-full object-cover rounded-2xl" alt={viewingHotelDetail.name} />
                  <div className="grid grid-cols-3 gap-2">
                    {viewingHotelDetail.gallery.map((imgSrc, index) => (
                      <img key={index} src={imgSrc} className="h-16 w-full object-cover rounded-xl border theme-border" alt="Preview" />
                    ))}
                  </div>
                </div>

                {/* Hotel Metadata info */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-3 theme-card">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-teal-400 font-extrabold flex items-center gap-0.5"><MapPin size={10} /> {viewingHotelDetail.city}</span>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">★ {viewingHotelDetail.rating} ({viewingHotelDetail.reviews} reviews)</span>
                  </div>
                  <h3 className="font-extrabold text-lg">{viewingHotelDetail.name}</h3>
                  <div className="text-sm font-black">
                    ₹{viewingHotelDetail.price.toLocaleString()} <span className="text-[10px] font-normal theme-muted">/ night basis</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium theme-muted">{viewingHotelDetail.description}</p>
                </div>

                {/* Amenities grid */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-3 theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Property Amenities</h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    {viewingHotelDetail.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check size={12} className="text-teal-500" /> {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Room Types */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-3 theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Available Room Selections</h4>
                  <div className="space-y-2">
                    {viewingHotelDetail.roomTypes.map((room, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] border-b pb-2 last:border-0 last:pb-0 theme-border">
                        <div>
                          <span className="font-bold block">{room.name}</span>
                          <span className="text-[9px] text-emerald-500 font-bold block">{room.available} units left</span>
                        </div>
                        <span className="font-black">₹{room.price.toLocaleString()}/night</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* CENTER SECTION: Detailed Policies, Check-in/out, Reviews, Ratings Breakdown */}
              <div className="space-y-6 lg:col-span-1">
                
                {/* Policies & Timings */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-4 theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Hotel Policies</h4>
                  <ul className="space-y-2 text-[11px] font-semibold">
                    <li className="flex justify-between"><span>Check-in Entry:</span> <span>12:00 PM onwards</span></li>
                    <li className="flex justify-between"><span>Check-out Departure:</span> <span>11:00 AM</span></li>
                    <li className="flex justify-between"><span>Cancellation terms:</span> <span className="text-teal-400">Free cancellation up to 24h</span></li>
                  </ul>
                </div>

                {/* Ratings Breakdown progress meters */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-3 theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Ratings Breakdown</h4>
                  <div className="space-y-2.5 text-[10px] font-bold">
                    <div>
                      <div className="flex justify-between mb-1 theme-muted"><span>Cleanliness</span> <span>4.9 / 5</span></div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: '98%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 theme-muted"><span>Location Rating</span> <span>4.8 / 5</span></div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: '96%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 theme-muted"><span>Service Dispatch</span> <span>4.7 / 5</span></div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: '94%' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Reviews Ledger */}
                <div className="border rounded-3xl p-5 shadow-sm space-y-3 theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Recent Stay Reviews</h4>
                  <div className="space-y-3 text-[10.5px]">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-left space-y-1 theme-border">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Arjun M.</span>
                        <span className="text-[8px] theme-muted">2 days ago</span>
                      </div>
                      <p className="font-semibold italic theme-muted">"Excellent room service and pool! The WhatsApp concierge widget helped order towel replacements in less than 5 mins."</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="w-full mt-2 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] rounded-xl shadow-md transition flex items-center justify-center gap-1"
                  >
                    <Star size={12} fill="white" /> Rate & Review this Hotel
                  </button>
                </div>

              </div>

              {/* RIGHT SIDE: Maps section, WhatsApp Widget, Booking Engine Form */}
              <div className="space-y-6 lg:col-span-1">
                
                {/* Navigation Coordinates */}
                <div className="border rounded-3xl p-5 space-y-4 shadow-sm theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Navigation Coordinates</h4>
                  <div className="bg-slate-950 border rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden h-40 theme-border">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-25"></div>
                    <svg className="w-full h-full relative z-10" viewBox="0 0 200 80">
                      <path d="M 10,65 C 50,45 100,60 180,20" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="10" cy="65" r="4" fill="#f43f5e" />
                      <circle cx="180" cy="20" r="5" fill="#14b8a6" />
                      <text x="15" y="72" fill="#cbd5e1" fontSize="7" fontWeight="bold">My Location</text>
                      <text x="135" y="15" fill="#cbd5e1" fontSize="7" fontWeight="bold">{viewingHotelDetail.city} Hotel</text>
                    </svg>
                  </div>
                </div>

                {/* WhatsApp concierge */}
                <div className="border rounded-3xl p-5 space-y-3 shadow-sm theme-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Direct WhatsApp Concierge</h4>
                  <button
                    onClick={() => triggerWhatsAppDirect(viewingHotelDetail.name)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-xl transition"
                  >
                    Open WhatsApp Concierge
                  </button>
                     {/* Booking checkout Engine */}
                <div className="border rounded-3xl p-5 space-y-3 shadow-xl border-teal-500/10 theme-card text-left">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider border-b pb-1.5 theme-border theme-muted">Stay Booking Engine</h4>
                  <p className="text-[10.5px] theme-muted font-semibold">Reserve your stay in just a few steps.</p>
                  <button
                    onClick={() => setBookingFormModalOpen(true)}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition mt-2"
                  >
                    BOOK NOW
                  </button>
                </div>             </div>

              </div>
            </div>
          ) : (
            /* EXPLORE & OTHER MAIN PORTAL TAB VIEWS */
            <div className="space-y-6">
              
              {/* Tab 1: Explore stays */}
              {activeTab === 'explore' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Welcome Hero banner */}
                  <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-teal-850">
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-teal-50/10 blur-[40px]"></div>
                    <div className="relative z-10 space-y-2 text-left">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-[9px] font-bold uppercase text-teal-300">
                        <Sparkles size={10} /> Stay Experience reimagined
                      </span>
                      <h2 className="text-xl md:text-3xl font-black">Find Your Perfect Stay</h2>
                      <p className="text-slate-350 text-xs max-w-xl">
                        Discover luxury villas, cozy suites, and premium hotel rooms pre-equipped with instant WhatsApp service dispatchers.
                      </p>
                    </div>
                  </div>

                  {/* Guest Booking style stay search selectors */}
                  <div className="border rounded-3xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end theme-card">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider theme-muted mb-1.5">Where are you going?</label>
                      <div className="relative">
                        <MapPin size={12} className="absolute left-3 top-2.5 theme-muted" />
                        <input
                          type="text"
                          value={searchCity}
                          onChange={(e) => setSearchCity(e.target.value)}
                          className="w-full rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-teal-500 transition font-bold theme-input border"
                          placeholder="Search Mumbai, Goa..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider theme-muted mb-1.5">Check-In Arrival</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 transition font-bold theme-input border"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider theme-muted mb-1.5">Check-Out Date</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 transition font-bold theme-input border"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider theme-muted mb-1.5">Guests Count</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 transition font-bold theme-input border"
                      />
                    </div>
                  </div>

                  {/* Stays cards */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider theme-muted">Featured & Recommended Stays</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredStays.map((h) => (
                        <div
                          key={h.id}
                          className="border rounded-3xl overflow-hidden hover:border-teal-500/40 hover:shadow-md transition duration-300 flex flex-col justify-between theme-card"
                        >
                          <div className="relative">
                            <img src={h.img} className="h-44 w-full object-cover" alt={h.name} />
                            <button
                              onClick={() => toggleWishlist(h.id)}
                              className="absolute top-3 right-3 p-2 bg-slate-950/60 backdrop-blur-md hover:bg-slate-950 text-white rounded-full transition"
                            >
                              <Heart size={14} className={wishlist.includes(h.id) ? 'fill-red-500 text-red-500' : 'text-white'} />
                            </button>
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[9px] text-teal-400 font-extrabold flex items-center gap-0.5"><MapPin size={10} /> {h.city}</span>
                              <span className="text-[9px] text-amber-500 font-bold">★ {h.rating} ({h.reviews} reviews)</span>
                            </div>
                            <h4 className="font-extrabold text-sm">{h.name}</h4>

                            <div className="flex flex-wrap gap-1">
                              {h.amenities.slice(0, 4).map((a, idx) => (
                                <span key={idx} className="px-2 py-0.5 border rounded text-[8px] font-bold theme-card">{a}</span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between border-t pt-3 mt-2 theme-border">
                              <div>
                                <span className="text-[9px] block theme-muted">Rate starting from</span>
                                <span className="text-xs font-black">₹{h.price.toLocaleString()}<span className="text-[9px] font-normal theme-muted">/night</span></span>
                              </div>
                              
                              <button
                                onClick={() => handleOpenHotelDetail(h)}
                                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-600 text-white text-[10px] font-bold rounded-xl transition"
                              >
                                View Details Stay
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: My Stay Bookings Page */}
              {activeTab === 'my-bookings' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Current Active Stays */}
                  <div className="space-y-4 text-left font-bold">
                    <h3 className="text-xs border-b pb-2 theme-border theme-muted">Active Stays</h3>
                    {myBookingsList.filter(b => b.upcoming).map((booking) => (
                      <div
                        key={booking.id}
                        className="border rounded-3xl p-6 space-y-4 shadow-md theme-card"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-450 text-[8.5px] font-extrabold uppercase font-mono tracking-wider border border-teal-500/20 shadow-sm mb-1.5 inline-block">
                              Booking ID: {booking.id}
                            </span>
                            <h4 className="font-extrabold text-sm mt-1">{booking.hotelName}</h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[9px] font-extrabold uppercase tracking-wide border theme-border">{booking.status}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b text-xs font-semibold theme-border theme-muted">
                          <div>
                            <span className="text-[8px] font-extrabold uppercase block tracking-wider theme-muted">Room Selection</span>
                            <span className="theme-fg block mt-0.5">{booking.room}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-extrabold uppercase block tracking-wider theme-muted">Check-in</span>
                            <span className="theme-fg block mt-0.5">{booking.checkIn}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-extrabold uppercase block tracking-wider theme-muted">Check-out</span>
                            <span className="theme-fg block mt-0.5">{booking.checkOut}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-extrabold uppercase block tracking-wider theme-muted">Stay Rate</span>
                            <span className="text-teal-450 block mt-0.5 font-bold">₹{booking.totalPrice.toLocaleString()} ({booking.guests} Guests)</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1.5">
                          <button
                            onClick={() => alert(`Modifying booking ${booking.id}...`)}
                            className="px-3.5 py-1.5 border hover:bg-slate-200 font-bold text-[10px] rounded-xl transition theme-card"
                          >
                            Modify Booking
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this booking?')) {
                                setMyBookingsList(prev => prev.filter(b => b.id !== booking.id));
                              }
                            }}
                            className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] rounded-xl hover:bg-red-500/20 transition"
                          >
                            Cancel Booking
                          </button>
                          <button
                            onClick={() => alert('Downloading booking confirmation PDF slip...')}
                            className="px-3.5 py-1.5 border hover:bg-slate-200 font-bold text-[10px] rounded-xl flex items-center gap-1 transition theme-card"
                          >
                            <Download size={12} /> Confirmation Slip
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Past Bookings history list */}
                  <div className="border rounded-3xl p-5 shadow-sm space-y-4 theme-card">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider border-b pb-2 theme-border theme-muted">Stay History</h3>
                    <div className="divide-y theme-border">
                      {myBookingsList.filter(b => !b.upcoming).map((bh) => (
                        <div key={bh.id} className="flex justify-between items-center py-3">
                          <div>
                            <h4 className="font-extrabold text-xs">{bh.hotelName}</h4>
                            <span className="text-[9px] block theme-muted">{bh.checkIn} to {bh.checkOut} • {bh.room}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 text-[9px] font-extrabold uppercase font-mono">{bh.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 3: Guest Services Page */}
              {activeTab === 'services' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Welcome banner */}
                  <div className="bg-gradient-to-r from-teal-950 to-slate-900 rounded-3xl p-6 text-white border border-teal-900/30">
                    <h3 className="font-black text-lg">Stay Desk Guest Services</h3>
                    <p className="text-slate-350 text-xs mt-1">Submit concierge water, dining, cleaning, or taxi tasks directly to check-in associates.</p>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: 'Housekeeping', icon: Brush, desc: 'General dust & tidy' },
                      { name: 'Fresh Linen', icon: Brush, desc: 'Extra towels & sheets' },
                      { name: 'Mineral Water', icon: Utensils, desc: 'Mineral drinking bottles' },
                      { name: 'Laundry Pick', icon: Wrench, desc: 'Clothes press pickup' },
                      { name: 'Taxi Cab', icon: Car, desc: 'Airport/transit bookings' },
                      { name: 'Wake-up Call', icon: Clock, desc: 'Morning alarm alert' },
                      { name: 'Late Checkout', icon: Clock, desc: 'Apply checkout extension' },
                      { name: 'AC Maintenance', icon: Wrench, desc: 'Cooling repair request' }
                    ].map((srv, i) => {
                      const SrvIcon = srv.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuickConcierge(srv.name, srv.icon)}
                          className="p-4 border hover:border-teal-500/40 rounded-2xl flex flex-col items-start gap-2 transition group theme-card"
                        >
                          <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-450 flex items-center justify-center group-hover:scale-105 transition"><SrvIcon size={14} /></div>
                          <div className="text-left mt-1.5">
                            <span className="font-bold text-xs block leading-none">{srv.name}</span>
                            <span className="text-[9px] block mt-1 leading-normal font-semibold theme-muted">{srv.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Services request list trackers */}
                  <div className="border rounded-3xl p-5 shadow-sm space-y-4 theme-card">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider border-b pb-2 theme-border theme-muted">Active Concierge Tasks</h3>
                    <div className="space-y-3">
                      {myRequests.map((req) => {
                        const ReqIcon = req.icon;
                        return (
                          <div key={req.id} className="flex items-center justify-between py-1 border-b pb-3 last:border-b-0 theme-border">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center"><ReqIcon size={14} /></div>
                              <div className="text-left">
                                <span className="font-bold text-xs block">{req.type}</span>
                                <span className="text-[9px] block font-semibold theme-muted">{req.dept} • {req.time}</span>
                              </div>
                            </div>
                            <div className="text-right font-bold">
                              <span className="text-[8.5px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block font-mono">{req.status}</span>
                              <span className="text-[8px] block mt-0.5 font-semibold theme-muted">ETA: {req.eta}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 4: Help & Support Page */}
              {activeTab === 'help-support' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-3xl p-5 space-y-4 shadow-sm theme-card">
                      <h3 className="text-xs font-bold border-b pb-2 theme-border flex items-center gap-2"><Phone size={14} className="text-teal-500" /> Contact Hotel</h3>
                      <div className="space-y-2.5 text-[11px] font-bold">
                        <div className="flex items-center justify-between"><span>Reception Call:</span> <span className="text-teal-450 hover:underline cursor-pointer">+91 22 90054-99821</span></div>
                        <div className="flex items-center justify-between"><span>Email Desk:</span> <span className="text-teal-450 hover:underline cursor-pointer">concierge@atithisphere.com</span></div>
                        <button onClick={() => setWaChatOpen(true)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-[10px]">Chat on WhatsApp</button>
                      </div>
                    </div>

                    <div className="border rounded-3xl p-5 space-y-4 shadow-sm theme-card">
                      <h3 className="text-xs font-bold border-b pb-2 theme-border flex items-center gap-2"><ShieldAlert size={14} className="text-red-500" /> Emergency Assistance</h3>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => alert('Dialing reception emergency...')} className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] rounded-xl hover:bg-red-500/20 transition">Call Reception (Emergency)</button>
                      </div>
                    </div>
                  </div>

                  {/* Report problem form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-3xl p-5 space-y-4 shadow-sm theme-card">
                      <h3 className="text-xs font-bold border-b pb-2 theme-border">Report a Problem</h3>
                      <form onSubmit={handleReportProblem} className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Issue Category</label>
                          <select
                            value={problemCategory}
                            onChange={(e) => setProblemCategory(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-bold theme-input border"
                          >
                            <option value="Room Issue">Room Issue</option>
                            <option value="Payment Issue">Payment Issue</option>
                            <option value="Staff Issue">Staff Issue</option>
                            <option value="App Issue">App Issue</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Problem Description</label>
                          <textarea
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl text-xs outline-none theme-input border"
                            placeholder="Detail issues..."
                          />
                        </div>

                        <button type="submit" className="w-full py-2 bg-teal-600 hover:bg-teal-600 text-white font-bold rounded-xl text-[10px]">Log Support Ticket</button>
                      </form>
                    </div>

                    <div className="border rounded-3xl p-5 space-y-4 shadow-sm theme-card">
                      <h3 className="text-xs font-bold border-b pb-2 theme-border">Feedback & Ratings</h3>
                      <form onSubmit={handleSubmitFeedback} className="space-y-3">
                        <div className="flex gap-1.5 items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingVal(star)}
                              className="text-amber-500 hover:scale-105 transition"
                            >
                              <Star size={16} className={ratingVal >= star ? 'fill-amber-500' : ''} />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl text-xs outline-none theme-input border"
                          placeholder="Submit feedback..."
                        />
                        <button type="submit" className="w-full py-2 bg-slate-950 hover:bg-slate-900 border text-white font-bold rounded-xl text-[10px] theme-border">Submit Rating</button>
                      </form>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 5: Wishlist & Profile Settings */}
              {activeTab === 'profile-wishlist' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-left font-bold">
                  
                  <div className="border rounded-3xl p-5 shadow-sm space-y-4 theme-card">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider border-b pb-2 theme-border theme-muted">Profile Overview</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-sm">A</div>
                      <div>
                        <h4 className="font-extrabold text-xs">Arjun Mehta</h4>
                        <span className="text-[9px] font-bold uppercase font-mono theme-muted">Active stay guest</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 border rounded-3xl p-5 shadow-sm space-y-4 theme-card">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider border-b pb-2 theme-border theme-muted">Saved Wishlist Hotels</h3>
                    <div className="space-y-3">
                      {wishlist.map((hotelId) => {
                        const hotel = guestHotels.find(h => h.id === hotelId);
                        if (!hotel) return null;
                        return (
                          <div key={hotel.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl flex items-center justify-between theme-border">
                            <div>
                              <h4 className="font-bold text-xs">{hotel.name}</h4>
                              <span className="text-[9px] block theme-muted">{hotel.city} • Starting from ₹{hotel.price}/night</span>
                            </div>
                            <button onClick={() => toggleWishlist(hotel.id)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-950 text-red-500 rounded-xl transition">
                              <Heart size={14} className="fill-red-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Guest Settings Page */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in text-left font-bold">
                  
                  {/* Title & Preferences header */}
                  <div className="border-b pb-3 theme-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-black">Account Settings & Preferences</h3>
                      <p className="text-[11px] theme-muted mt-0.5 font-bold">Manage your traveler profile, notification preferences, and budget limits</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPrefRoomType('Deluxe Suite');
                          setPrefBedType('King Bed');
                          setPrefSmoking('Non-Smoking');
                          setPrefFloor('Upper Floor');
                          setPrefBudget('5000-8000');
                          setPrefAmenities(['WiFi', 'Swimming Pool', 'Spa']);
                          alert('Preferences reset to traveler defaults.');
                        }}
                        className="px-3.5 py-1.5 border hover:bg-slate-200 dark:hover:bg-slate-950 font-bold text-[10px] rounded-xl transition theme-card"
                      >
                        Reset Defaults
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Preferences saved and synced to cloud profile.')}
                        className="px-3.5 py-1.5 bg-teal-650 hover:bg-teal-600 text-white font-bold text-[10px] rounded-xl shadow transition"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>

                  {/* Settings grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Settings Sub-sidebar Categories */}
                    <div className="lg:col-span-1 space-y-3">
                      <div className="border rounded-2xl p-4 shadow-sm space-y-3.5 theme-card">
                        
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center theme-muted"><Search size={12} /></span>
                          <input
                            type="text"
                            value={guestSettingsSearch}
                            onChange={(e) => setGuestSettingsSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-[10px] focus:outline-none focus:border-teal-500 transition font-bold theme-input border"
                            placeholder="Search preferences..."
                          />
                        </div>

                        <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-1">
                          {[
                            { id: 'profile', label: 'Personal Profile', icon: User },
                            { id: 'account', label: 'Security & Password', icon: Key },
                            { id: 'booking-pref', label: 'Stay Preferences', icon: ClipboardList },
                            { id: 'travel-pref', label: 'Travel Preferences', icon: Compass },
                            { id: 'notify-pref', label: 'Notification Settings', icon: Bell },
                            { id: 'payments', label: 'Saved Payments', icon: CreditCard },
                            { id: 'region-pref', label: 'Language & Currency', icon: Navigation },
                            { id: 'privacy', label: 'Privacy Preferences', icon: ShieldCheck },
                            { id: 'feedback', label: 'Platform Feedback', icon: MessageSquare }
                          ]
                            .filter(item => !guestSettingsSearch || item.label.toLowerCase().includes(guestSettingsSearch.toLowerCase()))
                            .map((item) => {
                              const SecIcon = item.icon;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => setGuestSettingsSection(item.id)}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold text-left transition ${
                                    guestSettingsSection === item.id
                                      ? 'bg-teal-500/10 text-teal-450 border border-teal-500/20'
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent theme-fg'
                                  }`}
                                >
                                  <SecIcon size={12} className="shrink-0" />
                                  <span className="truncate">{item.label}</span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {/* Settings Form panel */}
                    <div className="lg:col-span-3 border rounded-3xl p-5 shadow-sm theme-card text-xs font-bold space-y-4">
                      
                      {/* Section 1: Profile */}
                      {guestSettingsSection === 'profile' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Personal Guest Profile</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block theme-muted mb-1">Full Name</label>
                              <input type="text" defaultValue="Arjun Mehta" className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Mobile Number</label>
                              <input type="text" defaultValue="+91 91900 54998" className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Email Address</label>
                              <input type="email" defaultValue="arjun@atithisphere.com" className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Nationality</label>
                              <input type="text" defaultValue="Indian" className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 2: Account */}
                      {guestSettingsSection === 'account' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Security & Password</h4>
                          <div className="max-w-md space-y-3.5">
                            <div>
                              <label className="block theme-muted mb-1">Current Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">New Password</label>
                              <input type="password" placeholder="Type new password..." className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none" />
                            </div>
                            <button type="button" onClick={() => alert('Password updated successfully.')} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl">Update Password</button>
                          </div>
                        </div>
                      )}

                      {/* Section 3: Booking Preferences */}
                      {guestSettingsSection === 'booking-pref' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Default Stay Preferences</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block theme-muted mb-1">Preferred Room Type</label>
                              <select value={prefRoomType} onChange={(e) => setPrefRoomType(e.target.value)} className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none">
                                <option value="Standard Queen">Standard Queen</option>
                                <option value="Deluxe Suite">Deluxe Suite</option>
                                <option value="Penthouse Cabin">Penthouse Cabin</option>
                              </select>
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Preferred Bed Type</label>
                              <select value={prefBedType} onChange={(e) => setPrefBedType(e.target.value)} className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none">
                                <option value="King Bed">King Bed</option>
                                <option value="Twin Single">Twin Single</option>
                              </select>
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Smoking Policy</label>
                              <select value={prefSmoking} onChange={(e) => setPrefSmoking(e.target.value)} className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none">
                                <option value="Smoking">Smoking Room</option>
                                <option value="Non-Smoking">Non-Smoking Room</option>
                              </select>
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Preferred Floor level</label>
                              <select value={prefFloor} onChange={(e) => setPrefFloor(e.target.value)} className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none">
                                <option value="Upper Floor">Upper Floors</option>
                                <option value="Ground Floor">Ground Floor</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 4: Travel Preferences */}
                      {guestSettingsSection === 'travel-pref' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Travel & Budget Profile</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block theme-muted mb-1">Preferred Budget Range (INR)</label>
                              <select value={prefBudget} onChange={(e) => setPrefBudget(e.target.value)} className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none">
                                <option value="2000-4000">₹2,000 - ₹4,000 / night</option>
                                <option value="5000-8000">₹5,000 - ₹8,000 / night</option>
                                <option value="10000+">₹10,000+ / night</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block theme-muted">Select Preferred Amenities</label>
                            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                              {['WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Parking'].map((am) => (
                                <label key={am} className="flex items-center gap-2 cursor-pointer theme-fg">
                                  <input
                                    type="checkbox"
                                    checked={prefAmenities.includes(am)}
                                    onChange={() => {
                                      setPrefAmenities(prev =>
                                        prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am]
                                      );
                                    }}
                                    className="rounded border-slate-300 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950"
                                  />
                                  <span>{am}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 5: Notifications */}
                      {guestSettingsSection === 'notify-pref' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Notification Subscriptions</h4>
                          <div className="space-y-2 text-[10.5px]">
                            <label className="flex items-center gap-2.5 cursor-pointer theme-fg py-1">
                              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                              <span>Booking confirmations via WhatsApp bot messages</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer theme-fg py-1">
                              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                              <span>Service request dispatch timers & updates</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer theme-fg py-1">
                              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-teal-655 focus:ring-teal-500 h-4 w-4 bg-slate-950" />
                              <span>Email notifications for upcoming checkins</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Section 6: Payments */}
                      {guestSettingsSection === 'payments' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Saved Payment Options</h4>
                          <div className="space-y-2 text-[10px]">
                            <div className="p-3 border rounded-2xl flex justify-between items-center theme-border">
                              <span className="font-extrabold flex items-center gap-1.5">💳 HDFC Debit Card (•••• 4920)</span>
                              <span className="text-[9px] uppercase tracking-wider theme-muted">Default</span>
                            </div>
                            <div className="p-3 border rounded-2xl flex justify-between items-center theme-border">
                              <span className="font-extrabold">📱 UPI ID (arjun@okaxis)</span>
                              <button onClick={() => alert('Removed saved payment ID.')} className="text-red-500 hover:underline">Delete</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 7: Region */}
                      {guestSettingsSection === 'region-pref' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Language & Currency preferences</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block theme-muted mb-1">Preferred Language</label>
                              <select className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border">
                                <option>English (UK)</option>
                                <option>Hindi</option>
                              </select>
                            </div>
                            <div>
                              <label className="block theme-muted mb-1">Base Currency</label>
                              <select className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border">
                                <option>INR (₹)</option>
                                <option>USD ($)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 8: Privacy */}
                      {guestSettingsSection === 'privacy' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Privacy & Data Handling</h4>
                          <div className="space-y-2.5">
                            <p className="text-[10.5px] theme-muted">Manage how AtithiSphere processes your data profiles for personalized booking alerts.</p>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => alert('Initiating profile data archive download...')} className="px-4 py-2 border rounded-xl font-bold text-[10px] theme-card">Download Data Profile</button>
                              <button type="button" onClick={() => alert('All search history wiped.')} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] rounded-xl">Clear Search History</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 9: Platform App Feedback */}
                      {guestSettingsSection === 'feedback' && (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black border-b pb-2 theme-border">Submit Platform Feedback</h4>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!guestAppFeedbackComment.trim()) return;
                              submitAppFeedback({
                                userName: 'Arjun Mehta',
                                role: 'Guest',
                                type: guestAppFeedbackType,
                                comment: guestAppFeedbackComment
                              });
                              alert('Thank you! App feedback registered successfully.');
                              setGuestAppFeedbackComment('');
                            }}
                            className="space-y-3.5 text-xs font-bold"
                          >
                            <div>
                              <label className="block theme-muted mb-1">Feedback Category</label>
                              <select
                                value={guestAppFeedbackType}
                                onChange={(e) => setGuestAppFeedbackType(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl font-bold theme-input border outline-none"
                              >
                                <option value="Bug Report">Bug Report</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Suggestion">Suggestion</option>
                                <option value="Complaint">Platform Complaint</option>
                              </select>
                            </div>

                            <div>
                              <label className="block theme-muted mb-1">Detail Comment</label>
                              <textarea
                                value={guestAppFeedbackComment}
                                onChange={(e) => setGuestAppFeedbackComment(e.target.value)}
                                required
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl text-xs outline-none theme-input border font-medium"
                                placeholder="Describe bugs, platform suggestions, or features you'd like to see..."
                              />
                            </div>

                            <button type="submit" className="px-5 py-2 bg-teal-655 hover:bg-teal-600 text-white font-bold rounded-xl shadow transition">
                              Send Feedback
                            </button>
                          </form>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Floating Action Button for Quick Actions */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <button
          onClick={() => triggerWhatsAppDirect()}
          className="h-12 w-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition"
          title="Chat on WhatsApp"
        >
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.428 2.023 13.96 1 11.993 1 6.556 1 2.13 5.37 2.127 10.8c-.001 1.774.475 3.506 1.378 5.027l-.95 3.473 3.565-.935zm11.393-7.235c-.328-.164-1.94-.959-2.24-1.07-.3-.11-.52-.165-.74.165-.22.33-.85 1.07-1.04 1.28-.19.21-.38.24-.7.08-.328-.164-1.385-.51-2.637-1.63-1-.89-1.674-1.99-1.87-2.32-.2-.33-.02-.508.144-.67.147-.145.327-.384.49-.575.16-.19.22-.33.33-.55.11-.22.05-.41-.02-.575-.07-.165-.74-1.785-1.01-2.44-.268-.644-.543-.556-.742-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.17 3.17 1.33 3.39c.16.22 2.3 3.52 5.58 4.94.78.34 1.395.54 1.87.69.782.25 1.493.21 2.055.13.628-.09 1.94-.79 2.21-1.56.27-.77.27-1.43.19-1.56-.08-.13-.3-.21-.63-.37z"/>
          </svg>
        </button>
      </div>

      {/* Large Professional Booking Modal */}
      {bookingFormModalOpen && viewingHotelDetail && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl p-6 md:p-8 text-left space-y-6 relative animate-fade-in theme-card border max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setBookingFormModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-950 transition theme-fg"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="text-base md:text-lg font-black flex items-center gap-2">
                <Calendar size={20} className="text-teal-500" /> Stay Booking Reservation
              </h3>
              <p className="text-xs theme-muted font-bold mt-1">Configure your stay parameters and review rates.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBookingFormModalOpen(false);
                setBookingSuccessModalOpen(true);
              }}
              className="space-y-6 text-slate-805 dark:text-slate-250"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Guest Information */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider border-b pb-1 theme-border theme-muted">Guest Information</h4>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Full Name</label>
                    <input
                      type="text"
                      value={bkGuestName}
                      onChange={(e) => setBkGuestName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold theme-input border outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={bkGuestMobile}
                      onChange={(e) => setBkGuestMobile(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold theme-input border outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Email Address</label>
                    <input
                      type="email"
                      value={bkGuestEmail}
                      onChange={(e) => setBkGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold theme-input border outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider border-b pb-1 theme-border theme-muted">Booking Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl text-[10px] font-bold theme-input border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl text-[10px] font-bold theme-input border"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Guests</label>
                      <input
                        type="number"
                        min={1}
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-bold theme-input border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Rooms count</label>
                      <input
                        type="number"
                        min={1}
                        value={bkRoomsCount}
                        onChange={(e) => setBkRoomsCount(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-bold theme-input border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Room Class</label>
                    <select
                      value={selectedRoomType}
                      onChange={(e) => setSelectedRoomType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl text-xs font-bold theme-input border"
                    >
                      {viewingHotelDetail.roomTypes.map((r, i) => (
                        <option key={i} value={r.name}>{r.name} (₹{r.price}/night)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Preferences & Summary */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider border-b pb-1 theme-border theme-muted">Additional Options</h4>
                  <div className="flex flex-col gap-2 text-xs font-bold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bkAirportPickup}
                        onChange={(e) => setBkAirportPickup(e.target.checked)}
                        className="rounded accent-teal-500"
                      />
                      <span>Airport Pickup Service</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bkBreakfastIncluded}
                        onChange={(e) => setBkBreakfastIncluded(e.target.checked)}
                        className="rounded accent-teal-500"
                      />
                      <span>Breakfast Buffet Included</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider theme-muted mb-1">Special Requests</label>
                    <textarea
                      value={bkSpecialRequests}
                      onChange={(e) => setBkSpecialRequests(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl text-xs theme-input border outline-none"
                      placeholder="e.g. Higher floor..."
                    />
                  </div>
                </div>

              </div>

              {/* Cost Summary block */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/65 rounded-2xl border theme-border space-y-2 text-xs font-bold text-left">
                <span className="text-[9px] uppercase tracking-widest theme-muted block font-mono">Invoice Stay Summary</span>
                <div className="flex justify-between">
                  <span className="theme-muted">Stay Base Rate ({calculatedNights} Nights × {bkRoomsCount} Room):</span>
                  <span>₹{((viewingHotelDetail.roomTypes.find(r => r.name === selectedRoomType)?.price || viewingHotelDetail.price) * calculatedNights * bkRoomsCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-muted">Taxes & GST (18%):</span>
                  <span>₹{(((viewingHotelDetail.roomTypes.find(r => r.name === selectedRoomType)?.price || viewingHotelDetail.price) * calculatedNights * bkRoomsCount) * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 theme-border text-teal-400 text-sm font-black">
                  <span>Estimated Net Cost:</span>
                  <span>
                    ₹{(
                      ((viewingHotelDetail.roomTypes.find(r => r.name === selectedRoomType)?.price || viewingHotelDetail.price) * calculatedNights * bkRoomsCount) * 1.18
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setBookingFormModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-xs theme-card hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Confirm & Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Modal Popup */}
      {bookingSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 text-center space-y-4 relative animate-fade-in theme-card border shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={24} />
            </div>

            <h3 className="font-extrabold text-base">Booking Request Submitted</h3>
            <p className="text-xs theme-muted font-bold px-2">
              Booking request submitted successfully. Our hotel team will contact you shortly via WhatsApp.
            </p>

            <div className="flex flex-col gap-2 pt-3">
              <button
                onClick={() => {
                  setBookingSuccessModalOpen(false);
                  triggerWhatsAppDirect(viewingHotelDetail?.name || 'Grand Palace Hotel', 'Booking Stay Reservation Enquiry');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                Contact on WhatsApp
              </button>
              <button
                onClick={() => setBookingSuccessModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold theme-fg hover:bg-slate-200 transition"
              >
                Return to Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate & Review this Hotel Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl p-6 relative animate-fade-in theme-card border shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3 theme-border">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5"><Star size={16} fill="teal" className="text-teal-500" /> Rate & Review Hotel</h3>
              <button onClick={() => setReviewModalOpen(false)} className="theme-muted hover:theme-fg"><X size={16} /></button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-bold text-left">
              {/* Star Rating select */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block theme-muted mb-1">Overall Rating (1-5 Stars)</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-2 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block theme-muted mb-1">Would Recommend? (Yes/No)</label>
                  <select
                    value={reviewRecommend}
                    onChange={(e) => setReviewRecommend(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Title & Comment */}
              <div className="space-y-3">
                <div>
                  <label className="block theme-muted mb-1">Review Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Magnificent stay!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block theme-muted mb-1">Feedback Comment</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe your stay, services, and staff experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                  />
                </div>
              </div>

              {/* Breakdowns */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border theme-border rounded-2xl space-y-3">
                <span className="text-[9px] uppercase tracking-wider theme-muted block font-mono border-b pb-1.5 theme-border">Stay Experience Breakdown</span>
                
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <label className="block theme-muted mb-0.5">Stay Experience</label>
                    <select
                      value={reviewExperience}
                      onChange={(e) => setReviewExperience(parseInt(e.target.value))}
                      className="w-full rounded-lg px-2 py-1 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}/5</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block theme-muted mb-0.5">Room Cleanliness</label>
                    <select
                      value={reviewCleanliness}
                      onChange={(e) => setReviewCleanliness(parseInt(e.target.value))}
                      className="w-full rounded-lg px-2 py-1 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}/5</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block theme-muted mb-0.5">Staff Behaviour</label>
                    <select
                      value={reviewBehavior}
                      onChange={(e) => setReviewBehavior(parseInt(e.target.value))}
                      className="w-full rounded-lg px-2 py-1 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}/5</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block theme-muted mb-0.5">Food Quality</label>
                    <select
                      value={reviewFood}
                      onChange={(e) => setReviewFood(parseInt(e.target.value))}
                      className="w-full rounded-lg px-2 py-1 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}/5</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block theme-muted mb-0.5">Service Quality</label>
                    <select
                      value={reviewService}
                      onChange={(e) => setReviewService(parseInt(e.target.value))}
                      className="w-full rounded-lg px-2 py-1 theme-input border focus:outline-none focus:border-teal-500 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}/5</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-xs theme-card hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
