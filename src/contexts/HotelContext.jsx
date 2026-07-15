import React, { createContext, useState, useEffect } from 'react';
import { MOCK_HOTELS } from '../utils/mockData';

export const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_hotels');
    let loadedHotels = saved ? JSON.parse(saved) : [];
    
    // Auto-merge new default hotels to prevent cache stagnation
    const merged = [...loadedHotels];
    MOCK_HOTELS.forEach(def => {
      const exists = merged.some(h => h.id === def.id);
      if (!exists) {
        merged.push(def);
      }
    });

    localStorage.setItem('atithisphere_v3_hotels', JSON.stringify(merged));
    return merged;
  });

  const [activeWorkspaceHotel, setActiveWorkspaceHotel] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('atithisphere_v3_user');
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser.hotelId && parsedUser.hotelId !== 'all') {
        const found = hotels.find((h) => h.id === parsedUser.hotelId);
        if (found) {
          setActiveWorkspaceHotel(found);
        }
      }
    }
  }, [hotels]);

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

  const addHotel = (hotel) => {
    const newH = {
      ...hotel,
      id: `hotel-${Math.floor(Math.random() * 900) + 100}`,
      rating: 4.5
    };
    const updated = [...hotels, newH];
    setHotels(updated);
    localStorage.setItem('atithisphere_v3_hotels', JSON.stringify(updated));
    return newH;
  };

  const updateHotel = (id, updatedFields) => {
    const updated = hotels.map(h => h.id === id ? { ...h, ...updatedFields } : h);
    setHotels(updated);
    localStorage.setItem('atithisphere_v3_hotels', JSON.stringify(updated));
    if (activeWorkspaceHotel?.id === id) {
      setActiveWorkspaceHotel({ ...activeWorkspaceHotel, ...updatedFields });
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
      darkMode, 
      toggleDarkMode 
    }}>
      {children}
    </HotelContext.Provider>
  );
};
