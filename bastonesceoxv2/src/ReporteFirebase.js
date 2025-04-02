import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dispositivosRef = ref(db, "dispositivos");

    get(dispositivosRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, info]) => ({
          id,
          modelo: info.modelo || "-",
          nombre: info.nombre || "-",
          obstaculos: info.obstaculos_detectados || "-",
          oxigeno: info.oxigeno || "-",
          pasos: info.pasos || "-",
          temperatura: info.temperatura || "-",
        }));
        setDispositivos(lista);
      }
    });
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Dispositivos", 14, 20);

    const rows = dispositivos.map((item) => [
      item.id,
      item.modelo,
      item.nombre,
      item.obstaculos,
      item.oxigeno,
      item.pasos,
      item.temperatura,
    ]);

    autoTable(doc, {
      head: [["ID", "Modelo", "Nombre", "Obstáculos", "Oxígeno", "Pasos", "Temperatura"]],
      body: rows,
      startY: 30,
    });

    doc.save("Reporte_Dispositivos.pdf");
  };

  return (
    <div style={styles.container}>
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
            <th>Modelo</th>
            <th>Nombre</th>
            <th>Obstáculos</th>
            <th>Oxígeno</th>
            <th>Pasos</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((item, idx) => (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.modelo}</td>
              <td>{item.nombre}</td>
              <td>{item.obstaculos}</td>
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
