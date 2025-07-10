import React from "react";
import dayjs from "dayjs";

export default function ProductoCard({ producto, onEdit, onDelete, onToggleEstado }) {
  const esGratuito = producto.precio === 0;
  const diasRestantes = dayjs(producto.vencimiento).diff(dayjs(), 'day');
  const porVencer = diasRestantes <= 3 && diasRestantes >= 0;
  const vencido = dayjs(producto.vencimiento).isBefore(dayjs(), 'day');

  return (
    <div className={`card mb-3 ${vencido ? 'border-danger' : porVencer ? 'border-warning' : 'border-success'}`}>
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p><strong>Precio:</strong> {esGratuito ? 'Gratuito' : `$${producto.precio}`}</p>
        <p><strong>Cantidad:</strong> {producto.cantidad}</p>
        <p><strong>Vence:</strong> {producto.vencimiento} {porVencer && '(Por vencer)'} {vencido && '(Vencido)'}</p>
        <p><strong>Estado:</strong> {producto.estado}</p>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEdit(producto)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(producto.id)}>Eliminar</button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onToggleEstado(producto)}
          >
            {producto.estado === "disponible" ? "Marcar como no disponible" : "Marcar como disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}