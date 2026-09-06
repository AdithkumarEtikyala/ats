import React, { useContext, useState, useEffect } from 'react';
import { HotelContext } from '../contexts/HotelContext';
import { AuthContext } from '../contexts/AuthContext';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Users2, Search, Star, ShieldAlert, Plus, X, UserPlus, Check, Trash2 } from 'lucide-react';
import api from '../utils/api';

export default function Staff() {
  const { activeHotel, hotels } = useContext(HotelContext);
  const { user, registerUser } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [staffList, setStaffList] = useState([]);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('Housekeeping');
  const [hotelAssignment, setHotelAssignment] = useState(activeHotel?.id || 'hotel-1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    let q = collection(db, 'staff');
    if (activeHotel && activeHotel.id !== 'all') {
      q = query(collection(db, 'staff'), where('hotelId', '==', activeHotel.id));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roster = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStaffList(roster);
    });

    return () => unsubscribe();
  }, [activeHotel]);

  // Update staff assignment selector when activeHotel changes
  useEffect(() => {
    if (activeHotel) {
      setHotelAssignment(activeHotel.id);
    }
  }, [activeHotel]);

  // Listen to action=register search param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'register') {
      setModalOpen(true);
    }
  }, [window.location.search]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const assignedId = (user.role === 'Super Admin' || user.role === 'Hotel Owner' || user.role === 'Manager') ? (activeHotel?.id || hotelAssignment) : user.hotelId;

    const newUser = {
      name,
      email,
      phone,
      employeeId,
      username,
      password,
      role,
      hotelId: assignedId
    };

    await registerUser(newUser);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setEmployeeId('');
    setUsername('');
    setPassword('password123');
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setModalOpen(false);
    }, 1500);
  };

  const handleRemoveStaff = async (staffId, staffEmail) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await api.delete(`/api/staff/${staffId}?email=${staffEmail || ''}`);
        alert('Staff member removed successfully.');
      } catch (err) {
        console.error('Failed to remove staff via backend:', err);
        alert('Failed to remove staff member: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const isAllowedToRegister = user?.role === 'Super Admin' || user?.role === 'Hotel Owner' || user?.role === 'Manager' || user?.role === 'Front Desk';

  // Filter roster by current active hotel selection
  const filteredStaff = staffList
    .filter((s) => !activeHotel || s.hotelId === activeHotel.id)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Staff & Team Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assign department tasks and monitor crew performance metrics</p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-550 focus:outline-none focus:border-teal-500 transition"
              placeholder="Search staff name..."
            />
          </div>

          {isAllowedToRegister && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shrink-0"
            >
              <UserPlus size={14} /> Register Staff
            </button>
          )}
        </div>
      </div>

      {/* Staff lists cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-extrabold rounded-xl text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{s.name}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-wider font-semibold block mt-0.5">
                      {s.role}
                    </span>
                  </div>
                </div>
                {(user?.role === 'Super Admin' || user?.role === 'Hotel Owner' || user?.role === 'Manager' || user?.role === 'Front Desk') && (
                  <button
                    onClick={() => handleRemoveStaff(s.id, s.email)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-550/10 rounded-lg transition"
                    title="Remove Staff"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Active Tasks</span>
                  <span className="text-slate-800 dark:text-slate-200 block font-bold text-sm mt-0.5">
                    {s.activeTickets || 0} Tickets
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Rating</span>
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1 font-bold text-sm mt-0.5">
                    <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                    {s.rating || '4.8'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed rounded-3xl theme-card border-slate-250 dark:border-slate-800">
            <Users2 size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-500">No staff members registered for this property unit.</p>
          </div>
        )}
      </div>

      {/* Registration Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 text-left space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-950 transition text-slate-500"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <UserPlus size={18} className="text-teal-500" /> Register Team Member
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure credentials and assign property scope.</p>
            </div>

            {regSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Registration Successful</h4>
                <p className="text-xs text-slate-500">Team member added to registry and local roster.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="EMP-XXX"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Employee Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                      {user?.role === 'Super Admin' && (
                        <>
                          <option value="Manager">Hotel Manager</option>
                          <option value="Front Desk">Front Desk Staff</option>
                        </>
                      )}
                      <option value="Housekeeping">Housekeeping Staff</option>
                      <option value="Maintenance">Maintenance Staff</option>
                      <option value="Food & Beverage">Food & Beverage Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel Scope Assignment</label>
                    {user?.role === 'Super Admin' ? (
                      <select
                        value={hotelAssignment}
                        onChange={(e) => setHotelAssignment(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                      >
                        {hotels.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={activeHotel?.name || ''}
                        disabled
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-xl opacity-60"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t dark:border-slate-800 pt-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password Key</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg transition"
                  >
                    Register Employee
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
