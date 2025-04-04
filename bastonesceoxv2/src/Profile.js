import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaChartBar } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar los datos del usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userSession");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      alert("Debes iniciar sesión primero.");
      navigate("/");
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    alert('Sesión cerrada exitosamente.');
    localStorage.removeItem("userSession");
    navigate('/');
  };

  // Función para ir a Home
  const goToHome = () => {
    navigate('/home');
  };

  // Función para refrescar la página al hacer clic en el icono de perfil
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Header */}
      <header style={styles.header}>
        {/* 🔹 Logo en la izquierda */}
        <div style={styles.logoContainer} onClick={goToHome}>
          <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
        </div>

        {/* 🔹 Iconos de Navegación */}
        <div style={styles.iconsContainer}>
          <FaHome style={styles.icon} onClick={goToHome} />
          <FaChartBar style={styles.icon} onClick={() => navigate('/reportes')} />
          <FaUserCircle style={styles.icon} onClick={refreshPage} />
        </div>

        {/* 🔹 Botón de Cerrar Sesión */}
        <button style={styles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      {/* 🔹 Contenido del Perfil */}
      <main style={styles.mainContent}>
        <h2 style={styles.title}>Mi Perfil</h2>
        {user ? (
          <>
            <p style={styles.text}><strong>Nombre:</strong> {user.nombre}</p>
            <p style={styles.text}><strong>Correo:</strong> {user.correo}</p>
            <p style={styles.text}><strong>Teléfono:</strong> {user.telefono}</p> {/* ✅ Se agrega el número de teléfono */}
          </>
        ) : (
          <p style={styles.text}>Cargando datos...</p>
        )}
      </main>
    </div>
  );
};

// 🎨 **Estilos**
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    backgroundImage: 'radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#808080',
    padding: '15px 20px',
    borderBottom: '2px solid #6b6b6b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    width: '100%',
    top: '0',
    zIndex: '1000',
  },
  logoContainer: {
    cursor: 'pointer',
  },
  logo: {
    height: '50px',
  },
  iconsContainer: {
    display: 'flex',
    gap: '25px',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: '40px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  logoutButton: {
    position: 'absolute',
    top: '15px',
    right: '50px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '16px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '80px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    color: '#bbb',
    marginBottom: '10px',
  },
};

export default Profile;
