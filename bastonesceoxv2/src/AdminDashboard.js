import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, BarChart2, LogOut } from 'lucide-react'; // Iconos

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userSession"); // Elimina sesión
    navigate("/"); // Redirige al Login
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoContainer} onClick={() => window.location.reload()}>
          <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
        </div>

        {/* Opciones del menú con iconos */}
        <button style={styles.menuItem} onClick={() => handleNavigation("/admin/usuarios")}>
          <Users size={20} style={styles.icon} /> Gestión de Usuarios
        </button>
        <button style={styles.menuItem} onClick={() => handleNavigation("/admin/productos")}>
          <Package size={20} style={styles.icon} /> Gestión de Productos
        </button>
        <button style={styles.menuItem} onClick={() => handleNavigation("/admin/graficas")}>
          <BarChart2 size={20} style={styles.icon} /> Gráficas
        </button>
        
        {/* Botón de Cerrar Sesión con icono */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} style={styles.icon} /> Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div style={styles.content}>
        <h1>Panel de Administrador</h1>
        <p>Bienvenido, Admin. Aquí puedes gestionar usuarios y el sistema.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#000",
    backgroundImage: "radial-gradient(circle, rgba(0,0,255,0.3) 10%, transparent 70%)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#fff",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1e1e1e",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: "2px solid #6b6b6b",
  },
  logoContainer: {
    cursor: "pointer",
    marginBottom: "20px",
  },
  logo: {
    width: "150px",
  },
  menuItem: {
    width: "100%",
    padding: "12px",
    margin: "5px 0",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    gap: "10px",
    transition: "background 0.3s ease",
  },
  menuItemHover: {
    backgroundColor: "#0056b3",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    gap: "10px",
    transition: "background 0.3s ease",
  },
  logoutButtonHover: {
    backgroundColor: "#cc0000",
  },
  icon: {
    marginRight: "10px",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  }
};

export default AdminDashboard;
