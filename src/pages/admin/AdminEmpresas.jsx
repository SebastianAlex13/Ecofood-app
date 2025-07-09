import React from "react";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const empresasRef = collection(db, "empresas");

  const cargarEmpresas = async () => {
    const snapshot = await getDocs(empresasRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEmpresas(lista);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await updateDoc(doc(db, "empresas", editandoId), form);
        Swal.fire("Actualizado", "Empresa editada correctamente", "success");
      } else {
        await addDoc(empresasRef, form);
        Swal.fire("Agregado", "Empresa registrada con éxito", "success");
      }

      setForm({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
      });
      setEditandoId(null);
      cargarEmpresas();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar la empresa", "error");
    }
  };

  const eliminarEmpresa = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "empresas", id));
      cargarEmpresas();
      Swal.fire("Eliminado", "Empresa eliminada", "success");
    }
  };

  const iniciarEdicion = (empresa) => {
    setEditandoId(empresa.id);
    setForm({
      nombre: empresa.nombre,
      rut: empresa.rut,
      direccion: empresa.direccion,
      comuna: empresa.comuna,
      email: empresa.email,
      telefono: empresa.telefono,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Gestor de Empresas</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          {Object.entries(form).map(([key, value]) => (
            <div className="col-md-4 mb-2" key={key}>
              <input
                type="text"
                className="form-control"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key !== "telefono"}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success">
          {editandoId ? "Guardar Cambios" : "Registrar Empresa"}
        </button>
        {editandoId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditandoId(null);
              setForm({
                nombre: "",
                rut: "",
                direccion: "",
                comuna: "",
                email: "",
                telefono: "",
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h4>Empresas registradas</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rut</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.rut}</td>
              <td>{e.direccion}</td>
              <td>{e.comuna}</td>
              <td>{e.email}</td>
              <td>{e.telefono}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => iniciarEdicion(e)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarEmpresa(e.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
