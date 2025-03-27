import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (!user.email) throw new Error("No se pudo obtener el correo electrónico.");
            console.log("✅ Usuario autenticado con Google:", user);

            const response = await axios.post("http://localhost:5000/google-login", {
                nombre: user.displayName,
                correo: user.email,
                token: await user.getIdToken(),
            });

            localStorage.setItem("userSession", JSON.stringify(response.data));
            alert("¡Inicio de sesión con Google exitoso!");
            navigate("/home");
        } catch (err) {
            console.error("🚨 Error al iniciar sesión con Google:", err);
            setError("Error al iniciar sesión con Google.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) return setError("Completa todos los campos.");

        try {
            const response = await axios.post("http://localhost:5000/login", { correo: email, contrasena: password });

            localStorage.setItem("userSession", JSON.stringify(response.data));
            alert("¡Inicio de sesión exitoso!");

            response.data.tipo_usuario === "Administrador" ? navigate("/admin") : navigate("/home");
        } catch (error) {
            console.error("🚨 Error al iniciar sesión:", error);
            setError("Correo o contraseña incorrectos.");
        }
    };

    return (
        <div style={styles.container}>
            <img src="/images/logob.jpg" alt="Logo" style={styles.logo} />
            <h2 style={styles.title}>Iniciar Sesión</h2>
            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" style={styles.input} />
                <div style={styles.separator}></div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" style={styles.input} />
                <div style={styles.separator}></div>
                <button type="submit" style={styles.button}>Iniciar Sesión</button>
            </form>

            <div style={styles.separator}></div>

            <button onClick={handleGoogleSignIn} style={styles.googleButton}>
                <FcGoogle size={20} style={{ marginRight: "8px" }} /> Iniciar con Google
            </button>

            <p style={styles.linkText}>
                ¿No tienes cuenta?{" "}
                <Link to="/register" style={styles.link}>Regístrate aquí</Link>
            </p>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "350px",
        margin: "50px auto",
        padding: "15px",
        backgroundColor: "#1e1e1e",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "#fff",
        textAlign: "center",
    },
    logo: {
        width: "120px",
        marginBottom: "10px",
    },
    title: {
        fontSize: "20px",
        marginBottom: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        backgroundColor: "#121212",
        border: "1px solid #444",
        borderRadius: "4px",
        color: "#fff",
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        width: "100%",
    },
    googleButton: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        fontWeight: "bold",
    },
    error: {
        color: "#f44336",
        marginBottom: "8px",
        fontSize: "14px",
    },
    linkText: {
        marginTop: "10px",
        fontSize: "12px",
        color: "#bbb",
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "bold",
    },
    separator: {
        height: "15px",
    },
};

export default Login;
