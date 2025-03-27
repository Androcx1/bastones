import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Edit } from "lucide-react"; // Iconos de edición y eliminación

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(false);
  const [usuarioEditado, setUsuarioEditado] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };

  const handleDelete = async (id_usuario) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:5000/usuarios/${id_usuario}`);
        fetchUsuarios();
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
      }
    }
  };

  const handleEdit = (usuario) => {
    if (!usuario) return;
    setUsuarioEditado(usuario);
    setEditando(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/usuarios/${usuarioEditado.id_usuario}`, usuarioEditado);
      setUsuarios(usuarios.map((user) => (user.id_usuario === usuarioEditado.id_usuario ? usuarioEditado : user)));
      setEditando(false);
      alert("✅ Usuario actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert("❌ No se pudo actualizar el usuario.");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🔹 LOGO SUPERIOR IZQUIERDO */}
      <div style={styles.logoContainer} onClick={() => navigate("/admin")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h1 style={styles.title}>Gestión de Usuarios</h1>

      {/* Formulario de edición */}
      {editando && (
        <div style={styles.editForm}>
          <h3>Editar Usuario</h3>
          <input
            type="text"
            value={usuarioEditado.nombre}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, nombre: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            value={usuarioEditado.telefono}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, telefono: e.target.value })}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleUpdate} style={styles.saveButton}>
              Guardar Cambios
            </button>
            <button onClick={() => setEditando(false)} style={styles.cancelButton}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td style={styles.td}>{usuario.id_usuario}</td>
                  <td style={styles.td}>{usuario.nombre}</td>
                  <td style={styles.td}>{usuario.correo}</td>
                  <td style={styles.td}>{usuario.telefono}</td>
                  <td style={styles.actions}>
                    <button style={styles.editButton} onClick={() => handleEdit(usuario)}>
                      <Edit size={18} />
                    </button>
                    <button style={styles.deleteButton} onClick={() => handleDelete(usuario.id_usuario)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
    width: "80px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  tableContainer: {
    width: "80%",
    overflowX: "auto",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff",
  },
  th: {
    backgroundColor: "#007bff",
    padding: "10px",
    borderBottom: "2px solid #6b6b6b",
    textAlign: "center",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #444",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    border: "none",
    cursor: "pointer",
    color: "#000",
    padding: "5px",
    borderRadius: "5px",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    padding: "5px",
    borderRadius: "5px",
  },
  noData: {
    textAlign: "center",
    padding: "15px",
    fontSize: "16px",
  },
  editForm: {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #fff",
    backgroundColor: "#333",
    color: "#fff",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminUsuarios;
