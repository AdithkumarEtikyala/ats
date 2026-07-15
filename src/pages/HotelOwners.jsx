import React, { useState } from 'react';
import { Users2, Search, Mail, Phone, Plus, X } from 'lucide-react';

export default function HotelOwners() {
  const [owners, setOwners] = useState([
    { id: 'own-1', name: 'Suresh Mehta', email: 'owner1@atithisphere.com', phone: '+91 98210 12345', properties: 2, plan: 'Enterprise Pro', billing: 'Annually' },
    { id: 'own-2', name: 'Rajesh Singhania', email: 'rajesh@singhaniahotels.in', phone: '+91 99334 88762', properties: 1, plan: 'Pro Premium', billing: 'Monthly' },
    { id: 'own-3', name: 'Priya Sharma', email: 'priya.sharma@atithisphere.com', phone: '+91 90054 22199', properties: 1, plan: 'Standard Tier', billing: 'Annually' }
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('Pro Premium');

  const handleAddOwner = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    const newOwner = {
      id: `own-${Math.floor(Math.random() * 900) + 100}`,
      name,
      email,
      phone,
      properties: 0,
      plan,
      billing: 'Monthly'
    };
    setOwners([newOwner, ...owners]);
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Hotel Owners Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure hotel owner accounts, contract parameters, and property scope allocations</p>
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
              placeholder="Search owners..."
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shrink-0"
          >
            <Plus size={14} /> Register Owner
          </button>
        </div>
      </div>

      {/* Owners Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm text-xs font-bold text-slate-650 dark:text-slate-350">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-4">Owner Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Owned Properties</th>
                <th className="p-4">Subscription Plan</th>
                <th className="p-4">Billing Cycle</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition">
                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 block">{o.name}</span>
                    <span className="text-[10px] theme-muted font-mono">{o.id}</span>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {o.email}</div>
                    <div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {o.phone}</div>
                  </td>
                  <td className="p-4 text-center sm:text-left">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-500 font-bold font-mono">
                      {o.properties} Branches
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10.5px] font-extrabold">{o.plan}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider">{o.billing}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Owner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4 relative animate-fade-in text-slate-800 dark:text-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-700 transition"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold flex items-center gap-2">
              <Users2 size={16} className="text-teal-500" /> Register Hotel Owner Account
            </h3>

            <form onSubmit={handleAddOwner} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" placeholder="Suresh Mehta" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" placeholder="owner@hotels.com" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Mobile Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" placeholder="+91 98000 11223" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Subscription plan level</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <option>Standard Tier</option>
                  <option>Pro Premium</option>
                  <option>Enterprise Pro</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-teal-650 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg transition">
                Register Owner Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
