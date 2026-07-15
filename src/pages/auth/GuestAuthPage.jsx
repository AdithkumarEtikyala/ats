import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Sparkles, User, Mail, Phone } from 'lucide-react';

export default function GuestAuthPage() {
  const { login } = useContext(AuthContext);
  const [guestName, setGuestName] = useState('Guest User');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('guest@example.com');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate signup for Guest
    const mockGuest = {
      name: guestName,
      role: 'Guest',
      phone: phone,
      email: email,
      hotelId: '', // Initially empty, guest selects their active hotel inside the portal
      roomNumber: 'Unassigned'
    };

    localStorage.setItem('atithisphere_v3_user', JSON.stringify(mockGuest));
    login(guestName, 'password123'); // Triggers state reload in AuthContext
    
    // Ensure session overrides are locked in
    localStorage.setItem('atithisphere_v3_user', JSON.stringify(mockGuest));
    window.location.href = '/guest'; // hard redirect to refresh global state cleanly
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-24 w-24 bg-teal-500/10 rounded-full blur-[20px]"></div>

        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 bg-teal-500/10 text-teal-500 rounded-xl items-center justify-center">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold">Guest Registration</h2>
          <p className="text-[11px] text-slate-450">Register your stay to access virtual concierge services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Your Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-550">
                <User size={14} />
              </span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. Arjun Mehta"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-555">
                <Phone size={14} />
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. +91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-550">
                <Mail size={14} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. guest@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl transition active:scale-[0.98]"
          >
            Register stay & Enter Portal
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-[10px] text-slate-450 hover:underline">
            &larr; Back to Welcome Screen
          </Link>
        </div>
      </div>
    </div>
  );
}
