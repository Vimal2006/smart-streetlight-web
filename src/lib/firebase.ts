// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBG9lLUSNtIPAmdkflYUdYIb8UyGmI8Zxw",
  authDomain: "smart-street-lighting-f0dbb.firebaseapp.com",
  databaseURL: "https://smart-street-lighting-f0dbb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-street-lighting-f0dbb",
  storageBucket: "smart-street-lighting-f0dbb.appspot.com",
  messagingSenderId: "746322998879",
  appId: "1:746322998879:web:a20a423f641b8386d00dea",
  measurementId: "G-7TPREBFJZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);



