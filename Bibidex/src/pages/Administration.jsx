import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    administracionEstaVerificada,
    contrasenaAdministracionValida,
    marcarAdministracionVerificada
} from "../utils/adminUser";

export default function Administration() {
    const navigate = useNavigate();
    const [contrasenaSistema, setContrasenaSistema] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [administracionVerificada, setAdministracionVerificada] = useState(() => {
        return administracionEstaVerificada();
    });

    function validarAccesoAdministracion(event) {
        event.preventDefault();

        if (!contrasenaAdministracionValida(contrasenaSistema)) {
            setMensaje("Contrasena de administracion incorrecta.");
            return;
        }

        marcarAdministracionVerificada();
        setAdministracionVerificada(true);
        setMensaje("");
        setContrasenaSistema("");
    }

    function abrirAdministracionUsuarios() {
        marcarAdministracionVerificada();
        navigate("/administracion/usuarios");
    }

    return (
        <main className = "administracion-page">
            {!administracionVerificada && (
                <div className = "admin-verificacion-overlay">
                    <form className = "admin-verificacion-modal" onSubmit = {validarAccesoAdministracion}>
                        <h2>Verificacion de administracion</h2>
                        <p>Ingresa la contrasena especial del sistema para continuar.</p>

                        <label htmlFor = "contrasenaAdministracion">Contrasena del sistema</label>
                        <input
                            id = "contrasenaAdministracion"
                            type = "password"
                            value = {contrasenaSistema}
                            onChange = {(event) => setContrasenaSistema(event.target.value)}
                            autoComplete = "off"
                            required
                        />

                        <button type = "submit">Ingresar</button>
                        <p className = "admin-verificacion-mensaje">{mensaje}</p>
                    </form>
                </div>
            )}

            {administracionVerificada && (
                <section className = "administracion-panel">
                    <h1>Administracion</h1>

                    <div className = "administracion-opciones">
                        <button
                            className = "administracion-opcion"
                            type = "button"
                            onClick = {abrirAdministracionUsuarios}
                        >
                            <span>Usuarios</span>
                            <small>Administrar los usuarios registrados.</small>
                        </button>

                        <button
                            className = "administracion-opcion"
                            type = "button"
                            onClick = {() => navigate("/administracion/objetos")}
                        >
                            <span>Objetos</span>
                            <small>Administrar los objetos.</small>
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}
