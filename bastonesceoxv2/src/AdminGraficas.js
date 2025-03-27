import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import autoTable from "jspdf-autotable";

const AdminGraficas = () => {
  const [ventasPorMes, setVentasPorMes] = useState({});
  const [compradores, setCompradores] = useState([]);
  const [ventasDetalladas, setVentasDetalladas] = useState([]); // 👉 NUEVO
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentasMensuales();
    fetchTopCompradores();
    fetchVentasDetalladas(); // 👉 NUEVO
  }, []);

  const fetchVentasMensuales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/ventas/mensuales");
      const data = {};
      res.data.forEach((venta) => {
        data[venta.mes] = venta.total_ventas;
      });
      setVentasPorMes(data);
    } catch (error) {
      console.error("❌ Error al obtener ventas mensuales:", error);
    }
  };

  const fetchTopCompradores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reporte/top-compradores");
      setCompradores(res.data);
    } catch (error) {
      console.error("❌ Error al obtener top compradores:", error);
    }
  };

  const fetchVentasDetalladas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/ventas/detalladas");
      setVentasDetalladas(res.data);
    } catch (error) {
      console.error("❌ Error al obtener ventas detalladas:", error);
    }
  };

  const chartData = {
    labels: Object.keys(ventasPorMes),
    datasets: [
      {
        label: "Ventas Totales por Mes",
        data: Object.values(ventasPorMes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas Totales por Mes", 14, 20);

    const tabla = Object.entries(ventasPorMes).map(([mes, total]) => [
      mes,
      `$${Number(total).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Mes", "Ventas Totales"]],
      body: tabla,
    });

    doc.save("Reporte_Ventas_Mensual.pdf");
  };

  const generarPDFVentasDetalladas = () => {
    const doc = new jsPDF();
    doc.text("Ventas Detalladas", 14, 20);

    const tabla = ventasDetalladas.map((v) => [
      v.id_venta,
      v.cliente,
      v.producto,
      new Date(v.fecha_venta).toLocaleDateString(),
      v.cantidad,
      `$${Number(v.total).toFixed(2)}`,
      v.estado
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Cliente", "Producto", "Fecha", "Cantidad", "Total", "Estado"]],
      body: tabla,
    });

    doc.save("Ventas_Detalladas.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate("/admin")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h1 style={styles.title}>📅 Ventas Totales por Mes</h1>

      <div style={styles.chartContainer}>
        <Bar data={chartData} />
      </div>

      <button style={styles.pdfButton} onClick={generarPDF}>
        📥 Generar Reporte en PDF
      </button>

      <div style={styles.topContainer}>
        <h2>🧑‍💼 Usuarios con más compras</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Total de Compras</th>
            </tr>
          </thead>
          <tbody>
            {compradores.map((user) => (
              <tr key={user.id_usuario}>
                <td>{user.nombre}</td>
                <td>{user.total_compras}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧾 Tabla de ventas detalladas */}
      <div style={styles.topContainer}>
        <h2>📋 Ventas Detalladas</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventasDetalladas.map((v) => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>{v.cliente}</td>
                <td>{v.producto}</td>
                <td>{new Date(v.fecha_venta).toLocaleDateString()}</td>
                <td>{v.cantidad}</td>
                <td>${Number(v.total).toFixed(2)}</td>
                <td>{v.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button style={{ ...styles.pdfButton, marginTop: "15px" }} onClick={generarPDFVentasDetalladas}>
          🧾 Descargar PDF Detallado
        </button>
      </div>
    </div>
  );
};

// 🎨 ESTILOS
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    backgroundImage: "radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
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
  },
  chartContainer: {
    width: "80%",
    maxWidth: "800px",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    marginBottom: "20px",
  },
  pdfButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  topContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "800px",
    marginTop: "30px",
    color: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default AdminGraficas;
