import React, { createContext, useState, useEffect } from 'react';

export const FeedbackContext = createContext();

const MOCK_HOTEL_REVIEWS = [
  {
    id: 'rev-101',
    hotelId: 'hotel-1',
    guestName: 'Arjun Mehta',
    rating: 5,
    title: 'Outstanding stay & concierge bot!',
    comment: 'The WhatsApp bot made ordering extra linens and room service effortless. Cleanliness was exceptional.',
    experienceRate: 5,
    cleanlinessRate: 5,
    behaviorRate: 5,
    foodRate: 4,
    serviceRate: 5,
    recommend: 'Yes',
    date: '2026-07-06'
  },
  {
    id: 'rev-102',
    hotelId: 'hotel-1',
    guestName: 'Rita Sen',
    rating: 3,
    title: 'Good stay but dining order was late',
    comment: 'Rooms were standard, but staff response time in the dining hall could be improved.',
    experienceRate: 3,
    cleanlinessRate: 4,
    behaviorRate: 3,
    foodRate: 3,
    serviceRate: 3,
    recommend: 'Yes',
    date: '2026-07-09'
  },
  {
    id: 'rev-103',
    hotelId: 'hotel-2',
    guestName: 'Dev Malhotra',
    rating: 4,
    title: 'Beautiful beach side view',
    comment: 'The Goa retreat was extremely clean and staff behaviour was top-notch.',
    experienceRate: 4,
    cleanlinessRate: 5,
    behaviorRate: 5,
    foodRate: 4,
    serviceRate: 4,
    recommend: 'Yes',
    date: '2026-07-11'
  }
];

const MOCK_APP_FEEDBACK = [
  {
    id: 'app-501',
    userName: 'Arvind Sharma',
    role: 'Manager',
    type: 'Bug Report',
    comment: 'The active ticket counter in operations cockpit sometimes lags by a few seconds on refresh.',
    status: 'Open',
    date: '2026-07-10'
  },
  {
    id: 'app-502',
    userName: 'Suresh Mehta',
    role: 'Hotel Owner',
    type: 'Feature Request',
    comment: 'Would love to see historical occupancy analytics exported as PDF or CSV sheets.',
    status: 'Pending',
    date: '2026-07-12'
  }
];

export const FeedbackProvider = ({ children }) => {
  const [hotelFeedback, setHotelFeedback] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_hotel_reviews');
    return saved ? JSON.parse(saved) : MOCK_HOTEL_REVIEWS;
  });

  const [appFeedback, setAppFeedback] = useState(() => {
    const saved = localStorage.getItem('atithisphere_v3_app_feedback');
    return saved ? JSON.parse(saved) : MOCK_APP_FEEDBACK;
  });

  useEffect(() => {
    localStorage.setItem('atithisphere_v3_hotel_reviews', JSON.stringify(hotelFeedback));
  }, [hotelFeedback]);

  useEffect(() => {
    localStorage.setItem('atithisphere_v3_app_feedback', JSON.stringify(appFeedback));
  }, [appFeedback]);

  const submitHotelReview = (review) => {
    const newReview = {
      ...review,
      id: `rev-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0]
    };
    setHotelFeedback((prev) => [newReview, ...prev]);
  };

  const submitAppFeedback = (feedback) => {
    const newItem = {
      ...feedback,
      id: `app-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setAppFeedback((prev) => [newItem, ...prev]);
  };

  const resolveAppFeedback = (id, newStatus) => {
    setAppFeedback((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        hotelFeedback,
        appFeedback,
        submitHotelReview,
        submitAppFeedback,
        resolveAppFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
