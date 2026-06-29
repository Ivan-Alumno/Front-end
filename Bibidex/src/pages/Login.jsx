import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { asegurarUsuarioAdministrador } from "../utils/adminUser";

function obtenerContrasena(usuario) {
    return usuario.contrasena || usuario["contrase\u00f1a"] || "";
}

export default function Login() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mensaje, setMensaje] = useState("");

    function handleLogin(event) {
        event.preventDefault();
        asegurarUsuarioAdministrador();

        const usuariosGuardados =
            JSON.parse(localStorage.getItem("usuarios")) || [];
        const correoLimpio = correo.trim();

        const usuarioEncontrado = usuariosGuardados.find((usuario) => {
            return (
                usuario.correo === correoLimpio &&
                obtenerContrasena(usuario) === contrasena
            );
        });

        if (!usuarioEncontrado) {
            setMensaje("Usuario o contrasena incorrectos.");
            return;
        }

        localStorage.setItem("usuarioLogueado", usuarioEncontrado.username);
        localStorage.setItem("correoLogueado", usuarioEncontrado.correo);
        localStorage.setItem("rolLogueado", usuarioEncontrado.rol || "usuario");
        globalThis.dispatchEvent(new Event("usuarioActualizado"));

        setMensaje("Ingreso exitoso.");

        setTimeout(() => {
            navigate("/");
        }, 1000);
    }

    return (
        <section className = "auth-page">
            <div className = "modal-dialog">
                <div className = "modal-content">
                    <div className = "modal-body">
                        <h1>Iniciar sesion</h1>

                        <form id = "loginForm" onSubmit = {handleLogin}>
                            <label htmlFor = "loginCorreo">
                                Correo electronico:
                            </label>

                            <input
                                id = "loginCorreo"
                                type = "email"
                                name = "login correo"
                                placeholder = "Correo electronico"
                                value = {correo}
                                onChange = {(event) => setCorreo(event.target.value)}
                                required
                            />

                            <label htmlFor = "loginContrasena">
                                Contrasena:
                            </label>

                            <div className = "campo-contrasena">
                                <input
                                    id = "loginContrasena"
                                    type = {mostrarContrasena ? "text" : "password"}
                                    name = "login contrasena"
                                    autoComplete = "off"
                                    placeholder = "Contrasena"
                                    value = {contrasena}
                                    onChange = {(event) => setContrasena(event.target.value)}
                                    required
                                />

                                <button
                                    className = "mostrar-contrasena-btn"
                                    type = "button"
                                    aria-label = {mostrarContrasena ? "Ocultar contrasena" : "Mostrar contrasena"}
                                    onClick = {() => setMostrarContrasena(!mostrarContrasena)}
                                >
                                    {mostrarContrasena ? <EyeOff size = {20}/> : <Eye size = {20}/>}
                                </button>
                            </div>

                            <p className = "registro-link">
                                No tienes cuenta?
                                <Link to = "/register"> Registrate aqui</Link>
                            </p>

                            <button type = "submit">
                                Ingresar
                            </button>

                            <p id = "mensajeLogin">{mensaje}</p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
