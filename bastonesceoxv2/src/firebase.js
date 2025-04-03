// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // 👈 Realtime Database

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "bastones-ceox-5463c.firebaseapp.com",
  databaseURL: "https://bastones-ceox-5463c-default-rtdb.firebaseio.com", // ✅ ESTE LINK ES CLAVE
  projectId: "bastones-ceox-5463c",
  storageBucket: "bastones-ceox-5463c.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app); // 👈 Realtime DB aquí

export { db };
