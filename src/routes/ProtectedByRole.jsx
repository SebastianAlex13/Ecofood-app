import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, children }) {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user || !userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" />;
  }

  return children;
}
