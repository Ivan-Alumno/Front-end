import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function validarCorreo(correo) {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return correoRegex.test(correo);
}

function obtenerValidacionesUsuario(username) {
    return [
        {
            cumplida: /^[A-Za-z]/.test(username),
            texto: "Debe comenzar con una letra"
        },
        {
            cumplida: username.length >= 3 && username.length <= 20,
            texto: "Debe tener entre 3 y 20 caracteres"
        },
        {
            cumplida: /^[A-Za-z][A-Za-z0-9._]*$/.test(username),
            texto: "Solo letras, numeros, punto o guion bajo"
        }
    ];
}

function obtenerValidacionesContrasena(contrasena) {
    return [
        {
            cumplida: /[A-Z]/.test(contrasena),
            texto: "Debe incluir una mayuscula"
        },
        {
            cumplida: /\d/.test(contrasena),
            texto: "Debe incluir un numero"
        },
        {
            cumplida: /[\W_]/.test(contrasena),
            texto: "Debe incluir un caracter especial"
        },
        {
            cumplida: contrasena.length >= 8,
            texto: "Minimo 8 caracteres"
        }
    ];
}

function todasCumplidas(validaciones) {
    return validaciones.every((validacion) => validacion.cumplida);
}

function capitalizarUsername(username) {
    return username.charAt(0).toUpperCase() + username.slice(1);
}

function obtenerUsuariosGuardados() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function obtenerMensajeErrorRegistro(datosRegistro) {
    const {
        usernameValido,
        correoLimpio,
        contrasenaValida,
        contrasena,
        repetirContrasena,
        usuariosGuardados
    } = datosRegistro;

    if (!usernameValido) {
        return "El nombre de usuario no cumple los requisitos.";
    }

    if (!validarCorreo(correoLimpio)) {
        return "Ingrese un correo valido.";
    }

    if (!contrasenaValida) {
        return "La contrasena no cumple los requisitos.";
    }

    if (contrasena !== repetirContrasena) {
        return "Las contrasenas no coinciden.";
    }

    if (usuariosGuardados.some((usuario) => usuario.correo === correoLimpio)) {
        return "Ese correo ya esta registrado.";
    }

    return "";
}

function renderIndicadorValidacion(cumplida) {
    return (
        <span className = {cumplida ? "validacion-ok" : "validacion-error"}>
            {cumplida ? "OK" : "X"}
        </span>
    );
}

function renderListaValidaciones(validaciones) {
    return (
        <ul>
            {validaciones.map((validacion) => (
                <li key = {validacion.texto}>
                    {renderIndicadorValidacion(validacion.cumplida)} {validacion.texto}
                </li>
            ))}
        </ul>
    );
}

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [repetirContrasena, setRepetirContrasena] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [mostrarValidacionUsuario, setMostrarValidacionUsuario] = useState(false);
    const [mostrarValidacionContrasena, setMostrarValidacionContrasena] = useState(false);

    const usernameLimpio = username.trim();
    const correoLimpio = correo.trim();
    const usernameValidaciones = obtenerValidacionesUsuario(usernameLimpio);
    const contrasenaValidaciones = obtenerValidacionesContrasena(contrasena);
    const usernameValido = todasCumplidas(usernameValidaciones);
    const contrasenaValida = todasCumplidas(contrasenaValidaciones);

    function handleRegistro(event) {
        event.preventDefault();

        const usuariosGuardados = obtenerUsuariosGuardados();
        const mensajeError = obtenerMensajeErrorRegistro({
            usernameValido,
            correoLimpio,
            contrasenaValida,
            contrasena,
            repetirContrasena,
            usuariosGuardados
        });

        if (mensajeError) {
            setMensaje(mensajeError);
            return;
        }

        usuariosGuardados.push({
            username: capitalizarUsername(usernameLimpio),
            correo: correoLimpio,
            contrasena: contrasena,
            ["contrase\u00f1a"]: contrasena,
            rol: "usuario"
        });

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
                            <label htmlFor = "registroNombre">Nombre de usuario:</label>
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
                                renderListaValidaciones(usernameValidaciones)
                            )}

                            <label htmlFor = "registroCorreo">Correo electronico:</label>
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

                            <label htmlFor = "registroContrasena">Contrasena:</label>
                            <div className = "campo-contrasena">
                                <input
                                    id = "registroContrasena"
                                    type = {mostrarContrasena ? "text" : "password"}
                                    name = "nueva Contrasena"
                                    autoComplete = "new-password"
                                    placeholder = "Contrasena"
                                    value = {contrasena}
                                    onChange = {(event) => setContrasena(event.target.value)}
                                    onFocus = {() => setMostrarValidacionContrasena(true)}
                                    onBlur = {() => setMostrarValidacionContrasena(false)}
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

                            <label htmlFor = "registroRepetirContrasena">Repetir contrasena:</label>
                            <div className = "campo-contrasena">
                                <input
                                    id = "registroRepetirContrasena"
                                    type = {mostrarContrasena ? "text" : "password"}
                                    name = "repetir Contrasena"
                                    autoComplete = "new-password"
                                    placeholder = "Repetir contrasena"
                                    value = {repetirContrasena}
                                    onChange = {(event) => setRepetirContrasena(event.target.value)}
                                    required
                                />
                            </div>

                            {mostrarValidacionContrasena && renderListaValidaciones(contrasenaValidaciones)}

                            <button type = "submit">Registrarse</button>

                            <p id = "mensajeRegistro">{mensaje}</p>

                            <p className = "registro-link">Ya tienes cuenta?<Link to = "/login"> Inicia sesion aqui</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
