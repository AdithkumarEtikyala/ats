import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../utils/firebase';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.email.toLowerCase()));
            if (userDoc.exists()) {
              setUser(userDoc.data());
            } else {
              setUser({
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'Guest User',
                role: 'Guest',
                hotelId: '',
                employeeId: 'GUEST',
                phone: firebaseUser.phoneNumber || ''
              });
            }
          } catch (err) {
            console.error('Failed to load user metadata from Firestore:', err);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Auth state listener error:', err);
        setLoading(false);
      }
    );

    // Safety fallback timeout to prevent infinite blank/loading screens
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const login = async (email, password, hotelId) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', email.toLowerCase()));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const activeUser = {
          ...userData,
          hotelId: userData.role === 'Super Admin' ? (hotelId || 'all') : userData.hotelId
        };
        setUser(activeUser);
        return { success: true, user: activeUser };
      }
      return { success: false, message: 'User record not found in Firestore.' };
    } catch (err) {
      return {
        success: false,
        message: err.code === 'auth/invalid-credential' 
          ? 'Invalid email credentials or password key.' 
          : err.message
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const email = userCred.user.email.toLowerCase();
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {
        uid: userCred.user.uid,
        email,
        name: userCred.user.displayName || 'Guest User',
        phone: userCred.user.phoneNumber || '',
        role: 'Guest',
        hotelId: '',
        employeeId: 'GUEST'
      };
      if (!userDoc.exists()) await setDoc(userDocRef, userData);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const registerUser = async (newUser) => {
    try {
      await api.post('/api/auth/register', newUser);
      return { success: true };
    } catch (err) {
      console.error('Failed to register employee via backend:', err);
      return { success: false, message: err.response?.data?.error || err.message };
    }
  };

  const registerSelf = async (newUser) => {
    try {
      await api.post('/api/auth/register', newUser);
      await signInWithEmailAndPassword(auth, newUser.email, newUser.password);
      return { success: true };
    } catch (err) {
      console.error('Failed self-registration:', err);
      return { success: false, message: err.response?.data?.error || err.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, loginWithGoogle, logout, registerUser, registerSelf, loading }}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-400">Loading AtithiSphere...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
