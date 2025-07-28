import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "user") return <Navigate to="/MainPageUser" />;
    if (user.role === "criador_instrucoes") return <Navigate to="/MainPageCI" />;
    if (user.role === "admin") return <Navigate to="/MainPageAdmin" />;
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;