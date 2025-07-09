import React from "react";
import { Outlet } from "react-router-dom";
import NavAdmin from "../components/admin/layout/NavAdmin";

export default function AdminLayout() {
  return (
    <div>
      <NavAdmin />
      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
}
