import RegistroModal from "../components/RegistroModal";

const [show, setShow] = useState(true);
<RegistroModal show={mostrarModal} handleClose={cerrarModal} handleRegister={registrarUsuario} />, 

<input
  type="password"
  className="form-control mb-2"
  placeholder="Contraseña"
  value={formData.password}
  onChange={(e) =>
    setFormData({ ...formData, password: e.target.value })
  }
/>
