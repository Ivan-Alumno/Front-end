import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");

    function handleLogin(event) {
        event.preventDefault();

        const usuariosGuardados =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const correoLimpio = correo.trim();

        const usuarioEncontrado = usuariosGuardados.find((usuario) => {
    console.log("Comparando con:", usuario);
    console.log("Correo coincide:", usuario.correo === correoLimpio);
    console.log("Contraseña coincide:", usuario.contraseña === contraseña);

    return (
        usuario.correo === correoLimpio &&
        usuario.contraseña === contraseña
    );
});

        if (!usuarioEncontrado) {
            setMensaje("Usuario o contraseña incorrectos.");
            return;
        }

        localStorage.setItem("usuarioLogueado", usuarioEncontrado.username);
        localStorage.setItem("correoLogueado", usuarioEncontrado.correo);
        
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

                        <h1>Iniciar sesión</h1>

                        <form id = "loginForm" onSubmit = {handleLogin}>

                            <label htmlFor = "loginCorreo">
                                Correo electrónico:
                            </label>

                            <input
                                id = "loginCorreo"
                                type = "email"
                                name = "login correo"
                                placeholder = "Correo electrónico"
                                value = {correo}
                                onChange = {(event) => setCorreo(event.target.value)}
                                required
                            />

                            <label htmlFor = "loginContraseña">
                                Contraseña:
                            </label>

                            <input
                                id = "loginContraseña"
                                type = "password"
                                name = "login contraseña"
                                autoComplete = "off"
                                placeholder = "Contraseña"
                                value = {contraseña}
                                onChange = {(event) => setContraseña(event.target.value)}
                                required
                            />

                            <p className = "registro-link">
                                ¿No tienes cuenta?
                                <Link to = "/register"> Regístrate aquí</Link>
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