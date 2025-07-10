import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const { user, userData } = useAuth();
  const [form, setForm] = useState({ nombre: "", direccion: "", comuna: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "usuarios", user.uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ nombre: data.nombre || "", direccion: data.direccion || "", comuna: data.comuna || "" });
      }
      setLoading(false);
    };
    cargarDatos();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "usuarios", user.uid), form);
      Swal.fire("Actualizado", "Datos actualizados correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-4">
      <h2>Perfil de la Empresa</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" value={user?.email} disabled readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
}
