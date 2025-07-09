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
  const [nueva, setNueva] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ ...nueva });

  const cargarEmpresas = async () => {
    const ref = collection(db, "empresas");
    const snapshot = await getDocs(ref);
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEmpresas(datos);
  };

  const crearEmpresa = async () => {
    await addDoc(collection(db, "empresas"), nueva);
    Swal.fire("Creada", "Empresa registrada correctamente", "success");
    setNueva({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });
    cargarEmpresas();
  };

  const eliminarEmpresa = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "empresas", id));
      Swal.fire("Eliminada", "Empresa eliminada correctamente", "success");
      cargarEmpresas();
    }
  };

  const iniciarEdicion = (empresa) => {
    setEditId(empresa.id);
    setEditData({ ...empresa });
  };

  const guardarEdicion = async () => {
    await updateDoc(doc(db, "empresas", editId), editData);
    setEditId(null);
    Swal.fire("Actualizada", "Empresa actualizada correctamente", "success");
    cargarEmpresas();
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Empresas</h3>

      <h5 className="mt-4">Registrar nueva empresa</h5>
      <div className="row">
        {Object.keys(nueva).map((key) => (
          <div className="col-md-4 mb-2" key={key}>
            <input
              type="text"
              className="form-control"
              placeholder={key}
              value={nueva[key]}
              onChange={(e) => setNueva({ ...nueva, [key]: e.target.value })}
            />
          </div>
        ))}
        <div className="col-md-12">
          <button className="btn btn-success" onClick={crearEmpresa}>
            Registrar Empresa
          </button>
        </div>
      </div>

      <h5 className="mt-5">Listado de empresas</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
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
              {Object.keys(nueva).map((key) => (
                <td key={key}>
                  {editId === e.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editData[key] || ""}
                      onChange={(ev) =>
                        setEditData({ ...editData, [key]: ev.target.value })
                      }
                    />
                  ) : (
                    e[key]
                  )}
                </td>
              ))}
              <td>
                {editId === e.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={guardarEdicion}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
