import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ReporteFirebase = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispositivos = async () => {
      const dispositivosRef = ref(db, "dispositivos");
      const snapshot = await get(dispositivosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, valores]) => ({
          id,
          ...valores
        }));
        setDispositivos(lista);
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
              <td>{item.nombre}</td>
              <td>{item.oxigeno}</td>
              <td>{item.obstaculos}</td>
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
