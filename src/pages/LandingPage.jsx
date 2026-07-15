import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Smartphone, Landmark, ArrowRight, HelpCircle, Mail, MessageSquare, ChevronDown, Check, Sun, Moon, Zap, BarChart2, BellRing, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  // Contact Form State
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Theme State (Simulated for Landing Page)
  const [lightMode, setLightMode] = useState(false);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMsg) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSupportName('');
      setSupportEmail('');
      setSupportMsg('');
    }, 5000);
  };

  const faqs = [
    { q: "How does the WhatsApp Guest Concierge work?", a: "Guests register their stay on the Guest Portal. Once active, they can click the WhatsApp icon to chat with our automated concierge bot. Bot requests (e.g. laundry, towels) automatically generate real tickets on the staff dashboard." },
    { q: "Do guests need a room number to sign up?", a: "No, guests sign up using only their Name, Phone, and Email. Their room details can be assigned later by the hotel reception team inside the Booking Ledger." },
    { q: "What roles are supported in the Staff Console?", a: "We support Super Admin (full control and property registration), Managers (analytics and operations), Front Desk (check-ins and bookings), Housekeeping, Maintenance, and Security dispatch queues." },
    { q: "Is the SLA timer customizable?", a: "Yes. In the Tickets Queue panel, each request triggers a countdown based on priority. High-priority items flag warning alerts at 5 minutes to prevent SLA breaches." }
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans selection:bg-teal-500/30 selection:text-teal-200 ${
      lightMode ? 'bg-slate-50 text-slate-900' : 'bg-[#070A13] text-slate-100'
    }`}>
      
      {/* Premium Header */}
      <header className={`px-6 py-4 flex items-center justify-between border-b bg-opacity-85 backdrop-blur-md sticky top-0 z-50 transition-all ${
        lightMode ? 'bg-white/80 border-slate-200' : 'bg-[#070A13]/85 border-slate-900 shadow-lg shadow-black/20'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-650 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/10">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold bg-gradient-to-r from-teal-400 via-teal-200 to-emerald-400 bg-clip-text text-transparent tracking-tight">
              AtithiSphere
            </span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Hotel Operations</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
          <a href="#features" className="hover:text-teal-500 transition duration-200">Features</a>
          <a href="#preview" className="hover:text-teal-500 transition duration-200">System Preview</a>
          <a href="#help" className="hover:text-teal-500 transition duration-200">FAQ Center</a>
          <a href="#support" className="hover:text-teal-500 transition duration-200">Support</a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setLightMode(!lightMode)}
            className={`p-2 rounded-xl transition ${lightMode ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-350 hover:text-white'}`}
          >
            {lightMode ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <Link
            to="/login"
            className="text-xs font-bold text-slate-500 dark:text-slate-350 hover:text-teal-500 dark:hover:text-white px-3 py-2 rounded-lg transition"
          >
            Staff Portal
          </Link>
          <Link
            to="/guest-auth"
            className="text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl shadow-xl shadow-teal-900/20 hover:scale-[1.02] transition active:scale-[0.98]"
          >
            Guest Sign Up
          </Link>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 space-y-28 py-16 overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto space-y-8">
          {/* Glowing backdrops */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-teal-500/10 blur-[90px] -z-10"></div>
          
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 text-[9px] font-extrabold tracking-wider uppercase text-teal-400 border border-teal-500/20 shadow-inner">
            <Zap size={10} /> WhatsApp-First Operations Suite
          </span>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Connect Guests & Hotel Staff <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-350 to-teal-300 bg-clip-text text-transparent">
              In One Seamless Sphere
            </span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
            No heavy hotel applications to download. Guests request amenities, linen, room service, or repairs instantly via WhatsApp, automatically feeding SLA-managed staff dispatch queues.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
            <Link
              to="/guest-auth"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition active:scale-[0.98] duration-200"
            >
              Register stay as Guest <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className={`flex items-center justify-center gap-2 px-6 py-3.5 font-extrabold text-xs rounded-2xl border transition duration-200 ${
                lightMode ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900/60 hover:bg-slate-800 border-slate-850 text-slate-200'
              }`}
            >
              Sign In to Staff Console
            </Link>
          </div>
        </section>

        {/* Live Interactive Platform Preview Dashboard Mockups */}
        <section id="preview" className="max-w-5xl mx-auto px-4 space-y-10 relative">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Interactive Platform Preview</h2>
            <p className="text-slate-500 dark:text-slate-450 text-xs">Observe how guest requests propagate directly to the staff dashboards</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* Mock Staff Dashboard panel preview */}
            <div className={`lg:col-span-3 border rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between ${
              lightMode ? 'bg-white border-slate-200' : 'bg-slate-900/30 border-slate-900'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-3">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BarChart2 size={12} className="text-teal-500" /> Staff Console Preview
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              {/* Mock dashboard stats cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1">
                  <span className="text-[8px] uppercase text-slate-500 font-bold">Active Guests</span>
                  <div className="text-sm font-extrabold">24 Guests</div>
                </div>
                <div className="p-3 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1">
                  <span className="text-[8px] uppercase text-slate-500 font-bold">Open Tickets</span>
                  <div className="text-sm font-extrabold text-red-400">2 Requests</div>
                </div>
                <div className="p-3 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1">
                  <span className="text-[8px] uppercase text-slate-500 font-bold">SLA Compliance</span>
                  <div className="text-sm font-extrabold text-teal-400">96.8%</div>
                </div>
              </div>

              {/* Mock tickets list items */}
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-bold block text-slate-700 dark:text-slate-200">Extra Towels Delivery</span>
                    <span className="text-[9px] text-slate-450">Room 305 • Housekeeping</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-extrabold">SLA 4:20m</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-bold block text-slate-700 dark:text-slate-200">AC Repair Dispatch</span>
                    <span className="text-[9px] text-slate-450">Room 204 • Maintenance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-extrabold uppercase">Urgent</span>
                </div>
              </div>
            </div>

            {/* Mock WhatsApp widget phone preview */}
            <div className={`lg:col-span-2 border rounded-3xl p-5 shadow-xl flex flex-col justify-between text-left ${
              lightMode ? 'bg-white border-slate-200' : 'bg-slate-900/30 border-slate-900'
            }`}>
              <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3">
                <div className="h-6 w-6 rounded-full bg-teal-600 flex items-center justify-center font-bold text-[9px] text-white">WA</div>
                <div>
                  <span className="text-xs font-bold block leading-none">Grand Palace Bot</span>
                  <span className="text-[7px] text-emerald-500 font-semibold uppercase tracking-wider">Concierge Simulator</span>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[140px] text-[10px]">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-8 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50 font-medium">
                  Welcome Arjun! How may I assist you with your stay today?
                </div>
                <div className="p-2.5 rounded-xl bg-teal-600 text-white ml-8 rounded-tr-none text-right font-medium">
                  Hi, can you send 2 fresh towels to Room 305?
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-8 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50 font-medium">
                  Certainly! I've logged request tkt-2001. A staff member will deliver towels in 5 minutes.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/guest-auth"
                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1"
                >
                  Test Simulator in Guest Space <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Stack Cards grid */}
        <section id="features" className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Platform Core Capabilities</h2>
            <p className="text-slate-500 dark:text-slate-450 text-xs">Everything required to automate your guest requests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`border rounded-2xl p-6 space-y-3 ${lightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/30 border-slate-900'}`}>
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <Smartphone size={18} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">WhatsApp Dispatcher</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                Guests make requests instantly inside WhatsApp. AI bot parses queries and dispatches jobs directly to departmental staff queues.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 space-y-3 ${lightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/30 border-slate-900'}`}>
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <BellRing size={18} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">SLA Escapes Guard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed font-medium">
                Visual countdown tickers track every ticket. High-priority items warn staff at critical thresholds to guarantee service compliance.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 space-y-3 ${lightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/30 border-slate-900'}`}>
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <BarChart2 size={18} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Performance Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed font-medium">
                Track compliance rates, average response delays, and request category breakdowns across all properties from a unified dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Help Center (FAQ) Section */}
        <section id="help" className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Help Center & FAQ</h2>
            <p className="text-slate-500 dark:text-slate-450 text-xs">Frequently asked questions about setting up and testing AtithiSphere</p>
          </div>

          <div className={`border rounded-3xl divide-y overflow-hidden shadow-lg ${
            lightMode ? 'bg-white border-slate-200 divide-slate-200' : 'bg-[#0B101E] border-slate-900 divide-slate-900'
          }`}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 space-y-2 transition hover:bg-slate-500/5">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs hover:text-teal-500 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform ${openFaqIndex === idx ? 'rotate-180 text-teal-500' : 'text-slate-400'}`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2 font-medium">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support Form Section */}
        <section id="support" className="max-w-xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Contact Support</h2>
            <p className="text-slate-500 dark:text-slate-455 text-xs">Reach out for integration help or customization inquiries</p>
          </div>

          <form onSubmit={handleSupportSubmit} className={`border rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl ${
            lightMode ? 'bg-white border-slate-200' : 'bg-[#0B101E] border-slate-900'
          }`}>
            {formSubmitted && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-900/30 rounded-xl text-emerald-500 text-[10px] font-bold flex items-center gap-2 animate-pulse">
                <Check size={14} /> Support inquiry submitted! We will contact you shortly.
              </div>
            )}

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
              <input
                type="text"
                value={supportName}
                onChange={(e) => setSupportName(e.target.value)}
                className={`w-full px-3 py-2 bg-transparent border rounded-xl text-xs outline-none focus:border-teal-500 transition ${
                  lightMode ? 'border-slate-200' : 'border-slate-800'
                }`}
                placeholder="Arjun Mehta"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className={`w-full px-3 py-2 bg-transparent border rounded-xl text-xs outline-none focus:border-teal-500 transition ${
                  lightMode ? 'border-slate-200' : 'border-slate-800'
                }`}
                placeholder="arjun@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Message / Inquiry</label>
              <textarea
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 bg-transparent border rounded-xl text-xs outline-none focus:border-teal-500 transition resize-none ${
                  lightMode ? 'border-slate-200' : 'border-slate-800'
                }`}
                placeholder="How can our support team help you..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition active:scale-[0.98]"
            >
              Submit Support Request
            </button>
          </form>
        </section>

      </main>

      {/* Rich Footer */}
      <footer className={`border-t py-12 px-6 transition-colors ${
        lightMode ? 'bg-slate-100 border-slate-200' : 'bg-[#05070D] border-slate-900'
      }`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Intro */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-600 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                AtithiSphere
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              The WhatsApp-first hospitality suite powering modern hotels. Built for seamless operations and ultimate guest satisfaction.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-teal-500 transition">Features</a></li>
              <li><Link to="/guest-auth" className="hover:text-teal-500 transition">Guest Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-500 transition">Staff Dashboard</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#help" className="hover:text-teal-500 transition">Help Center</a></li>
              <li><a href="#support" className="hover:text-teal-500 transition">Contact Support</a></li>
              <li><a href="#" className="hover:text-teal-500 transition">API Documentation</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact specs */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stay Updated</h4>
            <div className="flex gap-2">
              <input
                type="email"
                className={`px-3 py-1.5 bg-transparent border rounded-lg text-[10px] outline-none focus:border-teal-500 transition flex-1 ${
                  lightMode ? 'border-slate-200 text-slate-800' : 'border-slate-800 text-slate-200'
                }`}
                placeholder="email@example.com"
              />
              <button className="px-3 py-1.5 bg-teal-650 hover:bg-teal-600 text-white text-[10px] font-bold rounded-lg transition">
                Subscribe
              </button>
            </div>
            <span className="block text-[9px] text-slate-500 font-semibold">Instant concierges, dispatchers & SLA management.</span>
          </div>

        </div>

        <div className="max-w-5xl mx-auto border-t border-slate-250 dark:border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} AtithiSphere Operations. All rights reserved.</span>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
