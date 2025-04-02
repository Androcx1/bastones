// src/firebase/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 👈 Cambiamos de Realtime a Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCX6UeqXw8rAyXUnMI_piNuaSSVMj9EGTU",
  authDomain: "bastonesceoxs.firebaseapp.com",
  projectId: "bastonesceoxs",
  storageBucket: "bastonesceoxs.appspot.com",
  messagingSenderId: "938831071340",
  appId: "1:938831071340:web:0679e36326657e6de47049",
  measurementId: "G-7TQ86DE3QW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🟢 Inicializa Firestore
const db = getFirestore(app);

export { db };
