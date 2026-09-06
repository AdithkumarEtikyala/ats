import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const HotelContext = createContext();

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
    const found = hotels.find((h) => h.id === id);
    if (found) {
      setActiveWorkspaceHotel(found);
    }
  };

  const exitWorkspace = () => {
    setActiveWorkspaceHotel(null);
  };

  const selectHotel = (id) => {
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
      await api.put(`/api/hotels/${id}`, updatedFields);
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

  const activeHotel = activeWorkspaceHotel;

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
