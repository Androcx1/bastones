import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "dispositivos"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDispositivos(lista);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      }
    };

    fetchDispositivos();
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("📋 Reporte de Dispositivos", 14, 20);

    const rows = dispositivos.map((item) => [
      item.id,
      item.nombre || "-",
      item.modelo || "-",
      item.obstaculos_detectados || "-",
      item.oxigeno || "-",
      item.pasos || "-",
      item.temperatura || "-",
    ]);

    autoTable(doc, {
      head: [["ID", "Nombre", "Modelo", "Obstáculos", "Oxígeno", "Pasos", "Temperatura"]],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] },
    });

    doc.save("Reporte_Dispositivos.pdf");
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Logo clickeable */}
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📟 Reporte de Dispositivos</h2>

      <button style={styles.button} onClick={generarPDF}>
        📥 Descargar PDF
      </button>

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Obstáculos</th>
            <th>Oxígeno</th>
            <th>Pasos</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.modelo}</td>
              <td>{item.obstaculos_detectados}</td>
              <td>{item.oxigeno}</td>
              <td>{item.pasos}</td>
              <td>{item.temperatura}</td>
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
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    display: "block",
    margin: "0 auto 30px",
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
