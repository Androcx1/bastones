import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(''); // ✅ Nuevo campo de teléfono
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword || !phone) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/register', {
                nombre: name,
                correo: email,
                contrasena: password,
                telefono: phone,  // 📌 Se agrega el teléfono aquí
                tipo_usuario: 'Cliente',
            });
            alert('¡Registro exitoso!');
            setError('');
            navigate('/');
        } catch (error) {
            console.error("🚨 Error al registrar usuario:", error);
            setError('Ocurrió un error al registrar el usuario.');
        }
    };    

    return (
        <div style={styles.container}>
            <h2 style={{ color: '#fff' }}>Registro</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="name" style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingresa tu nombre"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ingresa tu correo"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="phone" style={styles.label}>Número de Teléfono:</label> {/* ✅ Nuevo campo */}
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ingresa tu número de teléfono"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="confirmPassword" style={styles.label}>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        style={styles.input}
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};

// 🎨 **Estilos**
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#1e1e1e',
        border: '2px solid #888',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        color: '#fff',
        position: 'relative',
        zIndex: 1,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        color: '#bbb',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#121212',
        border: '1px solid #444',
        borderRadius: '4px',
        color: '#fff',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    error: {
        color: '#f44336',
        marginBottom: '10px',
    },
    linkText: {
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#bbb',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Register;
