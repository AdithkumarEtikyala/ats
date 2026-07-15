import React, { useContext, useState, useEffect } from 'react';
import { TicketContext } from '../contexts/TicketContext';
import { HotelContext } from '../contexts/HotelContext';
import { MessageSquare, Send, Smartphone, UserCheck, ShieldCheck, Ticket } from 'lucide-react';

export default function WhatsAppInbox() {
  const { chats, sendChatMessage, tickets } = useContext(TicketContext);
  const { activeHotel } = useContext(HotelContext);
  const [activeSession, setActiveSession] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  const hotelChats = chats.filter((c) => c.hotelId === activeHotel?.id);

  useEffect(() => {
    if (hotelChats.length > 0 && !activeSession) {
      setActiveSession(hotelChats[0]);
    }
  }, [hotelChats, activeSession]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeSession) return;

    sendChatMessage(activeSession.guestPhone, typedMessage, 'bot');
    setTypedMessage('');
    
    // Auto sync current session messages reference
    const updatedSession = chats.find((c) => c.guestPhone === activeSession.guestPhone);
    if (updatedSession) {
      setActiveSession(updatedSession);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSession(session);
  };

  // Sync activeSession when chats state updates
  useEffect(() => {
    if (activeSession) {
      const refreshed = chats.find((c) => c.guestPhone === activeSession.guestPhone);
      if (refreshed) {
        setActiveSession(refreshed);
      }
    }
  }, [chats]);

  const activeGuestTickets = tickets.filter(
    (t) => t.guestName === activeSession?.guestName && t.status !== 'Completed'
  );

  return (
    <div className="h-[calc(100vh-140px)] flex border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      {/* Left Chat List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950/20">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Active Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
          {hotelChats.map((c) => {
            const isSelected = activeSession?.guestPhone === c.guestPhone;
            const lastMessage = c.messages[c.messages.length - 1];
            return (
              <div
                key={c.guestPhone}
                onClick={() => handleSelectSession(c)}
                className={`p-4 cursor-pointer transition text-xs ${
                  isSelected
                    ? 'bg-teal-50/50 dark:bg-teal-950/20 border-l-4 border-teal-600'
                    : 'hover:bg-slate-100/50 dark:hover:bg-slate-850/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.guestName}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{lastMessage?.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{lastMessage?.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Chat Panel */}
      <div className="flex-1 flex flex-col justify-between">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="bg-teal-600 text-white px-6 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-teal-850 flex items-center justify-center font-bold text-sm">
                {activeSession.guestName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm">{activeSession.guestName}</h4>
                <span className="text-[10px] text-teal-205">{activeSession.guestPhone}</span>
              </div>
            </div>

            {/* Chat list messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/30 flex flex-col">
              {activeSession.messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div
                    key={m.id}
                    className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-teal-600 text-white rounded-tr-none ml-auto'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none mr-auto border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1.5 ${isBot ? 'text-teal-200' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                placeholder="Type your WhatsApp reply..."
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition flex items-center justify-center shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={36} className="text-slate-550 mb-2" />
            <p className="text-xs">Select a conversation to begin</p>
          </div>
        )}
      </div>

      {/* Right Guest Profile Summary */}
      {activeSession && (
        <div className="hidden md:flex w-64 border-l border-slate-200 dark:border-slate-800 p-5 flex-col gap-6">
          <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-teal-500/10 text-teal-650 flex items-center justify-center font-bold text-lg">
              {activeSession.guestName.charAt(0)}
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{activeSession.guestName}</h4>
            <span className="text-[10px] text-slate-400 block font-semibold">{activeSession.guestPhone}</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Active Tickets</span>
              {activeGuestTickets.length === 0 ? (
                <span className="text-slate-400">No active tickets</span>
              ) : (
                <div className="space-y-1.5">
                  {activeGuestTickets.map((t) => (
                    <div key={t.id} className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-200 dark:border-slate-850 flex items-center gap-1.5">
                      <Ticket size={12} className="text-teal-500 shrink-0" />
                      <span className="font-semibold text-[10px] text-slate-700 dark:text-slate-300 truncate">{t.requestType}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
