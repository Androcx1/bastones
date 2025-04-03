// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBASfSd6hALKmW4bGYetoAK0aJnkg-obrs",
  authDomain: "proyectoceox.firebaseapp.com",
  projectId: "proyectoceox",
  storageBucket: "proyectoceox.firebasestorage.app",
  messagingSenderId: "497016388925",
  appId: "1:497016388925:web:65d7d2c06400ad699c9954"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { firestore };
