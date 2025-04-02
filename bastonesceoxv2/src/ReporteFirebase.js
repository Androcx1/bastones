import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      const snapshot = await getDocs(collection(db, "dispositivos"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDispositivos(lista);
    };

    obtenerDatos();
  }, []);

  return (
    <div style={styles.container}>
      {/* 🔹 Logo clickeable */}
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📟 Reporte de Dispositivos</h2>

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Pasos</th>
            <th>Oxígeno</th>
            <th>Temperatura</th>
            <th>Obstáculos</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.nombre || "-"}</td>
              <td>{item.modelo || "-"}</td>
              <td>{item.pasos || "-"}</td>
              <td>{item.oxigeno || "-"}</td>
              <td>{item.temperatura || "-"}</td>
              <td>{item.obstaculos_detectados || "-"}</td>
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
