require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin'); // Importa Firebase Admin
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



// **🔹 Configuración de la base de datos MySQL**
require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Usa el puerto de Railway o el predeterminado de MySQL
});

// **🔹 Conexión a la base de datos**
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL en FreeSQLDatabase');
});

module.exports = db;


// *🟢 Registro de Usuario con Correo y Contraseña*
app.post('/register', async (req, res) => {
    const { nombre, correo, contrasena, telefono, tipo_usuario } = req.body;

    if (!nombre || !correo || !contrasena || !telefono || !tipo_usuario) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
            if (err) {
                console.error("❌ Error en la consulta SELECT:", err);
                return res.status(500).json({ error: 'Error en la base de datos' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "El correo electrónico ya está registrado" });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const sql = 'INSERT INTO usuarios (nombre, correo, contrasena_hash, telefono, tipo_usuario) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nombre, correo, hashedPassword, telefono, tipo_usuario], (err, result) => {
                if (err) {
                    console.error("❌ Error en la consulta INSERT:", err);
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }

                res.status(201).json({ message: "Usuario registrado exitosamente" });
            });
        });
    } catch (error) {
        console.error("🚨 Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// **🟢 Inicio de Sesión con Correo y Contraseña**
app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.error("❌ Error en la base de datos (SELECT):", err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Correo electrónico o contraseña incorrectos." });
        }

        const user = results[0];

        // **Compara la contraseña de manera asíncrona**
        bcrypt.compare(contrasena, user.contrasena_hash, (err, match) => {
            if (err) {
                console.error("❌ Error en la comparación de contraseñas:", err);
                return res.status(500).json({ error: "Error al verificar la contraseña" });
            }

            if (!match) {
                return res.status(401).json({ error: "Correo electrónico o contraseña incorrectos." });
            }

            console.log("✅ Datos del usuario que se envían al frontend:", user); // 👈 Debugging

            // **Enviamos solo los datos necesarios al frontend**
            res.json({
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                correo: user.correo,
                telefono: user.telefono,  // ✅ Incluimos el teléfono
                tipo_usuario: user.tipo_usuario,
            });
        });
    });
});

app.post('/google-login', async (req, res) => {
    const { nombre, correo } = req.body;
  
    if (!correo || !nombre) {
      return res.status(400).json({ error: "Nombre y correo requeridos" });
    }
  
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
      if (err) {
        console.error("🚨 Error en MySQL (SELECT):", err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
  
      if (results.length > 0) {
        console.log("✅ Usuario ya registrado:", results[0]);
        return res.json(results[0]);
      } else {
        const sql = 'INSERT INTO usuarios (nombre, correo, tipo_usuario) VALUES (?, ?, ?)';
        db.query(sql, [nombre, correo, 'Cliente'], (err, result) => {
          if (err) {
            console.error("🚨 Error al registrar usuario:", err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
          }
  
          const nuevoUsuario = {
            id_usuario: result.insertId,
            nombre,
            correo,
            tipo_usuario: 'Cliente',
          };
  
          console.log("✅ Usuario nuevo creado:", nuevoUsuario);
          return res.json(nuevoUsuario);
        });
      }
    });
});
  

// **🟢 Endpoint para registrar una venta**
app.post("/registrar-venta", async (req, res) => {
    const { id_usuario, id_producto, cantidad, total } = req.body;

    if (!id_usuario || !id_producto || !cantidad || !total) {
        return res.status(400).json({ error: "Faltan datos para completar la compra." });
    }

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("❌ Error al iniciar transacción:", err);
            return res.status(500).json({ error: "Error al procesar la compra." });
        }

        try {
            // 1️⃣ **Verificar saldo del usuario**
            const [user] = await db.promise().query(
                "SELECT saldo, clave_seguridad FROM usuarios WHERE id_usuario = ? FOR UPDATE", 
                [id_usuario]
            );

            if (user.length === 0) {
                throw new Error("El usuario no tiene saldo disponible.");
            }

            const saldoActual = user[0].saldo;
            let clave_seguridad = user[0].clave_seguridad;

            if (saldoActual < total) {
                throw new Error("Saldo insuficiente para realizar la compra.");
            }

            // 2️⃣ **Verificar stock**
            const [producto] = await db.promise().query(
                "SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE", 
                [id_producto]
            );

            if (producto.length === 0 || producto[0].stock < cantidad) {
                throw new Error("No hay stock suficiente.");
            }

            // 3️⃣ **Generar clave de seguridad solo si no tiene una**
            if (!clave_seguridad) {
                clave_seguridad = (Math.floor(100000 + Math.random() * 900000)).toString();
                console.log("🔑 Nueva clave generada:", clave_seguridad);

                await db.promise().query(
                    "UPDATE usuarios SET clave_seguridad = ? WHERE id_usuario = ?", 
                    [clave_seguridad, id_usuario]
                );
            } else {
                console.log("✅ Usuario ya tiene clave, se mantiene:", clave_seguridad);
            }

            // 4️⃣ **Registrar la venta**
            const [venta] = await db.promise().query(
                "INSERT INTO ventas (id_usuario, id_producto, cantidad, total, estado) VALUES (?, ?, ?, ?, 'Pagado')", 
                [id_usuario, id_producto, cantidad, total]
            );

            console.log("✅ Venta registrada con ID:", venta.insertId);

            // 5️⃣ **Descontar saldo del usuario**
            const [saldoUpdate] = await db.promise().query(
                "UPDATE usuarios SET saldo = saldo - ? WHERE id_usuario = ? AND saldo >= ?", 
                [total, id_usuario, total]
            );

            if (saldoUpdate.affectedRows === 0) {
                throw new Error("Error al descontar el saldo.");
            }

            console.log("✅ Saldo actualizado correctamente.");

            // 6️⃣ **Registrar la transacción**
            await db.promise().query(
                "INSERT INTO transacciones (id_usuario, id_producto, monto, estado) VALUES (?, ?, ?, 'Completada')", 
                [id_usuario, id_producto, total]
            );

            console.log("✅ Transacción registrada correctamente.");

            // 7️⃣ **Reducir el stock**
            const [stockUpdate] = await db.promise().query(
                "UPDATE productos SET stock = stock - ? WHERE id_producto = ?", 
                [cantidad, id_producto]
            );

            if (stockUpdate.affectedRows === 0) {
                throw new Error("Error al actualizar el stock.");
            }

            console.log("✅ Stock actualizado correctamente.");

            // 8️⃣ **Confirmar la transacción**
            db.commit((err) => {
                if (err) {
                    throw new Error("Error al confirmar la compra.");
                }

                res.status(201).json({ 
                    message: "¡Compra realizada con éxito!", 
                    clave_seguridad: clave_seguridad 
                });
            });

        } catch (error) {
            db.rollback(() => {
                console.error("🚨 Error en la compra:", error.message);
                res.status(400).json({ error: error.message });
            });
        }
    });
});

app.get("/obtener-saldo/:id_usuario", (req, res) => {
    const { id_usuario } = req.params;

    const sql = "SELECT saldo FROM usuarios WHERE id_usuario = ?";
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener saldo:", err);
            return res.status(500).json({ error: "Error interno del servidor." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.json({ saldo: results[0].saldo });
    });
});

// Endpoint para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    const sql = "SELECT id_usuario, nombre, correo, telefono FROM usuarios";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener usuarios:", err);
            return res.status(500).json({ error: "Error en el servidor." });
        }
        res.json(results);
    });
});

// Endpoint para eliminar un usuario por ID
app.delete("/usuarios/:id_usuario", (req, res) => {
    const { id_usuario } = req.params;

    const sqlDelete = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(sqlDelete, [id_usuario], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar usuario:", err);
            return res.status(500).json({ error: "Error al eliminar el usuario." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.status(200).json({ message: "Usuario eliminado correctamente." });
    });
});

app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, telefono } = req.body;
    const sql = "UPDATE usuarios SET nombre = ?, telefono = ? WHERE id_usuario = ?";
    
    db.query(sql, [nombre, telefono, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar usuario" });
        }
        res.json({ message: "Usuario actualizado con éxito" });
    });
});

app.get("/productos", (req, res) => {
    const sql = "SELECT id_producto, nombre, precio, stock FROM productos";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener productos:", err);
            return res.status(500).json({ error: "Error en el servidor al obtener productos." });
        }
        res.json(results);
    });
});

app.post("/productos", (req, res) => {
    const { nombre, stock, precio } = req.body;

    if (!nombre || stock === undefined || precio === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO productos (nombre, stock, precio) VALUES (?, ?, ?)";
    db.query(sql, [nombre, stock, precio], (err, result) => {
        if (err) {
            console.error("❌ Error al agregar producto:", err);
            return res.status(500).json({ error: "Error al agregar el producto." });
        }
        res.status(201).json({ id_producto: result.insertId, nombre, stock, precio });
    });
});

app.delete("/productos/:id_producto", (req, res) => {
    const { id_producto } = req.params;
    const sql = "DELETE FROM productos WHERE id_producto = ?";

    db.query(sql, [id_producto], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar producto:", err);
            return res.status(500).json({ error: "Error en el servidor." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.status(200).json({ message: "Producto eliminado correctamente." });
    });
});

app.get("/ventas/mensuales", (req, res) => {
    const sql = `
        SELECT 
            DATE_FORMAT(fecha_venta, '%Y-%m') AS mes,
            SUM(total) AS total_ventas,
            COUNT(*) AS cantidad_ventas
        FROM ventas
        GROUP BY mes
        ORDER BY mes
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener ventas mensuales:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        res.json(results);
    });
});

app.get("/reporte/top-compradores", (req, res) => {
    const sql = `
        SELECT 
            u.id_usuario,
            u.nombre,
            COUNT(v.id_venta) AS total_compras
        FROM usuarios u
        JOIN ventas v ON u.id_usuario = v.id_usuario
        GROUP BY u.id_usuario, u.nombre
        ORDER BY total_compras DESC
        LIMIT 10
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener top compradores:", err);
            return res.status(500).json({ error: "Error al obtener reporte." });
        }

        res.json(results);
    });
});

app.get("/ventas/detalladas", (req, res) => {
    const sql = "SELECT * FROM vista_ventas_detalladas";
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error al obtener las ventas detalladas:", err);
        return res.status(500).json({ error: "Error al obtener las ventas" });
      }
      res.json(results);
    });
});  

// **🟢 Verificar que el Servidor está Corriendo**
app.get('/', (req, res) => {
    res.send("🚀 Servidor corriendo correctamente");
});

// **Iniciar el servidor**
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
