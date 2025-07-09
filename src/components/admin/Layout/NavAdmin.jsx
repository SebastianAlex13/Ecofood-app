import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import CerrarSesion from "../../CerrarSesion";

export default function NavAdmin() {
  const { userData } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin/dashboard">
          Ecofood {userData?.nombre}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/empresas">Empresas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/clientes">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/administradores">Administradores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/usuarios">Usuarios</Link>
            </li>
          </ul>
          <span className="navbar-text">
            <CerrarSesion />
          </span>
        </div>
      </div>
    </nav>
  );
}

