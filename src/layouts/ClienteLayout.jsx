import React from "react";
import { Outlet } from "react-router-dom";
import CerrarSesion from "../components/CerrarSesion";

export default function ClienteLayout() {
  return (
    <div className="container mt-4">
      <h2>Panel del Cliente</h2>
      <CerrarSesion />
      <hr />
      <Outlet />
    </div>
  );
}
