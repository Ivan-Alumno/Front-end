import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import logoMejoras from "../assets/Logo_mejoras.png";
import logoEstadisticas from "../assets/Logo_estadisticas.png";
import logoTablaERP from "../assets/Logo_Tabla_ERP.png";
import logoEquipamiento from "../assets/Logo_equipamiento.png";
import logoCalentadores from "../assets/Logo_calentadores.png"
import { obtenerObjetos } from "../services/objetosApi";

const CATEGORIAS_EQUIPAMIENTO = [
    { titulo: "Peinados", piezas: ["Peinado", "Peinado adicional"] },
    { titulo: "Superior", piezas: ["Superior"] },
    { titulo: "Inferior", piezas: ["Inferior"] },
    { titulo: "Guantes", piezas: ["Guantes"] },
    { titulo: "Zapatos", piezas: ["Zapatos"] }
];

function textoNormalizado(texto) {
    return (texto || "").toLowerCase().trim();
}

function obtenerIniciales(objeto) {
    const texto = objeto.nombrePieza || objeto.nombreConjunto || "?";
    return texto
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0])
        .join("")
        .toUpperCase();
}

function renderEfectos(titulo, efectos) {
    if (!efectos || efectos.length === 0) {
        return null;
    }

    return (
        <div className = "equipamiento-detalle-seccion">
            <h4>{titulo}</h4>
            <ul>
                {efectos.map((efecto) => (
                    <li key = {`${efecto.nombre}-${efecto.valor}-${efecto.condicion || ""}`}>
                        <span>{efecto.nombre} {efecto.condicion || ""}</span>
                        <strong>+{efecto.valor}{efecto.unidad}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Tools() {
    const [modalEquipamientoAbierto, setModalEquipamientoAbierto] = useState(false);
    const [busquedaEquipamiento, setBusquedaEquipamiento] = useState("");
    const [objetos, setObjetos] = useState(() => obtenerObjetos());
    const [objetoSeleccionado, setObjetoSeleccionado] = useState(null);

    const objetosFiltrados = useMemo(() => {
        const busqueda = textoNormalizado(busquedaEquipamiento);

        if (!busqueda) {
            return objetos;
        }

        return objetos.filter((objeto) => {
            const conjunto = textoNormalizado(objeto.nombreConjunto);
            const pieza = textoNormalizado(objeto.nombrePieza);

            return conjunto.includes(busqueda) || pieza.includes(busqueda);
        });
    }, [busquedaEquipamiento, objetos]);

    function abrirModalEquipamiento() {
        setObjetos(obtenerObjetos());
        setBusquedaEquipamiento("");
        setObjetoSeleccionado(null);
        setModalEquipamientoAbierto(true);
    }

    function cerrarModalEquipamiento() {
        setModalEquipamientoAbierto(false);
        setObjetoSeleccionado(null);
    }

    const modalEquipamiento = modalEquipamientoAbierto ? createPortal(
        <div className = "equipamiento-modal-wrapper">
            <button
                type = "button"
                className = "equipamiento-modal-overlay"
                onClick = {cerrarModalEquipamiento}
                aria-label = "Cerrar lista de equipamientos"
            />

            <dialog className = "equipamiento-modal" open>
                <div className = "equipamiento-modal-header">
                    <h2>Lista de equipamientos</h2>
                    <button type = "button" onClick = {cerrarModalEquipamiento} aria-label = "Cerrar">
                        <X size = {24}/>
                    </button>
                </div>

                <label className = "equipamiento-buscador" htmlFor = "busquedaEquipamiento">
                    <Search size = {20}/>
                    <input
                        id = "busquedaEquipamiento"
                        type = "search"
                        placeholder = "Buscar por conjunto o pieza"
                        value = {busquedaEquipamiento}
                        onChange = {(event) => setBusquedaEquipamiento(event.target.value)}
                    />
                </label>

                <div className = "equipamiento-lista">
                    {CATEGORIAS_EQUIPAMIENTO.map((categoria) => {
                        const objetosCategoria = objetosFiltrados.filter((objeto) => (
                            categoria.piezas.includes(objeto.pieza)
                        ));

                        return (
                            <section className = "equipamiento-fila" key = {categoria.titulo}>
                                <h3>{categoria.titulo}</h3>

                                <div className = "equipamiento-items">
                                    {objetosCategoria.length > 0 ? (
                                        objetosCategoria.map((objeto) => (
                                            <button
                                                className = "equipamiento-item"
                                                type = "button"
                                                key = {objeto.id}
                                                onClick = {() => setObjetoSeleccionado(objeto)}
                                                title = {`${objeto.nombrePieza} - ${objeto.nombreConjunto}`}
                                            >
                                                {objeto.imagen ? (
                                                    <img src = {objeto.imagen} alt = {objeto.nombrePieza}/>
                                                ) : (
                                                    <span>{obtenerIniciales(objeto)}</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <p>No hay objetos en esta categoria.</p>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </dialog>

            {objetoSeleccionado && (
                <div className = "equipamiento-detalle-wrapper">
                    <button
                        type = "button"
                        className = "equipamiento-detalle-overlay"
                        onClick = {() => setObjetoSeleccionado(null)}
                        aria-label = "Cerrar detalle"
                    />

                    <dialog className = "equipamiento-detalle" open>
                        <div className = "equipamiento-detalle-header">
                            <h3>{objetoSeleccionado.nombrePieza}</h3>
                            <button type = "button" onClick = {() => setObjetoSeleccionado(null)} aria-label = "Cerrar detalle">
                                <X size = {20}/>
                            </button>
                        </div>

                        <div className = "equipamiento-detalle-resumen">
                            <div className = "equipamiento-detalle-imagen">
                                {objetoSeleccionado.imagen ? (
                                    <img src = {objetoSeleccionado.imagen} alt = {objetoSeleccionado.nombrePieza}/>
                                ) : (
                                    <span>{obtenerIniciales(objetoSeleccionado)}</span>
                                )}
                            </div>

                            <div>
                                <p><strong>Conjunto:</strong> {objetoSeleccionado.nombreConjunto}</p>
                                <p><strong>Pieza:</strong> {objetoSeleccionado.pieza}</p>
                            </div>
                        </div>

                        {renderEfectos("Estadisticas base", objetoSeleccionado.estadisticasBase)}
                        {renderEfectos("Efectos fijos", objetoSeleccionado.efectosEspeciales)}
                        {renderEfectos("Efectos de conjunto", objetoSeleccionado.efectosConjunto)}
                    </dialog>
                </div>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <section id = "herramientas">

            <button className = "contenedor" type = "button" onClick = {abrirModalEquipamiento}>
                <div className = "texto"> <p className = "texto_contenedor"> Lista de equipamientos </p> </div>
                <div className = "icono"> <img src = {logoMejoras} alt = "Lista de equipamientos"/> </div>
            </button>

            <button className = "contenedor" type = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Lista de Ice burnes </p> </div>
                <div className = "icono"> <img src = {logoCalentadores} alt = "Lista de Ice burnes"/> </div>
            </button>

            <button className = "contenedor" type = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Tabla de experiencia </p> </div>
                <div className = "icono"> <img src = {logoTablaERP} alt = "Tabla de experiencia"/> </div>
            </button>

            <button className = "contenedor" type = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Editor de estadisticas </p> </div>
                <div className = "icono"> <img src = {logoEstadisticas} alt = "Editor de estadisticas"/> </div>
            </button>

            <button className = "contenedor" type = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Editor de equipamiento </p> </div>
                <div className = "icono"> <img src = {logoEquipamiento} alt = "Editor de equipamiento"/> </div>
            </button>

            {modalEquipamiento}

        </section>
    );
}
