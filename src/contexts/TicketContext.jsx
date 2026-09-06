import React, { createContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  increment,
  getDocs,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import api from '../utils/api';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync tickets & chats real-time
  useEffect(() => {
    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const ticketsList = snapshot.docs.map(doc => {
        const tkt = { id: doc.id, ...doc.data() };
        
        // Dynamically adjust slaSecondsLeft on queries if active
        if (tkt.status !== 'Completed' && tkt.status !== 'Closed' && tkt.slaSecondsLeft > 0) {
          const elapsed = Math.floor((Date.now() - new Date(tkt.createdTime).getTime()) / 1000);
          tkt.slaSecondsLeft = Math.max(0, 600 - elapsed);
        }
        return tkt;
      });
      setTickets(ticketsList);
      setLoading(false);
    });

    const unsubChats = onSnapshot(collection(db, 'chats'), (snapshot) => {
      const chatsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatsList);
    });

    return () => {
      unsubTickets();
      unsubChats();
    };
  }, []);

  // Visual countdown timer for active UI countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prevTickets) =>
        prevTickets.map((tkt) => {
          if (tkt.status !== 'Completed' && tkt.status !== 'Closed' && tkt.slaSecondsLeft > 0) {
            return { ...tkt, slaSecondsLeft: tkt.slaSecondsLeft - 1 };
          }
          return tkt;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createTicket = async (ticket) => {
    try {
      const response = await api.post('/api/tickets', ticket);
      return response.data;
    } catch (err) {
      console.error('Failed to create ticket via backend:', err);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await api.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update ticket status via backend:', err);
    }
  };

  const assignStaff = async (ticketId, staffName) => {
    try {
      await api.put(`/api/tickets/${ticketId}/assign`, { staffName });
    } catch (err) {
      console.error('Failed to assign staff via backend:', err);
    }
  };

  const sendChatMessage = async (guestPhone, text, sender = 'bot', guestName = '', hotelId = '') => {
    try {
      await api.post('/api/chats/messages', {
        guestPhone,
        text,
        sender,
        guestName,
        hotelId
      });
    } catch (err) {
      console.error('Failed to send chat message via backend:', err);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        chats,
        createTicket,
        updateTicketStatus,
        assignStaff,
        sendChatMessage,
        loading
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
