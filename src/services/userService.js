
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";



/**
 * Obtener datos del usuario desde Firestore
 * @param {string} uid
 * @returns {object|null}
 */
export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data(); // Datos del usuario
    } else {
      throw new Error("Usuario no encontrado en Firestore");
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

/**
 * Guarda los datos del usuario al momento de registrarse
 * @param {string} uid
 * @param {object} data - {nombre, tipo, email}
 */
export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    throw error;
  }
};
