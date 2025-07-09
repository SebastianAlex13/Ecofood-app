import React from "react";
import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterAdmin from "../pages/RegisterAdmin";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import Home from "../pages/Home";

// Protecciones
import ProtectedRoute from "./ProtectedByRole";
import ProtectedByRole from "./ProtectedByRole";

// Layouts
import ClienteLayout from "../layouts/ClienteLayout";
import AdminLayout from "../layouts/AdminLayout";

// Cliente
import ClienteDashboard from "../pages/cliente/ClienteDashboard";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminAdministradores from "../pages/admin/AdminAdministradores";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/registeradmin" element={<RegisterAdmin />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />


      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Cliente */}
      <Route
        path="/cliente"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<ClienteDashboard />} />
      </Route>

      {/* Admin */}
      <Route
  path="/admin"
  element={
    <ProtectedByRole allowed={["admin"]}>
      <AdminLayout />
    </ProtectedByRole>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="productos" element={<AdminProductos />} />
  <Route path="usuarios" element={<AdminUsuarios />} />
  <Route path="clientes" element={<AdminClientes />} />
  <Route path="administradores" element={<AdminAdministradores />} />
  <Route path="empresas" element={<AdminEmpresas />} />
</Route>

    </Routes>
  );
}
