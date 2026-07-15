import React, { useContext, useState } from 'react';
import { TicketContext } from '../contexts/TicketContext';
import { HotelContext } from '../contexts/HotelContext';
import { MOCK_STAFF } from '../utils/mockData';
import { Ticket, Search, Clock, Plus, ShieldCheck, X, AlertTriangle } from 'lucide-react';

export default function Tickets({ dept }) {
  const { tickets, updateTicketStatus, assignStaff, createTicket } = useContext(TicketContext);
  const { activeHotel } = useContext(HotelContext);

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  React.useEffect(() => {
    if (dept) {
      setFilterDept(dept);
    } else {
      const params = new URLSearchParams(window.location.search);
      const urlDept = params.get('dept');
      if (urlDept) {
        setFilterDept(urlDept);
      } else {
        setFilterDept('All');
      }
    }
  }, [dept, window.location.search]);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [requestType, setRequestType] = useState('Extra Towels');
  const [department, setDepartment] = useState('Housekeeping');
  const [priority, setPriority] = useState('High');

  const hotelStaff = MOCK_STAFF.filter((s) => s.hotelId === activeHotel?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicket({
      hotelId: activeHotel?.id,
      guestName,
      roomNumber,
      requestType,
      department,
      priority,
      assignedStaff: ''
    });
    setModalOpen(false);
    setGuestName('');
    setRoomNumber('');
  };

  const handleUpdateStatus = (tktId, status) => {
    updateTicketStatus(tktId, status);
  };

  const handleAssignStaff = (tktId, staffName) => {
    assignStaff(tktId, staffName);
  };

  const filteredTickets = tickets
    .filter((t) => !activeHotel || t.hotelId === activeHotel.id)
    .filter((t) => filterDept === 'All' || t.department === filterDept)
    .filter((t) => filterStatus === 'All' || t.status === filterStatus)
    .filter((t) => t.guestName.toLowerCase().includes(search.toLowerCase()) || t.requestType.toLowerCase().includes(search.toLowerCase()));

  const depts = ['All', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Concierge', 'Other'];
  const statuses = ['All', 'Open', 'Assigned', 'In Progress', 'Completed', 'Closed'];

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Service Requests Pipeline</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monitor response compliance and staff assignations</p>
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
              placeholder="Search request..."
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg shrink-0"
          >
            <Plus size={14} /> Log Ticket
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Filter Dept:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-700 dark:text-white outline-none"
          >
            {depts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-700 dark:text-white outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ticket Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((t) => {
          const isBreached = t.slaSecondsLeft <= 0;
          const isWarning = t.slaSecondsLeft > 0 && t.slaSecondsLeft < 300; // <5m
          const currentTktStaff = hotelStaff.filter((s) => s.role === t.department);

          return (
            <div
              key={t.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition shadow-sm ${
                isBreached
                  ? 'border-red-500/40 bg-red-950/5 dark:bg-red-950/10'
                  : isWarning
                  ? 'border-amber-500/40 bg-amber-950/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                    {t.id}
                  </span>
                  
                  {/* Live SLA Countdown text */}
                  {t.status !== 'Completed' && t.status !== 'Closed' ? (
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isBreached ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-500' : 'text-teal-600 dark:text-teal-400'
                      }`}
                    >
                      <Clock size={12} />
                      {isBreached
                        ? 'SLA Breached'
                        : `${Math.floor(t.slaSecondsLeft / 60)}m ${t.slaSecondsLeft % 60}s`}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={12} /> Resolved
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {t.requestType}
                  </h3>
                  <span className="text-[10px] text-slate-450 block mt-0.5">
                    Room {t.roomNumber} - {t.guestName}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-650 dark:text-teal-400 text-[9px] font-bold uppercase">
                    {t.department}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    t.priority === 'Urgent' ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-550'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              </div>

              {/* Assignments / Status update footer */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-5 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Assign Staff:</span>
                  <select
                    value={t.assignedStaff}
                    onChange={(e) => handleAssignStaff(t.id, e.target.value)}
                    disabled={t.status === 'Completed' || t.status === 'Closed'}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-[10px] font-bold rounded-lg px-2 py-1 text-slate-700 dark:text-slate-250 outline-none max-w-[120px] truncate"
                  >
                    <option value="">Unassigned</option>
                    {currentTktStaff.map((staff) => (
                      <option key={staff.id} value={staff.name}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  {t.status === 'New' && (
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'In Progress')}
                      className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] rounded-lg transition"
                    >
                      Accept Ticket
                    </button>
                  )}
                  {t.status === 'In Progress' && (
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'Completed')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition"
                    >
                      Resolve Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-250">Log Manual Guest Request</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                  placeholder="Arjun Mehta"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Room No.</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                  placeholder="305"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-255 outline-none focus:border-teal-500 transition"
                >
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-255 outline-none focus:border-teal-500 transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Request Detail</label>
              <input
                type="text"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. Extra Water bottles"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Log Ticket & Start SLA Timer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
