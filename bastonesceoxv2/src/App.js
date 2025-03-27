// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes públicos
import Login from './Login';
import Register from './Register';

// Componentes para cliente
import Home from './Home';
import Profile from './Profile';
import Charts from './Charts';
import Buy from './Buy';
import ReportesFirebase from './ReporteFirebase'; // ✅ Nuevo

// Componentes para admin
import AdminDashboard from './AdminDashboard';
import AdminUsuarios from './AdminUsuarios';
import AdminProductos from './AdminProductos';
import AdminGraficas from './AdminGraficas';

// Utilidades
import RainEffect from './RainEffect';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <div>
        <RainEffect /> {/* 🎨 Fondo animado */}
        <Routes>
          {/* 🔓 Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protegidas - Cliente */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy"
            element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <Buy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <Charts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <ReportesFirebase />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Protegidas - Administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AdminProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/graficas"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AdminGraficas />
              </ProtectedRoute>
            }
          />

          {/* ⚠️ Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
