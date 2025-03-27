import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", stock: 0, precio: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/productos");
      console.log("📦 Productos recibidos:", res.data);
      setProductos(res.data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  const handleDelete = async (id_producto) => {
    if (window.confirm("¿Eliminar este producto?")) {
        try {
            await axios.delete(`http://localhost:5000/productos/${id_producto}`);
            fetchProductos(); // 🔄 Recargar lista
        } catch (error) {
            console.error("❌ Error al eliminar producto:", error);
        }
    }
   };


  const handleAdd = async () => {
    if (!nuevoProducto.nombre || nuevoProducto.stock < 0 || nuevoProducto.precio < 0) {
      alert("⚠️ Todos los campos deben ser llenados correctamente.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/productos", {
        nombre: nuevoProducto.nombre,
        stock: Number(nuevoProducto.stock),
        precio: Number(nuevoProducto.precio),
      });
  
      setProductos([...productos, res.data]); // Actualiza la lista con el nuevo producto
      setNuevoProducto({ nombre: "", stock: 0, precio: 0 }); // Limpia el formulario
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
    }
  };  

  return (
    <div style={styles.container}>
      {/* 🔹 LOGO SUPERIOR IZQUIERDO */}
      <div style={styles.logoContainer} onClick={() => navigate("/admin")}>
        <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
      </div>

      <h1 style={styles.title}>Gestión de Productos</h1>

      {/* Formulario para agregar producto */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevoProducto.stock}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
          style={styles.input}
        />
        <button style={styles.addButton} onClick={handleAdd}>
          <PlusCircle size={18} /> Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id_producto}>
                  <td style={styles.td}>{producto.id_producto}</td>
                  <td style={styles.td}>{producto.nombre}</td>
                  <td style={styles.td}>{producto.stock}</td>
                  <td style={styles.td}>${producto.precio}</td>
                  <td style={styles.actions}>
                    <button style={styles.deleteButton} onClick={() => handleDelete(producto.id_producto)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>⚠️ No hay productos registrados.</td>
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
      width: "90px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      color: "#000",
      fontSize: "14px",
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
    deleteButton: {
      backgroundColor: "#ff4444",
      border: "none",
      cursor: "pointer",
      color: "#fff",
      padding: "5px",
      borderRadius: "5px",
    },
    addButton: {
      backgroundColor: "#007bff",
      border: "none",
      cursor: "pointer",
      color: "#fff",
      padding: "10px",
      borderRadius: "5px",
    },
    noData: {
      textAlign: "center",
      padding: "15px",
      fontSize: "16px",
    },
  };

export default AdminProductos;
