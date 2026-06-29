import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility, Contrast, RotateCcw, Type } from "lucide-react";
import logo from "../assets/Logo.png";
import {
    limpiarAdministracionVerificada,
    usuarioTieneRolAdministrador
} from "../utils/adminUser";

export default function Header() {
    const [usuarioLogueado, setUsuarioLogueado] = useState("");
    const [esAdministrador, setEsAdministrador] = useState(false);
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarMenuAccesibilidad, setMostrarMenuAccesibilidad] = useState(false);
    const [modoContraste, setModoContraste] = useState(false);
    const [tamanoTexto, setTamanoTexto] = useState("normal");

    useEffect(() => {
        function actualizarUsuario() {
            const usuario = localStorage.getItem("usuarioLogueado") || "";

            setUsuarioLogueado(usuario);
            setEsAdministrador(usuarioTieneRolAdministrador());
        }

        actualizarUsuario();
        globalThis.addEventListener("usuarioActualizado", actualizarUsuario);

        return () => {
            globalThis.removeEventListener("usuarioActualizado", actualizarUsuario);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle("modo-alto-contraste", modoContraste);
        document.body.classList.remove("texto-normal", "texto-grande", "texto-muy-grande");
        document.body.classList.add(`texto-${tamanoTexto}`);
    }, [modoContraste, tamanoTexto]);

    function cerrarSesion() {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("correoLogueado");
        localStorage.removeItem("rolLogueado");
        limpiarAdministracionVerificada();

        setUsuarioLogueado("");
        setEsAdministrador(false);
        setMostrarMenuUsuario(false);
        setMostrarMenuAccesibilidad(false);
        setModoContraste(false);
        setTamanoTexto("normal");
        globalThis.dispatchEvent(new Event("usuarioActualizado"));
    }

    function aumentarTexto() {
        setTamanoTexto((tamanoActual) => {
            if (tamanoActual === "normal") return "grande";
            return "muy-grande";
        });
    }

    function disminuirTexto() {
        setTamanoTexto((tamanoActual) => {
            if (tamanoActual === "muy-grande") return "grande";
            return "normal";
        });
    }

    function restablecerAccesibilidad() {
        setModoContraste(false);
        setTamanoTexto("normal");
    }

    return (
        <header>
            <div className = "logo"><img src = {logo} alt = "Logo de la wiki"/></div>

            <nav>
                <ul>
                    <li><Link to = "/">Inicio</Link></li>
                    <li><Link to = "/#beneficios">Beneficios</Link></li>
                    <li><Link to = "/#contacto">Contacto</Link></li>
                    {esAdministrador && (
                        <li>
                            <Link
                                to = "/administracion"
                                onClick = {limpiarAdministracionVerificada}
                            >
                                Administracion
                            </Link>
                        </li>
                    )}

                    <li className = "user-container">
                        {usuarioLogueado ? (
                            <div className = "usuario-menu">
                                <button
                                    className = "login-btn"
                                    type = "button"
                                    onClick = {() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                                >
                                    {usuarioLogueado}
                                </button>

                                {mostrarMenuUsuario && (
                                    <div className = "dropdown-usuario">
                                        <button type = "button" onClick = {cerrarSesion}>
                                            Cerrar sesion
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link className = "login-btn" to = "/login">Iniciar sesion</Link>
                        )}
                    </li>

                    <li className = "accesibilidad-container">
                        <button
                            className = "accesibilidad-btn"
                            type = "button"
                            aria-label = "Abrir opciones de accesibilidad"
                            aria-expanded = {mostrarMenuAccesibilidad}
                            onClick = {() => setMostrarMenuAccesibilidad(!mostrarMenuAccesibilidad)}
                        >
                            <Accessibility size = {22}/>
                        </button>

                        {mostrarMenuAccesibilidad && (
                            <div className = "dropdown-accesibilidad">
                                <button type = "button" onClick = {aumentarTexto}>
                                    <Type size = {16}/> Aumentar texto
                                </button>
                                <button type = "button" onClick = {disminuirTexto}>
                                    <Type size = {14}/> Disminuir texto
                                </button>
                                <button type = "button" onClick = {() => setModoContraste(!modoContraste)}>
                                    <Contrast size = {16}/> Alto contraste
                                </button>
                                <button type = "button" onClick = {restablecerAccesibilidad}>
                                    <RotateCcw size = {16}/> Restablecer
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}
