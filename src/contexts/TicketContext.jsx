import React, { createContext, useState, useEffect } from 'react';
import { MOCK_TICKETS, MOCK_CHAT_SESSIONS } from '../utils/mockData';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_tickets');
    return saved ? JSON.parse(saved) : MOCK_TICKETS;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_chats');
    return saved ? JSON.parse(saved) : MOCK_CHAT_SESSIONS;
  });

  // Dynamic SLA Countdown Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prevTickets) => {
        const updated = prevTickets.map((tkt) => {
          if (tkt.status !== 'Completed' && tkt.status !== 'Closed' && tkt.slaSecondsLeft > 0) {
            return { ...tkt, slaSecondsLeft: tkt.slaSecondsLeft - 1 };
          }
          return tkt;
        });
        localStorage.setItem('atithisphere_v3_tickets', JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createTicket = (ticket) => {
    const newTkt = {
      ...ticket,
      id: `tkt-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'New',
      slaSecondsLeft: 600, // 10 minutes default
      createdTime: new Date().toISOString()
    };
    const updated = [newTkt, ...tickets];
    setTickets(updated);
    localStorage.setItem('atithisphere_v3_tickets', JSON.stringify(updated));
    return newTkt;
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    const updated = tickets.map((tkt) => {
      if (tkt.id === ticketId) {
        return { ...tkt, status: newStatus };
      }
      return tkt;
    });
    setTickets(updated);
    localStorage.setItem('atithisphere_v3_tickets', JSON.stringify(updated));
  };

  const assignStaff = (ticketId, staffName) => {
    const updated = tickets.map((tkt) => {
      if (tkt.id === ticketId) {
        return { ...tkt, assignedStaff: staffName, status: 'Accepted' };
      }
      return tkt;
    });
    setTickets(updated);
    localStorage.setItem('atithisphere_v3_tickets', JSON.stringify(updated));
  };

  const sendChatMessage = (guestPhone, text, sender = 'bot') => {
    const updatedChats = chats.map((c) => {
      if (c.guestPhone === guestPhone) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              sender,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('atithisphere_v3_chats', JSON.stringify(updatedChats));
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        chats,
        createTicket,
        updateTicketStatus,
        assignStaff,
        sendChatMessage
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
