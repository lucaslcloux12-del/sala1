import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Substitua os valores abaixo pelos dados do seu console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1gAbt7MBLVJWojHOU3HwogaRpIc8pEPQ",
  authDomain: "sala1-a28b1.firebaseapp.com",
  projectId: "sala1-a28b1",
  storageBucket: "sala1-a28b1.firebasestorage.app",
  messagingSenderId: "706678047075",
  appId: "1:706678047075:web:10903aa2014c8330ced356"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
