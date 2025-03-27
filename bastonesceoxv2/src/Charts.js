import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase'; // Asegúrate de que aquí se exporta "db"

const Charts = () => {
  const [selectedChart, setSelectedChart] = useState("salud");
  const [datosSalud, setDatosSalud] = useState([]);
  const [datosBaston, setDatosBaston] = useState([]);

  useEffect(() => {
    if (selectedChart === "salud") {
      const saludRef = ref(db, 'reportes/usuarioId123/salud');
      onValue(saludRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const array = Object.values(data);
          setDatosSalud(array);
        }
      });
    } else {
      const bastonRef = ref(db, 'reportes/usuarioId123/baston');
      onValue(bastonRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const array = Object.values(data);
          setDatosBaston(array);
        }
      });
    }
  }, [selectedChart]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Reportes desde Firebase</h1>

      {/* Botones para cambiar entre reportes */}
      <div style={styles.buttonContainer}>
        <button
          style={selectedChart === "salud" ? styles.activeButton : styles.button}
          onClick={() => setSelectedChart("salud")}
        >
          Reporte de Salud
        </button>
        <button
          style={selectedChart === "baston" ? styles.activeButton : styles.button}
          onClick={() => setSelectedChart("baston")}
        >
          Reporte del Bastón
        </button>
      </div>

      {/* Datos dinámicos */}
      <div style={styles.dataContainer}>
        {selectedChart === "salud" ? (
          <>
            <h3>📈 Datos de Salud</h3>
            {datosSalud.map((item, index) => (
              <p key={index}>Pasos: {item.pasos} | Ritmo cardíaco: {item.ritmo_cardiaco}</p>
            ))}
          </>
        ) : (
          <>
            <h3>🦯 Datos del Bastón</h3>
            {datosBaston.map((item, index) => (
              <p key={index}>Batería: {item.bateria}% | Caídas: {item.caidas}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// 🎨 Estilos visuales
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    backgroundImage: 'radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
  },
  buttonContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  button: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  dataContainer: {
    marginTop: '30px',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
    lineHeight: '1.6',
  },
};

export default Charts;
