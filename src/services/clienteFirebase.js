import { db, secondaryAuth } from "./firebase";
import {collection, query, where, getDocs, addDoc,updateDoc, deleteDoc, setDoc, doc} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export const getClientes = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const registrarClienteConAuth = async (datos) => {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
  await sendEmailVerification(cred.user);
  await setDoc(doc(db, "usuarios", cred.user.uid), {
    nombre: datos.nombre,
    comuna: datos.comuna,
    direccion: datos.direccion,
    tipo: "cliente",
    email: datos.email
  });
  await secondaryAuth.signOut();
};

export const updateCliente = async (id, data) => {
  return await updateDoc(doc(db, "usuarios", id), data);
};

export const deleteCliente = async (id) => {
  return await deleteDoc(doc(db, "usuarios", id));
};
