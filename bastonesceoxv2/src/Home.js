import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaChartBar } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cuidador: '',
    discapacitado: '',
    correo: '',
    direccion: '',
    telefono: '',
  });

  // Función para cerrar sesión
  const handleLogout = () => {
    alert('Sesión cerrada exitosamente.');
    navigate('/');
  };

  // Función para ir a perfil
  const goToProfile = () => {
    navigate('/profile');
  };

  // Función para refrescar la página al hacer clic en el icono de Home o en el logo
  const refreshPage = () => {
    window.location.reload();
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar datos del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("¡Compra realizada con éxito!");
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Header */}
      <header style={styles.header}>
        {/* 🔹 Logo en la izquierda */}
        <div style={styles.logoContainer} onClick={refreshPage}>
          <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
        </div>

        {/* 🔹 Iconos de Navegación */}
        <div style={styles.iconsContainer}>
        <FaHome style={styles.icon} onClick={refreshPage} />
        <FaChartBar style={styles.icon} onClick={() => navigate('/reportes')} />
        <FaUserCircle style={styles.icon} onClick={goToProfile} />
        </div>

        {/* 🔹 Botón de Cerrar Sesión */}
        <button style={styles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      {/* 🔹 Contenido principal */}
      <div style={styles.mainContent}>
        {/* Texto a la izquierda */}
        <div style={styles.textContainer}>
          <h1 style={styles.title}>Bastones CEOX<br />"La tecnología al servicio de la inclusión"</h1>
          <p style={styles.description}>
            El bastón inteligente es una herramienta innovadora diseñada para mejorar la movilidad y 
            seguridad de personas con discapacidad visual. Equipado con sensores avanzados, alertas 
            de vibración y conectividad inteligente, proporciona asistencia en la navegación diaria.
          </p>
          <button style={styles.button} onClick={() => navigate('/buy')}>Comprar</button>
        </div>

        {/* Imagen a la derecha */}
        <div style={styles.imageContainer}>
          <img src="/images/baston.png" alt="Bastón Inteligente" style={styles.image} />
        </div>
      </div>

      {/* 🔹 Modal de Compra */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Formulario de Compra</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Nombre del Cuidador:</label>
              <input type="text" name="cuidador" value={formData.cuidador} onChange={handleChange} required style={styles.input} />

              <label style={styles.label}>Nombre del Discapacitado:</label>
              <input type="text" name="discapacitado" value={formData.discapacitado} onChange={handleChange} required style={styles.input} />

              <label style={styles.label}>Correo Electrónico:</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} required style={styles.input} />

              <label style={styles.label}>Dirección:</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required style={styles.input} />

              <label style={styles.label}>Teléfono:</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required style={styles.input} />

              <button type="submit" style={styles.button}>Enviar</button>
              <button type="button" onClick={() => setShowModal(false)} style={styles.closeButton}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
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
    fontSize: '30px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: '100px 50px 50px',
    marginTop: '80px',
  },
  textContainer: {
    flex: 1,
    color: '#fff',
    maxWidth: '50%',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '12px 24px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    maxWidth: '380px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f8f8f8', // 🔹 Color más suave para mejor visibilidad
    padding: '20px',
    borderRadius: '10px',
    width: '350px', // 🔹 Más pequeño y compacto
    minHeight: '400px', // 🔹 Altura reducida para que no sea tan grande
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', // 🔹 Sombra para destacar el modal
},
form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '10px', // 🔹 Más espacio entre campos para mejorar la legibilidad
},
input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#fff',
},
label: {
    alignSelf: 'start',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
},
buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between', // 🔹 Botones alineados lado a lado
    width: '100%',
    marginTop: '10px',
},
submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    flex: 1, // 🔹 Para que los botones ocupen el mismo tamaño
    marginRight: '5px', // 🔹 Espaciado entre botones
},

  closeButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Home;
