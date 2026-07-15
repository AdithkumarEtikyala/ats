import React, { createContext, useState, useEffect } from 'react';
import { MOCK_HOTELS } from '../utils/mockData';

export const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    name: 'Super Admin',
    email: 'superadmin@atithisphere.com',
    password: 'password123',
    role: 'Super Admin',
    hotelId: 'all',
    employeeId: 'EMP-SA01',
    phone: '+91 99999 11111'
  },
  {
    name: 'Suresh Mehta',
    email: 'owner1@atithisphere.com',
    password: 'password123',
    role: 'Hotel Owner',
    hotelId: 'hotel-1',
    employeeId: 'EMP-OW01',
    phone: '+91 99999 12345'
  },
  {
    name: 'Rohan Gupta',
    email: 'owner2@atithisphere.com',
    password: 'password123',
    role: 'Hotel Owner',
    hotelId: 'hotel-2',
    employeeId: 'EMP-OW02',
    phone: '+91 99999 67890'
  },
  {
    name: 'Arvind Sharma',
    email: 'manager1@atithisphere.com',
    password: 'password123',
    role: 'Manager',
    hotelId: 'hotel-1',
    employeeId: 'EMP-M01',
    phone: '+91 99999 22222'
  },
  {
    name: 'Priya Nair',
    email: 'frontdesk1@atithisphere.com',
    password: 'password123',
    role: 'Front Desk',
    hotelId: 'hotel-1',
    employeeId: 'EMP-FD01',
    phone: '+91 99999 33333'
  },
  {
    name: 'Karan Singh',
    email: 'housekeeping1@atithisphere.com',
    password: 'password123',
    role: 'Housekeeping',
    hotelId: 'hotel-1',
    employeeId: 'EMP-HK01',
    phone: '+91 99999 44444'
  },
  {
    name: 'Ramesh Kumar',
    email: 'maintenance1@atithisphere.com',
    password: 'password123',
    role: 'Maintenance',
    hotelId: 'hotel-1',
    employeeId: 'EMP-MN01',
    phone: '+91 99999 55555'
  },
  {
    name: 'Vikram Mehta',
    email: 'foodbeverage1@atithisphere.com',
    password: 'password123',
    role: 'Food & Beverage',
    hotelId: 'hotel-1',
    employeeId: 'EMP-FB01',
    phone: '+91 99999 66666'
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_users');
    let loadedUsers = saved ? JSON.parse(saved) : [];
    
    // Auto-merge default accounts to prevent cache stagnation
    const merged = [...loadedUsers];
    DEFAULT_USERS.forEach(def => {
      const exists = merged.some(u => u.email.toLowerCase() === def.email.toLowerCase());
      if (!exists) {
        merged.push(def);
      }
    });

    localStorage.setItem('atithisphere_v3_users', JSON.stringify(merged));
    return merged;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password, hotelId) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const activeUser = {
        ...foundUser,
        // If login requested a specific hotel (for staff/managers)
        hotelId: foundUser.role === 'Super Admin' ? (hotelId || 'all') : foundUser.hotelId
      };
      setUser(activeUser);
      localStorage.setItem('atithisphere_v3_user', JSON.stringify(activeUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid email credentials or password key.' };
  };

  const registerUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('atithisphere_v3_users', JSON.stringify(updatedUsers));

    // Also update dynamic staff array in MOCK_STAFF or local storage so they show up
    const savedStaff = JSON.parse(localStorage.getItem('atithisphere_v3_staff') || '[]');
    const newStaffMember = {
      id: `staff-${Math.floor(Math.random() * 900) + 100}`,
      name: newUser.name,
      role: newUser.role,
      hotelId: newUser.hotelId,
      activeTickets: 0,
      rating: 4.8
    };
    const updatedStaff = [...savedStaff, newStaffMember];
    localStorage.setItem('atithisphere_v3_staff', JSON.stringify(updatedStaff));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atithisphere_v3_user');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, users, isLoggedIn, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
