import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { contrasenaAdministracionValida } from "../utils/adminUser";

function obtenerContrasena(usuario) {
    return usuario.contrasena || usuario["contrase\u00f1a"] || "";
}

export default function AdministrationUsers() {
    const [busqueda, setBusqueda] = useState("");
    const [usuarios, setUsuarios] = useState(() => {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    });
    const [contrasenasVisibles, setContrasenasVisibles] = useState({});

    const usuariosFiltrados = useMemo(() => {
        const textoBusqueda = busqueda.trim().toLowerCase();

        if (!textoBusqueda) {
            return usuarios;
        }

        return usuarios.filter((usuario) => {
            const nickname = (usuario.username || "").toLowerCase();
            const correo = (usuario.correo || "").toLowerCase();

            return nickname.includes(textoBusqueda) || correo.includes(textoBusqueda);
        });
    }, [busqueda, usuarios]);

    function alternarContrasena(correoUsuario) {
        setContrasenasVisibles((visiblesActuales) => ({
            ...visiblesActuales,
            [correoUsuario]: !visiblesActuales[correoUsuario]
        }));
    }

    function eliminarUsuario(correoUsuario) {
        const confirmarEliminacion = globalThis.confirm(
            "Seguro que quieres eliminar este usuario? Esta accion no se puede deshacer."
        );

        if (!confirmarEliminacion) {
            return;
        }

        const contrasenaSistema = globalThis.prompt(
            "Ingresa la contrasena de seguridad para eliminar este usuario."
        );

        if (!contrasenaAdministracionValida(contrasenaSistema || "")) {
            globalThis.alert("Contrasena de seguridad incorrecta.");
            return;
        }

        const usuariosActualizados = usuarios.filter((usuario) => usuario.correo !== correoUsuario);

        setUsuarios(usuariosActualizados);
        localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
    }

    return (
        <main className = "administracion-page">
            <section className = "usuarios-admin-panel">
                <div className = "usuarios-admin-buscador">
                    <label htmlFor = "busquedaUsuarios">Buscar usuario</label>
                    <div className="buscador-fila">
                        <input
                            id = "busquedaUsuarios"
                            type = "search"
                            placeholder = "Nickname o correo"
                            value = {busqueda}
                            onChange = {(event) => setBusqueda(event.target.value)}
                        />
                    </div>
                </div>

                <div className = "usuarios-admin-lista">
                    {usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map((usuario) => {
                            const contrasenaVisible = contrasenasVisibles[usuario.correo];
                            const contrasena = obtenerContrasena(usuario);

                            return (
                                <article className = "usuario-admin-card" key = {usuario.correo}>
                                    <h2>{usuario.username || "Usuario sin nickname"}</h2>
                                    <p><strong>Correo:</strong> {usuario.correo || "Sin correo"}</p>
                                    <p>
                                        <strong>Contrasena:</strong>{" "}
                                        {contrasenaVisible ? contrasena : "********"}
                                    </p>
                                    
                                    {/* CORRECCIÓN AQUÍ: Agrupamos ambos botones en la misma fila de acciones como en objetos */}
                                    <div className="usuario-card-acciones">
                                        <button type = "button" onClick = {() => alternarContrasena(usuario.correo)}>
                                            {contrasenaVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        </button>

                                        <button
                                            className = "eliminar-usuario-btn"
                                            type = "button"
                                            aria-label = {`Eliminar usuario ${usuario.username || usuario.correo}`}
                                            onClick = {() => eliminarUsuario(usuario.correo)}
                                        >
                                            <Trash2 size = {18}/> Eliminar
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <p className = "usuarios-admin-vacio">No hay usuarios para mostrar.</p>
                    )}
                </div>
            </section>
        </main>
    );
}