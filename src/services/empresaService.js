import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getEmpresaById = async (id) => {
  const ref = doc(db, "usuarios", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Empresa no encontrada");
  return { id: snap.id, ...snap.data() };
};

export const updateEmpresa = async (id, data) => {
  const ref = doc(db, "usuarios", id);
  await updateDoc(ref, data);
};
