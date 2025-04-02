// Charts.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Charts = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "dispositivos"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDatos(lista);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate("/home")}> 
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📊 Vista de Datos de Firestore</h2>

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Nombre</th>
            <th>Obstáculos</th>
            <th>Oxígeno</th>
            <th>Pasos</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.modelo || "-"}</td>
              <td>{item.nombre || "-"}</td>
              <td>{item.obstaculos_detectados || "-"}</td>
              <td>{item.oxigeno || "-"}</td>
              <td>{item.pasos || "-"}</td>
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

export default Charts;
