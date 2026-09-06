import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdlnIRCTa5cM6kJX8IZYgZqaj0a6trvOM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "athithi-88d04.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "athithi-88d04",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "athithi-88d04.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "274275993920",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:274275993920:web:a2acf4b4ce5b90957f92a5"
};


if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoPlaceholderOnly')) {
  console.warn('Firebase Warning: VITE_FIREBASE_API_KEY is missing or invalid in your environment.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };


