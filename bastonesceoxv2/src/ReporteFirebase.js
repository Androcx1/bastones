// ReporteFirebase.js
import React, { useEffect, useState } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

// 🔐 Configuración de Firebase Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyBASfSd6hALKmW4bGYetoAK0aJnkg-obrs",
  authDomain: "proyectoceox.firebaseapp.com",
  databaseURL: "https://proyectoceox-default-rtdb.firebaseio.com",
  projectId: "proyectoceox",
  storageBucket: "proyectoceox.appspot.com",
  messagingSenderId: "497016388925",
  appId: "1:497016388925:web:65d7d2c06400ad699c9954"
};

// ✅ Inicializar Firebase solo si no existe ya una app con ese nombre
const app = getApps().find(a => a.name === "databaseApp") 
  || initializeApp(firebaseConfig, "databaseApp");

// ✅ Obtener la base de datos
const db = getDatabase(app);

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        const dispositivosRef = ref(db, "/"); // Raíz de la base
        const snapshot = await get(dispositivosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // Transformar objetos en array de dispositivos
          const lista = Object.entries(data).map(([id, valores]) => ({
            id,
            ...valores
          }));

          setDispositivos(lista);
        } else {
          console.warn("No hay datos disponibles.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchDispositivos();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📋 Dispositivos registrados</h2>
      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Oxígeno</th>
            <th>Obstáculos</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre || "-"}</td>
              <td>{item.oxigeno || "-"}</td>
              <td>{item.obstaculos || "-"}</td>
              <td>{item.temperatura || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    backgroundImage: "radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#fff",
    padding: "100px 20px 40px",
    fontFamily: "sans-serif",
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    top: "15px",
    left: "15px",
    cursor: "pointer",
  },
  logo: {
    width: "90px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tableHead: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
};

export default ReporteFirebase;
