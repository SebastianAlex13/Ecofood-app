import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";

export default function EmpresaLayout() {
  const { userData } = useAuth();

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/empresa/perfil">
            EcoFood Empresa
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarEmpresa"
            aria-controls="navbarEmpresa"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarEmpresa">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/empresa/perfil">
                  Perfil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/empresa/productos">
                  Productos
                </Link>
              </li>
            </ul>
            <span className="navbar-text me-3">
              {userData?.nombre}
            </span>
            <CerrarSesion />
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
}