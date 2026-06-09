import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function validarCorreo(correo) {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return correoRegex.test(correo);
}

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [mostrarValidacionUsuario, setMostrarValidacionUsuario] = useState(false);
    const [mostrarValidacionContraseña, setMostrarValidacionContraseña] = useState(false);

    const usernameLimpio = username.trim();

    const usernameCapitalizado =
    usernameLimpio.charAt(0).toUpperCase() +
    usernameLimpio.slice(1);

    const correoLimpio = correo.trim();

    const usernameValidaciones = {
        primerCaracter: /^[A-Za-z]/.test(usernameLimpio),
        largo: usernameLimpio.length >= 3 && usernameLimpio.length <= 20,
        caracteres: /^[A-Za-z][A-Za-z0-9._]*$/.test(usernameLimpio)
    };

    const contraseñaValidaciones = {
        mayuscula: /[A-Z]/.test(contraseña),
        numero: /\d/.test(contraseña),
        especial: /[\W_]/.test(contraseña),
        largo: contraseña.length >= 8
    };

    const usernameValido =
        usernameValidaciones.primerCaracter &&
        usernameValidaciones.largo &&
        usernameValidaciones.caracteres;

    const contraseñaValida =
        contraseñaValidaciones.mayuscula &&
        contraseñaValidaciones.numero &&
        contraseñaValidaciones.especial &&
        contraseñaValidaciones.largo;

    function handleRegistro(event) {
        event.preventDefault();

        if (!usernameValido) {
            setMensaje("El nombre de usuario no cumple los requisitos.");
            return;
        }

        if (!validarCorreo(correoLimpio)) {
            setMensaje("Ingrese un correo válido.");
            return;
        }

        if (!contraseñaValida) {
            setMensaje("La contraseña no cumple los requisitos.");
            return;
        }

        const usuariosGuardados =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const correoExistente = usuariosGuardados.some(
            (usuario) => usuario.correo === correoLimpio
        );

        if (correoExistente) {
            setMensaje("Ese correo ya está registrado.");
            return;
        }

        const nuevoUsuario = {
            username: usernameCapitalizado,
            correo: correoLimpio,
            contraseña: contraseña
        };

        usuariosGuardados.push(nuevoUsuario);

        localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

        setMensaje("Registro exitoso.");

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }

    return (
        <section className = "auth-page">
            <div className = "modal-dialog">
                <div className = "modal-content">
                    <div className = "modal-body">

                        <h1>Registro</h1>

                        <form id = "registroForm" onSubmit = {handleRegistro} autoComplete = "off">

                            <label htmlFor = "registroNombre">
                                Nombre de usuario:
                            </label>

                            <input
                                id = "registroNombre"
                                type = "text"
                                name = "nuevo Usuario"
                                autoComplete = "username"
                                placeholder = "Nombre de usuario"
                                value = {username}
                                onChange = {(event) => setUsername(event.target.value)}
                                onFocus = {() => setMostrarValidacionUsuario(true)}
                                onBlur = {() => setMostrarValidacionUsuario(false)}
                                required
                            />

                            {mostrarValidacionUsuario && (
                                <ul>
                                    <li>{usernameValidaciones.primerCaracter ? "✅" : "❌"} Debe comenzar con una letra</li>
                                    <li>{usernameValidaciones.largo ? "✅" : "❌"} Debe tener entre 3 y 20 caracteres</li>
                                    <li>{usernameValidaciones.caracteres ? "✅" : "❌"} Solo letras, números, punto o guion bajo</li>
                                </ul>
                            )}

                            <label htmlFor = "registroCorreo">
                                Correo electrónico:
                            </label>

                            <input
                                id = "registroCorreo"
                                type = "email"
                                name = "nuevo Correo"
                                autoComplete = "email"
                                placeholder = "Nuevo correo"
                                value = {correo}
                                onChange = {(event) => setCorreo(event.target.value)}
                                required
                            />

                            <label htmlFor = "registroContraseña">
                                Contraseña:
                            </label>

                            <input
                                id = "registroContraseña"
                                type = "password"
                                name = "nueva Contraseña"
                                autoComplete = "new-password"
                                placeholder = "Contraseña"
                                value = {contraseña}
                                onChange = {(event) => setContraseña(event.target.value)}
                                onFocus = {() => setMostrarValidacionContraseña(true)}
                                onBlur = {() => setMostrarValidacionContraseña(false)}
                                required
                            />

                            {mostrarValidacionContraseña && (
                                <ul>
                                    <li>{contraseñaValidaciones.mayuscula ? "✅" : "❌"} Debe incluir una mayúscula</li>
                                    <li>{contraseñaValidaciones.numero ? "✅" : "❌"} Debe incluir un número</li>
                                    <li>{contraseñaValidaciones.especial ? "✅" : "❌"} Debe incluir un carácter especial</li>
                                    <li>{contraseñaValidaciones.largo ? "✅" : "❌"} Mínimo 8 caracteres</li>
                                </ul>
                            )}

                            <button type = "submit">
                                Registrarse
                            </button>

                            <p id = "mensajeRegistro">{mensaje}</p>

                            <p className = "registro-link">
                                ¿Ya tienes cuenta?
                                <Link to = "/login"> Inicia sesión aquí</Link>
                            </p>

                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
}