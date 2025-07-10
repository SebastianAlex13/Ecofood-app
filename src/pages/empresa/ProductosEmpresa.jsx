import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import ProductoModal from "../../components/ProductoModal";
import ProductoCard from "../../components/ProductoCard";
import {
  addProducto,
  deleteProducto,
  updateProducto,
  getProductosByEmpresaPagina,
  obtenerTotalProductos,
} from "../../services/productoService";
import Swal from "sweetalert2";

export default function ProductosEmpresa() {
  const { user, userData } = useAuth();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [orden, setOrden] = useState("nombre_asc");
  const [porPagina, setPorPagina] = useState(5);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const cargarProductos = async () => {
    if (!userData?.uid) return;
    const productosFirebase = await getProductosByEmpresaPagina(userData.uid, pagina, porPagina);
    setProductos(productosFirebase);
    const totalProductos = await obtenerTotalProductos(userData.uid);
    setTotal(totalProductos);
  };

  useEffect(() => {
    cargarProductos();
  }, [pagina, porPagina]);

  const handleGuardar = async (form) => {
    try {
      if (productoEditando) {
        await updateProducto(productoEditando.id, form);
        Swal.fire("Actualizado", "Producto modificado con éxito", "success");
      } else {
        await addProducto({ ...form, empresaId: userData.uid });
        Swal.fire("Agregado", "Producto creado con éxito", "success");
      }
      setProductoEditando(null);
      cargarProductos();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (confirm.isConfirmed) {
      await deleteProducto(id);
      cargarProductos();
    }
  };

  const handleCambiarEstado = async (producto) => {
    const nuevoEstado = producto.estado === "disponible" ? "no disponible" : "disponible";
    await updateProducto(producto.id, { estado: nuevoEstado });
    cargarProductos();
  };

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => {
        if (filtro === "todos") return true;
        if (filtro === "por vencer") {
          const dias = (new Date(p.vencimiento) - new Date()) / (1000 * 60 * 60 * 24);
          return dias <= 3 && dias >= 0;
        }
        if (filtro === "vencidos") return new Date(p.vencimiento) < new Date();
        return p.estado === filtro;
      })
      .sort((a, b) => {
        if (orden === "nombre_asc") return a.nombre.localeCompare(b.nombre);
        if (orden === "nombre_desc") return b.nombre.localeCompare(a.nombre);
        if (orden === "precio_asc") return a.precio - b.precio;
        if (orden === "precio_desc") return b.precio - a.precio;
        return 0;
      });
  }, [productos, filtro, orden]);

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="por vencer">Por Vencer</option>
            <option value="vencidos">Vencidos</option>
          </select>
          <select className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="nombre_asc">Nombre A-Z</option>
            <option value="nombre_desc">Nombre Z-A</option>
            <option value="precio_asc">Precio Menor</option>
            <option value="precio_desc">Precio Mayor</option>
          </select>
          <select className="form-select" value={porPagina} onChange={(e) => setPorPagina(parseInt(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Nuevo Producto
        </button>
      </div>

      {productosFiltrados.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onEdit={(p) => {
            setProductoEditando(p);
            setShowModal(true);
          }}
          onDelete={handleEliminar}
          onToggleEstado={handleCambiarEstado}
        />
      ))}

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-outline-primary mx-1" onClick={() => setPagina((p) => Math.max(p - 1, 1))}>
          Anterior
        </button>
        <span className="mx-2 align-self-center">Página {pagina}</span>
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => setPagina((p) => (p * porPagina < total ? p + 1 : p))}
        >
          Siguiente
        </button>
      </div>

      <ProductoModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setProductoEditando(null);
        }}
        onSave={handleGuardar}
        initial={productoEditando}
      />
    </div>
  );
}
