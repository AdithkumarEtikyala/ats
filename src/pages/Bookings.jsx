import React, { useContext, useState, useEffect } from 'react';
import { HotelContext } from '../contexts/HotelContext';
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import api from '../utils/api';
import { Calendar, Search, Plus, Trash2, Edit, X, User } from 'lucide-react';

export default function Bookings() {
  const { activeHotel } = useContext(HotelContext);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('Atithi Dining Hall');
  const [room, setRoom] = useState('');
  const [type, setType] = useState('Standard Queen');
  const [amount, setAmount] = useState(6000);

  const [activeTab, setActiveTab] = useState('stays');

  useEffect(() => {
    let q = collection(db, 'bookings');
    if (activeHotel && activeHotel.id !== 'all') {
      q = query(collection(db, 'bookings'), where('hotelId', '==', activeHotel.id));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(list);
    });

    return () => unsubscribe();
  }, [activeHotel]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'guests') {
      setActiveTab('guests');
    } else {
      setActiveTab('stays');
    }
  }, [window.location.search]);

  const handleAddBooking = async (e) => {
    e.preventDefault();
    const newBk = {
      hotelId: activeHotel?.id || '',
      guestName: name,
      guestPhone: "+91 99999 55555",
      restaurantName: restaurantName,
      roomNumber: room,
      roomType: type,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: 'confirmed',
      amount: Number(amount)
    };

    try {
      await api.post('/api/bookings', newBk);
      setModalOpen(false);
      setName('');
      setRoom('');
    } catch (err) {
      console.error('Failed to create booking via backend:', err);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await api.put(`/api/bookings/${id}/status`, { status: nextStatus });
    } catch (err) {
      console.error('Failed to update booking status via backend:', err);
    }
  };

  const filteredBookings = bookings
    .filter((b) => !activeHotel || b.hotelId === activeHotel.id)
    .filter((b) => (b.guestName || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Guest Booking Ledger</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage room reservations and registration statuses</p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-550 focus:outline-none focus:border-teal-500 transition"
              placeholder="Search guest..."
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shrink-0"
          >
            <Plus size={14} /> New Booking
          </button>
        </div>
      </div>

      {/* Sub-tab selection */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('stays')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'stays' ? 'border-teal-500 text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Stay Bookings
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'guests' ? 'border-teal-500 text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Guests Directory
        </button>
      </div>

      {/* Bookings Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === 'stays' ? (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <th className="p-4">Guest Name</th>
                  <th className="p-4">Room No.</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Bill Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-bold">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition">
                    <td className="p-4">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{b.guestName || 'Unnamed'}</span>
                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-455 font-medium">
                          <span>{b.guestPhone || ''}</span>
                          <span className="text-teal-600 dark:text-teal-400 font-semibold">• Restaurant: {b.restaurantName || 'Atithi Dining Hall'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-350">{b.roomNumber || 'N/A'}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{b.roomType || 'Standard'}</td>
                    <td className="p-4 font-medium text-slate-500 dark:text-slate-400">
                      {b.checkIn || ''} to {b.checkOut || ''}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">${b.amount ? b.amount.toLocaleString() : '0'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          b.status === 'checked-in'
                            ? 'bg-teal-500/10 text-teal-655 dark:text-teal-400 border border-teal-900/30'
                            : b.status === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-900/30'
                            : 'bg-red-500/10 text-red-500 border border-red-900/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked-in')}
                            className="px-2 py-1 bg-teal-50 dark:bg-teal-950/25 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50 hover:bg-teal-100 rounded-lg text-[10px] font-bold"
                          >
                            Check In
                          </button>
                        )}
                        {b.status === 'checked-in' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked-out')}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 rounded-lg text-[10px] font-bold"
                          >
                            Check Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <th className="p-4">Guest Name</th>
                  <th className="p-4">Mobile Details</th>
                  <th className="p-4">Room Scope</th>
                  <th className="p-4">Active Stay Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-bold">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-[10px]">{b.guestName?.[0]}</div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{b.guestName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-350">{b.guestPhone}</td>
                    <td className="p-4 font-mono text-slate-500">Room {b.roomNumber} ({b.roomType})</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 text-[9px] uppercase font-mono">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Book Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <form
            onSubmit={handleAddBooking}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-250">New Guest Registration</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Guest Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                  placeholder="Arjun Mehta"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Associated Restaurant</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. Atithi Dining Hall"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Room No.</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                    placeholder="305"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Room Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-250 outline-none focus:border-teal-500 transition"
                  >
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Standard Queen">Standard Queen</option>
                    <option value="Executive Club">Executive Club</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Price Rate ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Add Booking Reservation
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
