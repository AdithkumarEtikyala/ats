import React, { createContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import api from '../utils/api';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [hotelFeedback, setHotelFeedback] = useState([]);
  const [appFeedback, setAppFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync feedback collections real-time
  useEffect(() => {
    const unsubHotel = onSnapshot(collection(db, 'feedback_hotel'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.date.localeCompare(a.date));
      setHotelFeedback(list);
      setLoading(false);
    });

    const unsubApp = onSnapshot(collection(db, 'feedback_app'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.date.localeCompare(a.date));
      setAppFeedback(list);
    });

    return () => {
      unsubHotel();
      unsubApp();
    };
  }, []);

  const submitHotelReview = async (review) => {
    try {
      await api.post('/api/feedback/review', review);
    } catch (err) {
      console.error('Failed to submit hotel review via backend:', err);
    }
  };

  const submitAppFeedback = async (feedback) => {
    try {
      await api.post('/api/feedback/app', feedback);
    } catch (err) {
      console.error('Failed to submit app feedback via backend:', err);
    }
  };

  const resolveAppFeedback = async (id, newStatus) => {
    try {
      await api.put(`/api/feedback/app/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to resolve app feedback via backend:', err);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        hotelFeedback,
        appFeedback,
        submitHotelReview,
        submitAppFeedback,
        resolveAppFeedback,
        loading
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
