import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔐 Configuración de Firebase (No expongas esto en producción)
const firebaseConfig = {
  apiKey: "AIzaSyCug5p94WXIqWf2TfQbqHi5GViAYBxD3qc",
  authDomain: "bastones-ceox-5463c.firebaseapp.com",
  projectId: "bastones-ceox-5463c",
  storageBucket: "bastones-ceox-5463c.appspot.com",
  messagingSenderId: "394462832358",
  appId: "1:394462832358:web:ad893bc87192537e3a7d27",
  measurementId: "G-EFL4763P7L"
};

// 🟢 Inicializar Firebase
const app = initializeApp(firebaseConfig, "authApp");
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔹 Agregar parámetros para evitar el error de pop-up bloqueado
googleProvider.setCustomParameters({
  prompt: "select_account", // Siempre pregunta qué cuenta usar
});

export { auth, googleProvider };
