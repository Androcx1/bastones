import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // 🔥 Importar Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBASfSd6hALKmW4bGYetoAK0aJnkg-obrs",
  authDomain: "proyectoceox.firebaseapp.com",
  databaseURL: "https://proyectoceox-default-rtdb.firebaseio.com/", // 🔥 Agregar esto
  projectId: "proyectoceox",
  storageBucket: "proyectoceox.appspot.com",
  messagingSenderId: "497016388925",
  appId: "1:497016388925:web:65d7d2c06400ad699c9954"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app); // 🔥 Realtime Database

export { db };
