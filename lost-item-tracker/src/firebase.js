import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkw7PDEHfnD261paMcRAEHJEOBqZsHQCU",
  authDomain: "lost-item-tracker-7898e.firebaseapp.com",
  projectId: "lost-item-tracker-7898e",
  storageBucket: "lost-item-tracker-7898e.firebasestorage.app",
  messagingSenderId: "979062830192",
  appId: "1:979062830192:web:b6db059150ee0a3748f0b5",
  measurementId: "G-GCD8NSEW9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
