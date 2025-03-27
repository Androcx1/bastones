import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Buy = () => {
    const navigate = useNavigate();
    const [saldo, setSaldo] = useState(0); // Estado para el saldo del usuario
    const [formData, setFormData] = useState({
        id_usuario: '',
        id_producto: 1, // Suponiendo que el ID del bastón es 1 en la base de datos
        cantidad: 1,
        total: 2999.99, // Precio del bastón en MXN
        cuidador: '',
        discapacitado: '',
        correo: '',
        direccion: '',
        telefono: '',
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userSession"));
        if (user) {
            setFormData(prevState => ({ ...prevState, id_usuario: user.id_usuario, correo: user.correo }));

            // **Consultar el saldo del usuario**
            axios.get(`http://localhost:5000/obtener-saldo/${user.id_usuario}`)
                .then(response => setSaldo(response.data.saldo))
                .catch(error => console.error("Error al obtener saldo:", error));
        } else {
            alert("Debes iniciar sesión primero.");
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post("http://localhost:5000/registrar-venta", formData);
    
            console.log("🔍 Respuesta del servidor:", response.data); // 🛠 Debugging
    
            if (response.data.clave_seguridad) {
                alert(`¡Compra realizada con éxito! Tu clave de acceso es: ${response.data.clave_seguridad}`);
            } else {
                alert("¡Compra realizada con éxito! Pero no se recibió una clave de acceso.");
            }
    
            navigate("/home");
    
        } catch (error) {
            console.error("❌ Error al registrar la venta:", error);
            alert("Error al realizar la compra.");
        }
    };
    
    

    return (
        <div style={styles.container}>
            {/* 🔹 Header con solo el logo */}
            <header style={styles.header}>
                <div style={styles.logoContainer} onClick={() => navigate('/home')}>
                    <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
                </div>
            </header>

            {/* 🔹 Contenido principal */}
            <div style={styles.content}>
                {/* 🔹 Información del bastón */}
                <div style={styles.infoContainer}>
                    <h1 style={styles.title}>Bastón Inteligente CEOX</h1>
                    <p style={styles.price}>💰 Precio: <strong>$2,999 MXN</strong></p>
                    <p style={styles.balance}>💳 Saldo disponible: <strong>${parseFloat(saldo || 0).toFixed(2)} MXN</strong></p>
                    <p style={styles.description}>
                        El bastón inteligente CEOX está diseñado para mejorar la movilidad de personas con discapacidad visual.
                        Equipado con sensores avanzados, alertas de vibración y conectividad inteligente.
                    </p>

                    {/* 🔹 Características */}
                    <ul style={styles.features}>
                        <li>📡 Sensor ultrasónico para detección de obstáculos</li>
                        <li>🔊 Alertas de vibración</li>
                        <li>📶 Conectividad Bluetooth</li>
                        
                    </ul>

                    <img src="/images/baston.png" alt="Bastón Inteligente" style={styles.image} />
                </div>

                {/* 🔹 Formulario de compra */}
                <div style={styles.formContainer}>
                    <h2 style={styles.formTitle}>Completa tu compra</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label style={styles.label}>Nombre del Cuidador:</label>
                        <input type="text" name="cuidador" value={formData.cuidador} onChange={handleChange} required style={styles.input} />

                        <label style={styles.label}>Nombre del Discapacitado:</label>
                        <input type="text" name="discapacitado" value={formData.discapacitado} onChange={handleChange} required style={styles.input} />

                        <label style={styles.label}>Correo Electrónico:</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required style={styles.input} readOnly />

                        <label style={styles.label}>Dirección:</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required style={styles.input} />

                        <label style={styles.label}>Teléfono:</label>
                        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required style={styles.input} />

                        {/* 🔹 Botones */}
                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.submitButton}>Comprar</button>
                            <button type="button" onClick={() => navigate('/home')} style={styles.cancelButton}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
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
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
        padding: '100px 50px 50px',
        marginTop: '80px',
    },
    infoContainer: {
        flex: 1,
        textAlign: 'center',
        maxWidth: '40%',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    price: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '10px',
    },
    description: {
        fontSize: '18px',
        marginBottom: '15px',
    },
    features: {
        listStyle: 'none',
        padding: 0,
        fontSize: '16px',
        textAlign: 'left',
        maxWidth: '80%',
        margin: '0 auto 20px auto',
    },
    image: {
        width: '100%',
        maxWidth: '300px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '40%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    formTitle: {
        color: '#333',
        fontSize: '22px',
        marginBottom: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px',
        backgroundColor: '#fff',
        color: '#000',
        marginBottom: '10px',
    },
    label: {
        alignSelf: 'start',
        fontWeight: 'bold',
        color: '#333', // 🔹 Color oscuro para las etiquetas
        fontSize: '14px',
        marginBottom: '5px',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#ffffff', // 🔹 Hacer el fondo del formulario blanco
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '40%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    formTitle: {
        color: '#000', // 🔹 Color negro para el título del formulario
        fontSize: '22px',
        marginBottom: '15px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
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
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};

export default Buy;
