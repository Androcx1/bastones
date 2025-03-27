// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userSession = JSON.parse(localStorage.getItem("userSession"));

  if (!userSession) {
    // Si no hay sesión, redirige al Login
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userSession.tipo_usuario)) {
    // Si el usuario no tiene permisos, redirige a Home
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
