import React, { useEffect, useState } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

// 📊 Importar componentes de Recharts (lineal)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🔐 Configuración nueva de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCX6UeqXw8rAyXUnMI_piNuaSSVMj9EGTU",
  authDomain: "bastonesceoxs.firebaseapp.com",
  databaseURL: "https://bastonesceoxs-default-rtdb.firebaseio.com",
  projectId: "bastonesceoxs",
  storageBucket: "bastonesceoxs.firebasestorage.app",
  messagingSenderId: "938831071340",
  appId: "1:938831071340:web:b74f499dd3586ca3e47049",
  measurementId: "G-X2FCSFYKZ0",
};

// ✅ Inicializar Firebase
const app =
  getApps().find((a) => a.name === "databaseApp") ||
  initializeApp(firebaseConfig, "databaseApp");
const db = getDatabase(app);

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatosActuales = async () => {
      try {
        const refDatos = ref(db, "/datos_actuales");
        const snapshot = await get(refDatos);

        if (snapshot.exists()) {
          const data = snapshot.val();

          const lista = Object.entries(data).map(([id, valores]) => ({
            id,
            ...valores,
          }));

          setDispositivos(lista);
        } else {
          console.warn("No hay datos disponibles.");
        }
      } catch (error) {
        console.error("Error al obtener datos_actuales:", error);
      }
    };

    fetchDatosActuales();
  }, []);

  const exportarPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text("📋 Reporte de dispositivos", 14, 15);

    const headers = [
      ["ID", "Oxígeno", "Temperatura", "Pasos", "Obstáculos", "Batería"],
    ];
    const rows = dispositivos.map((item) => [
      item.id,
      item.oxigeno || "-",
      item.temperatura || "-",
      item.pasos || "-",
      item.obstaculo_detectado || "-",
      item.bateria || "-",
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
      theme: "grid",
    });

    doc.save("reporte_dispositivos.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>📋 Datos actuales de los dispositivos</h2>

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Oxígeno</th>
            <th>Temperatura</th>
            <th>Pasos</th>
            <th>Obstáculos</th>
            <th>Batería</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.oxigeno || "-"}</td>
              <td>{item.temperatura || "-"}</td>
              <td>{item.pasos || "-"}</td>
              <td>{item.obstaculo_detectado || "-"}</td>
              <td>{item.bateria || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={exportarPDF} style={styles.button}>
        📄 Exportar a PDF
      </button>

      <h3 style={styles.chartTitle}>📈 Oxígeno y Temperatura por dispositivo</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dispositivos}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="oxigeno"
            stroke="#82ca9d"
            name="Oxígeno"
          />
          <Line
            type="monotone"
            dataKey="temperatura"
            stroke="#8884d8"
            name="Temperatura"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    backgroundImage:
      "radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)",
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
  button: {
    marginTop: "30px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  chartTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "40px",
    textAlign: "center",
  },
};

export default ReporteFirebase;
