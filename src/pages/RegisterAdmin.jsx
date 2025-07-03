import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import Swal from "sweetalert2";

export default function RegisterAdmin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const tipo = "admin";
  const navigate = useNavigate();

  const validarContraseña = (pass) => {
    return pass.length >= 6 && /[a-zA-Z]/.test(pass) && /\d/.test(pass);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarContraseña(password)) {
      return Swal.fire(
        "Contraseña débil",
        "Debe tener al menos 6 caracteres y combinar letras y números.",
        "warning"
      );
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        email,
        tipo,
        verificado: false,
      });

      await sendEmailVerification(cred.user);
      await auth.signOut();

      Swal.fire(
        "Verifica tu correo",
        "Se ha enviado un enlace de verificación al correo del administrador.",
        "info"
      );

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      let mensaje = "No se pudo registrar el usuario";
      if (error.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado.";
      }
      Swal.fire("Error", mensaje, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Administrador</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input className="form-control" value="admin" readOnly disabled />
        </div>
        <button type="submit" className="btn btn-danger">Registrar Admin</button>
      </form>
    </div>
  );
}
