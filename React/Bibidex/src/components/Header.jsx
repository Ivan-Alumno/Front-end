import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useEffect, useState } from "react";

export default function Header() {

    const [usuarioLogueado, setUsuarioLogueado] = useState("");
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

    useEffect(() => {
        function actualizarUsuario() {
            const usuario = localStorage.getItem("usuarioLogueado") || "";
            setUsuarioLogueado(usuario);
        }

        actualizarUsuario();

        globalThis.addEventListener("usuarioActualizado", actualizarUsuario);

        return () => {
            globalThis.removeEventListener("usuarioActualizado", actualizarUsuario);
        };
    }, []);

    function cerrarSesion() {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("correoLogueado");

        setUsuarioLogueado("");
        setMostrarMenuUsuario(false);
        globalThis.dispatchEvent(new Event("usuarioActualizado"));
    }

    return (
        <header>

            <div className = "logo"><img src = {logo} alt = "Logo de la wiki" /></div>

            <nav>

                <ul>
                    <li><Link to = "/">Inicio</Link></li>
                    <li><Link to = "/#beneficios">Beneficios</Link></li>
                    <li><Link to = "/contacto">Contacto</Link></li>
                    
                    <li className = "user-container">
                      {usuarioLogueado ? (<div className = "usuario-menu"><button className = "login-btn" type = "button"
                        onClick = {() => setMostrarMenuUsuario(!mostrarMenuUsuario)}>{usuarioLogueado}</button>
                          
                          {mostrarMenuUsuario && (<div className = "dropdown-usuario">
                              <button onClick = {cerrarSesion}>Cerrar sesión</button></div>)}
                        </div>
                      ) : (
                          <Link className = "login-btn" to = "/login">Iniciar sesión</Link>
                      )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}