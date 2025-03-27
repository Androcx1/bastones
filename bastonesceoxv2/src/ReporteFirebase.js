// ReporteFirebase.js
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ReporteFirebase = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raizRef = ref(db, "bastonCEOXS");

    onValue(raizRef, (snapshot) => {
      const data = snapshot.val();
      const result = [];

      if (data) {
        Object.entries(data).forEach(([dispositivoId, dispositivoData]) => {
          const id_usuario = dispositivoData.id_usuario || "Desconocido";
          const id_dispositivo = dispositivoData.id_dispositivo || dispositivoId;

          if (dispositivoData.Registros_Sensores) {
            Object.entries(dispositivoData.Registros_Sensores).forEach(
              ([registroId, registroData]) => {
                result.push({
                  usuario: id_usuario,
                  dispositivo: id_dispositivo,
                  ...registroData,
                });
              }
            );
          }
        });
      }

      setDatos(result);
    });
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Registros de Sensores", 14, 20);

    const rows = datos.map((item) => [
      item.usuario || "-",
      item.dispositivo || "-",
      item.fecha_registro || "-",
      item.frecuencia_cardiaca || "-",
      item.oxigeno || "-",
      item.temperatura || "-",
      item.pasos || "-",
      item.obstaculo_detectado || "-",
    ]);

    autoTable(doc, {
      head: [
        [
          "Usuario",
          "Dispositivo",
          "Fecha",
          "Frecuencia Cardíaca",
          "Oxigenación",
          "Temperatura",
          "Pasos",
          "Obstáculos",
        ],
      ],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] },
    });

    doc.save("Reporte_Sensores.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📊 Reporte de Registros del Bastón</h2>
      <button style={styles.button} onClick={generarPDF}>
        📥 Descargar PDF
      </button>

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>Usuario</th>
            <th>Dispositivo</th>
            <th>Fecha</th>
            <th>Frecuencia</th>
            <th>Oxigenación</th>
            <th>Temperatura</th>
            <th>Pasos</th>
            <th>Obstáculos</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr key={index}>
              <td>{item.usuario}</td>
              <td>{item.dispositivo}</td>
              <td>{item.fecha_registro}</td>
              <td>{item.frecuencia_cardiaca || "-"}</td>
              <td>{item.oxigeno || "-"}</td>
              <td>{item.temperatura || "-"}</td>
              <td>{item.pasos || "-"}</td>
              <td>{item.obstaculo_detectado || "-"}</td>
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
