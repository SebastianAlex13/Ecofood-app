import React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";


export default function Register() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const tipo = "cliente";
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

      // Guardar en Firestore
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        email,
        direccion,
        comuna,
        telefono,
        tipo,
        verificado: false,
      });

      // Enviar verificación de correo
      await sendEmailVerification(cred.user);

      // Cerrar sesión para evitar acceso sin verificar
      await auth.signOut();

      Swal.fire(
        "Verifica tu correo",
        "Se ha enviado un enlace de verificación a tu correo. Debes verificarlo antes de iniciar sesión.",
        "info"
      );

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);

      let mensaje = "No se pudo registrar el usuario";
      if (error.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado.";
      } else if (error.code === "auth/invalid-email") {
        mensaje = "El correo electrónico no es válido.";
      } else if (error.code === "auth/weak-password") {
        mensaje = "La contraseña es muy débil.";
      }

      Swal.fire("Error", mensaje, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
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
          <div className="form-text">
            Mínimo 6 caracteres, incluyendo letras y números.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input className="form-control" value="cliente" readOnly disabled />
        </div>
        <button type="submit" className="btn btn-success">
          Registrar
        </button>
      </form>
    </div>
  );
}
