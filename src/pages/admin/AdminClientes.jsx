import React from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes, registrarClienteConAuth,
  updateCliente, deleteCliente
} from "../../services/clienteFirebase";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", email: "", comuna: "", direccion: "", password: "" });
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const guardar = async () => {
    if (clienteActivo) {
      await updateCliente(clienteActivo.id, formData);
    } else {
      await registrarClienteConAuth(formData);
    }
    setShowModal(false);
    cargarClientes();
  };

  const eliminar = async (id) => {
    const res = await Swal.fire({ title: "¿Eliminar?", showCancelButton: true });
    if (res.isConfirmed) {
      await deleteCliente(id);
      cargarClientes();
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Clientes</h3>
      <button className="btn btn-primary" onClick={() => {
        setClienteActivo(null);
        setFormData({ nombre: "", email: "", comuna: "", direccion: "", password: "" });
        setShowModal(true);
      }}>Nuevo Cliente</button>

      <table className="table mt-3">
        <thead><tr><th>Nombre</th><th>Email</th><th>Comuna</th><th>Acciones</th></tr></thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => {
                  setClienteActivo(c);
                  setFormData(c);
                  setShowModal(true);
                }}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5>{clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}</h5></div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input className="form-control mb-2" placeholder="Comuna" value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })} />
                <input className="form-control mb-2" placeholder="Dirección" value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                {!clienteActivo && (
                  <input className="form-control mb-2" type="password" placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
