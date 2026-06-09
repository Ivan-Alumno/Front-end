import { useState } from "react";
import { useNavigate } from "react-router-dom";

function validarCorreo(correo) {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return correoRegex.test(correo);
}

export default function Contact() {
    const navigate = useNavigate();

    const usuarioGuardado = localStorage.getItem("usuarioLogueado") || "";
    const correoGuardado = localStorage.getItem("correoLogueado") || "";

    const [usuario] = useState(usuarioGuardado);
    const [correo] = useState(correoGuardado);
    const [mensajeContacto, setMensajeContacto] = useState("");
    const [mensaje, setMensaje] = useState("");

    function handleContacto(event) {
        event.preventDefault();

        if (!usuarioGuardado || !correoGuardado) {
            navigate("/login");
            return;
        }

        if (!mensajeContacto.trim()) {
            setMensaje("Debe escribir un mensaje.");
            return;
        }

        if (!validarCorreo(correo)) {
            setMensaje("Correo inválido.");
            return;
        }

        setMensaje("Mensaje enviado correctamente.");

        setTimeout(() => {
            setMensajeContacto("");
            setMensaje("");
            navigate("/");
        }, 1500);
    }

    return (
        <section id="contacto" className="contact-page">
            <h1>Contacto</h1>

            <p>
                ¿Tienes dudas, sugerencias o problemas? Completa el formulario
                y te responderemos pronto.
            </p>

            <form id="contactoForm" onSubmit={handleContacto}>
                <label htmlFor="contactoUsuario">Usuario</label>

                <input
                    id="contactoUsuario"
                    type="text"
                    placeholder="Tu usuario"
                    value={usuario}
                    readOnly
                />

                <label htmlFor="contactoCorreo">Correo electrónico</label>

                <input
                    id="contactoCorreo"
                    type="email"
                    placeholder="Tu correo"
                    value={correo}
                    readOnly
                />

                <label htmlFor="contactoMensaje">Mensaje</label>

                <textarea
                    id="contactoMensaje"
                    placeholder="Escribe tu duda o sugerencia..."
                    rows="6"
                    value={mensajeContacto}
                    onChange={(event) => setMensajeContacto(event.target.value)}
                    required
                ></textarea>

                <button type="submit">
                    Enviar
                </button>

                <p id="mensajeContacto">{mensaje}</p>
            </form>
        </section>
    );
}