// src/firebase/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBVOXqVL1M5nGIhFefZ5ox4dYbbnNTegbw",
  authDomain: "bastonceoxs.firebaseapp.com",
  databaseURL: "https://bastonceoxs-default-rtdb.firebaseio.com",
  projectId: "bastonceoxs",
  storageBucket: "bastonceoxs.appspot.com", // ✅ CORREGIDO
  messagingSenderId: "141437132215",
  appId: "1:141437132215:web:2ec44916fa616503e89c32",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };
