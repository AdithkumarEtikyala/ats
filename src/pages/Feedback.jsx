import React, { useContext, useState, useMemo } from 'react';
import { FeedbackContext } from '../contexts/FeedbackContext';
import { HotelContext } from '../contexts/HotelContext';
import { AuthContext } from '../contexts/AuthContext';
import { Star, Search, SlidersHorizontal, Trash2, CheckCircle2, MessageSquare, Info, ShieldAlert, AlertCircle } from 'lucide-react';

export default function Feedback() {
  const { hotelFeedback, appFeedback, resolveAppFeedback } = useContext(FeedbackContext);
  const { hotels, activeHotel, selectHotel } = useContext(HotelContext);
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel' or 'app'
  const [selectedHotelId, setSelectedHotelId] = useState(activeHotel?.id || 'All');
  const [starFilter, setStarFilter] = useState('All');
  const [appTypeFilter, setAppTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'highest', 'lowest'

  // Restrict hotel selector dropdown based on ownership
  const ownerHotels = useMemo(() => {
    if (user?.role === 'Super Admin') return hotels;
    if (user?.role === 'Hotel Owner') {
      // Suresh Mehta owns hotel-1 (Mumbai) and hotel-2 (Goa)
      if (user.email === 'owner1@atithisphere.com') {
        return hotels.filter(h => h.id === 'hotel-1' || h.id === 'hotel-2');
      }
      return hotels.filter(h => h.id === user.hotelId);
    }
    return hotels.filter(h => h.id === user?.hotelId);
  }, [hotels, user]);

  const activeScopeHotelId = useMemo(() => {
    if (activeHotel) return activeHotel.id;
    if (user?.role === 'Manager' || user?.role === 'Front Desk') {
      return user.hotelId;
    }
    return selectedHotelId;
  }, [activeHotel, user, selectedHotelId]);

  // Filter and Sort hotel reviews
  const filteredHotelReviews = useMemo(() => {
    let reviews = hotelFeedback.filter(r => !activeScopeHotelId || activeScopeHotelId === 'All' || r.hotelId === activeScopeHotelId);

    if (starFilter !== 'All') {
      reviews = reviews.filter(r => r.rating === parseInt(starFilter));
    }

    if (searchQuery) {
      reviews = reviews.filter(r =>
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'latest') {
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'highest') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      reviews.sort((a, b) => a.rating - b.rating);
    }

    return reviews;
  }, [hotelFeedback, activeScopeHotelId, starFilter, searchQuery, sortBy]);

  // App feedback
  const filteredAppFeedback = useMemo(() => {
    let items = appFeedback;

    if (appTypeFilter !== 'All') {
      items = items.filter(item => item.type === appTypeFilter);
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [appFeedback, appTypeFilter, searchQuery]);

  // Analytics Calculations
  const averageRating = useMemo(() => {
    const reviews = hotelFeedback.filter(r => r.hotelId === activeScopeHotelId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [hotelFeedback, activeScopeHotelId]);

  const ratingDistribution = useMemo(() => {
    const reviews = hotelFeedback.filter(r => r.hotelId === activeScopeHotelId);
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (dist[r.rating] !== undefined) dist[r.rating]++;
    });
    return dist;
  }, [hotelFeedback, activeScopeHotelId]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Feedback & Guest Reviews</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.role === 'Super Admin' ? 'Platform-wide feedback hub & SaaS quality controller' : 'Monitor guest experience, reviews, and satisfaction scores'}
          </p>
        </div>

        {user?.role === 'Super Admin' && (
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850">
            <button
              onClick={() => setActiveTab('hotel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'hotel' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hotel Reviews
            </button>
            <button
              onClick={() => setActiveTab('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'app' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Platform Feedback
            </button>
          </div>
        )}
      </div>

      {activeTab === 'hotel' ? (
        <div className="space-y-6">
          
          {/* Top Selection & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Hotel Selector (For Admins and Owners) */}
            {['Super Admin', 'Hotel Owner'].includes(user?.role) && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5 shadow-sm">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Scope Property</span>
                <select
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 text-xs font-bold rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-200 transition"
                >
                  {!activeHotel && <option value="All">All Hotels</option>}
                  {ownerHotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Star Filter */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Filter by Stars</span>
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-200 transition"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Sort Order</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-200 transition"
              >
                <option value="latest">Latest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Feedback Analytics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Avg Rating Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Average Score</span>
              <div className="text-5xl font-black text-slate-800 dark:text-slate-100">{averageRating || 'N/A'}</div>
              <div className="flex gap-0.5 text-amber-500 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(averageRating) ? '#f59e0b' : 'none'} className="stroke-amber-500" />
                ))}
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Based on {filteredHotelReviews.length} total stays</span>
            </div>

            {/* Rating Distribution Progress */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-xs font-bold text-slate-550 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-450 border-b dark:border-slate-800 pb-1.5">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map((s) => {
                const count = ratingDistribution[s] || 0;
                const total = filteredHotelReviews.length || 1;
                const pct = ((count / total) * 100).toFixed(0);
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-8">{s} Star</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-6 text-right font-mono text-[10px]">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Hotel Performance Sentiment Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-xs font-bold text-slate-550 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-455 border-b dark:border-slate-800 pb-1.5">Satisfaction Trends</h4>
              <div className="space-y-2 text-[10.5px]">
                <div className="flex justify-between"><span>Most Mentioned Positive:</span> <span className="text-emerald-500">Concierge Bot response</span></div>
                <div className="flex justify-between"><span>Most Mentioned Complaint:</span> <span className="text-amber-500">Dining hall delays</span></div>
                <div className="flex justify-between"><span>SLA compliance level:</span> <span className="text-teal-500">96.8% compliant</span></div>
                <div className="flex justify-between"><span>Recommend Rate:</span> <span className="text-teal-500">100% recommended</span></div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Search size={14} /></span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-sm"
              placeholder="Search guest reviews content..."
            />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredHotelReviews.length > 0 ? (
              filteredHotelReviews.map((rev) => (
                <div key={rev.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left space-y-3 transition duration-300 hover:border-slate-300 dark:hover:border-slate-700">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-100">{rev.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 font-bold">{rev.guestName}</span>
                        <span className="h-1 w-1 bg-slate-300 dark:bg-slate-800 rounded-full"></span>
                        <span className="text-[9px] text-slate-450 font-mono font-bold">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill={s <= rev.rating ? '#f59e0b' : 'none'} className="stroke-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold italic">"{rev.comment}"</p>

                  {/* Service breakdowns */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t dark:border-slate-850 text-[9px] font-extrabold text-slate-450 uppercase">
                    <div>Cleanliness: <span className="text-teal-400">{rev.cleanlinessRate}/5</span></div>
                    <div>Staff Behavior: <span className="text-teal-400">{rev.behaviorRate}/5</span></div>
                    <div>Food Quality: <span className="text-teal-400">{rev.foodRate}/5</span></div>
                    <div>Service Score: <span className="text-teal-400">{rev.serviceRate}/5</span></div>
                    <div>Recommend: <span className={rev.recommend === 'Yes' ? 'text-emerald-500' : 'text-red-500'}>{rev.recommend}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-450 font-bold text-xs space-y-2">
                <AlertCircle size={20} className="mx-auto text-slate-500" />
                <p>No guest reviews match the selected filters.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* APP PLATFORM FEEDBACK TAB (Super Admin Only) */
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Feedback Category</span>
              <select
                value={appTypeFilter}
                onChange={(e) => setAppTypeFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-200 transition"
              >
                <option value="All">All Reports</option>
                <option value="Bug Report">Bug Reports</option>
                <option value="Feature Request">Feature Requests</option>
                <option value="Suggestion">Suggestions</option>
                <option value="Complaint">Complaints</option>
              </select>
            </div>
          </div>

          {/* App feedback listings */}
          <div className="space-y-4">
            {filteredAppFeedback.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition hover:border-slate-350 dark:hover:border-slate-750">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-teal-500/10 text-teal-650 dark:text-teal-400 px-2 py-0.5 rounded font-mono">
                      {item.type}
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{item.userName} ({item.role})</span>
                    <span className="text-[8px] text-slate-450 font-mono font-bold">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold italic">"{item.comment}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase ${
                    item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                    item.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {item.status}
                  </span>

                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveAppFeedback(item.id, 'Resolved')}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold text-[9px] rounded-lg transition"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
