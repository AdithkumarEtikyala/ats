import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const HotelContext = createContext();

const canAccessHotel = (user, hotelId) => {
  if (!user) return false;
  if (user.role === 'Super Admin') return true;
  if (user.role === 'Manager') return user.hotelId === hotelId;
  return true;
};

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [activeWorkspaceHotel, setActiveWorkspaceHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Listen to hotels in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'hotels'), (snapshot) => {
      const hotelList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHotels(hotelList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync workspace assignment reactively when user or hotels change
  useEffect(() => {
    if (user && user.hotelId && user.hotelId !== 'all') {
      const found = hotels.find(h => h.id === user.hotelId);
      if (found) {
        setActiveWorkspaceHotel(found);
      }
    } else if (!user) {
      setActiveWorkspaceHotel(null);
    }
  }, [user, hotels]);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_dark');
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('atithisphere_v3_dark', darkMode.toString());
  }, [darkMode]);

  const enterWorkspace = (id) => {
    if (!canAccessHotel(user, id)) return;
    const found = hotels.find((h) => h.id === id);
    if (found) {
      setActiveWorkspaceHotel(found);
    }
  };

  const exitWorkspace = () => {
    setActiveWorkspaceHotel(null);
  };

  const selectHotel = (id) => {
    if (!canAccessHotel(user, id)) return;
    const found = hotels.find((h) => h.id === id);
    if (found) {
      setActiveWorkspaceHotel(found);
    }
  };

  const addHotel = async (hotel) => {
    try {
      const response = await api.post('/api/hotels', hotel);
      return response.data;
    } catch (err) {
      console.error('Failed to add hotel via backend:', err);
    }
  };

  const updateHotel = async (id, updatedFields) => {
    try {
      if (!canAccessHotel(user, id)) {
        throw new Error('You can only update your assigned hotel.');
      }
      await api.put(`/api/hotels/${id}`, updatedFields);
      // The onSnapshot will automatically catch this and update the state,
      // but we can proactively update activeWorkspaceHotel for immediate UI response.
      if (activeWorkspaceHotel?.id === id) {
        setActiveWorkspaceHotel(prev => ({ ...prev, ...updatedFields }));
      }
    } catch (err) {
      console.error('Failed to update hotel via backend:', err);
    }
  };

  const deleteHotel = async (id) => {
    try {
      await api.delete(`/api/hotels/${id}`);
      if (activeWorkspaceHotel?.id === id) {
        setActiveWorkspaceHotel(null);
      }
    } catch (err) {
      console.error('Failed to delete hotel via backend:', err);
      throw err;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // A manager's assigned hotel remains the data scope after leaving its workspace.
  // `activeWorkspaceHotel` controls only the workspace UI (breadcrumb and detail view).
  const activeHotel = activeWorkspaceHotel || (
    user?.role === 'Manager' ? hotels.find((hotel) => hotel.id === user.hotelId) || null : null
  );

  return (
    <HotelContext.Provider value={{ 
      hotels, 
      activeHotel, 
      activeWorkspaceHotel, 
      enterWorkspace, 
      exitWorkspace, 
      selectHotel, 
      addHotel, 
      updateHotel,
      deleteHotel,
      darkMode, 
      toggleDarkMode,
      loading
    }}>
      {children}
    </HotelContext.Provider>
  );
};
