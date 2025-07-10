import { db } from "./firebase";
import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  startAfter
} from "firebase/firestore";

const productosRef = collection(db, "productos");

export const addProducto = async (data) => {
  const docRef = await addDoc(productosRef, data);
  return docRef.id;
};

export const updateProducto = async (id, data) => {
  await updateDoc(doc(db, "productos", id), data);
};

export const deleteProducto = async (id) => {
  await deleteDoc(doc(db, "productos", id));
};

export const getProductosByEmpresaPagina = async (
  empresaId,
  filtros,
  orden,
  limite = 5,
  lastVisible = null
) => {
  let q = query(productosRef, where("empresaId", "==", empresaId));

  if (filtros.estado && filtros.estado !== "todos") {
    q = query(q, where("estado", "==", filtros.estado));
  }

  if (orden.campo) {
    q = query(q, orderBy(orden.campo, orden.tipo));
  }

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  q = query(q, limit(limite));

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  return {
    productos: data,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const obtenerTotalProductos = async (empresaId) => {
  const q = query(productosRef, where("empresaId", "==", empresaId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};
