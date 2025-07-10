import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";

export default function ProductoModal({ show, onHide, onSave, initial }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: 1,
    precio: 0,
    estado: "disponible",
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const hoy = new Date();
    const vencimiento = new Date(form.vencimiento);
    hoy.setHours(0, 0, 0, 0);
    vencimiento.setHours(0, 0, 0, 0);

    if (vencimiento < hoy) {
      return Swal.fire("Error", "La fecha de vencimiento no puede ser anterior a hoy", "warning");
    }

    onSave(form);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{initial ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.entries(form).map(([key, value]) => (
          key !== "estado" && (
            <div className="mb-3" key={key}>
              <label className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === "precio" || key === "cantidad" ? "number" : key === "vencimiento" ? "date" : "text"}
                className="form-control"
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          )
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
