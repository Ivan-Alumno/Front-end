import { useMemo, useState } from "react";
import { Pencil, Save, Trash2, X, Plus } from "lucide-react";
import {
    actualizarObjeto,
    crearObjeto,
    eliminarObjeto,
    obtenerObjetos
} from "../services/objetosApi";
import { contrasenaAdministracionValida } from "../utils/adminUser";

const FORMULARIO_INICIAL = {
    nombreConjunto: "",
    pieza: "peinado",
    nombrePieza: "",
    imagen: "",
    ataqueFisico: "",
    ataqueMagico: "",
    piezaCritico: "",
    piezaMaximize: "",
    conjuntoCritico: "",
    conjuntoMaximize: "",
    velocidadAtaque: "",
    adaptacion: "",
    polarizado: "",
    enemigoSobre5: "",
    enemigoBajo5: "",
    enemigoSobre10: "",
    enemigoBajo10: "",
    danoContinuo: "",
    danoHabilidades: "",
    danoActive: "",
    danoTenacity: "",
    danoStrength: "",
    danoBravery: ""
};

const OPCIONES_PIEZA = [
    "Peinado",
    "Peinado adicional",
    "Superior",
    "Inferior",
    "Guantes",
    "Zapatos"
];

function agregarEfecto(lista, nombre, valor, unidad = "%") {
    if (valor === "") {
        return lista;
    }

    return [...lista, { nombre, valor: Number(valor), unidad }];
}

function agregarEfectoVida(lista, nombre, umbralVida, bonus) {
    if (umbralVida === "") {
        return lista;
    }

    return [
        ...lista,
        {
            nombre,
            valor: bonus,
            unidad: "%",
            condicion: `${umbralVida}% de vida`
        }
    ];
}

function agregarEfectoAtributosCombinados(lista, active, tenacity, strength, bravery) {
    const valores = [
        { nombre: "Active", valor: Number(active) },
        { nombre: "Tenacity", valor: Number(tenacity) },
        { nombre: "Strength", valor: Number(strength) },
        { nombre: "Bravery", valor: Number(bravery) }
    ].filter(item => item.valor > 0);

    if (valores.length === 0) {
        return lista;
    }

    const nombreValores = valores.map(item => item.nombre).join(" + ");
    const valorTotal = valores.reduce((sum, item) => sum + item.valor, 0);

    return [
        ...lista,
        {
            nombre: `Daño de ${nombreValores}`,
            valor: valorTotal,
            unidad: "%"
        }
    ];
}

function crearEstadisticasBase(formulario) {
    let estadisticas = [];

    estadisticas = agregarEfecto(estadisticas, "Ataque fisico", formulario.ataqueFisico, "");
    estadisticas = agregarEfecto(estadisticas, "Ataque magico", formulario.ataqueMagico, "");

    return estadisticas;
}

function crearEfectosEspeciales(formulario) {
    let efectos = [];

    efectos = agregarEfecto(efectos, "Critico", formulario.piezaCritico);
    efectos = agregarEfecto(efectos, "Maximize", formulario.piezaMaximize);

    return efectos;
}

function crearEfectosConjunto(formulario) {
    let efectos = [];

    efectos = agregarEfecto(efectos, "Critico", formulario.conjuntoCritico);
    efectos = agregarEfecto(efectos, "Maximize", formulario.conjuntoMaximize);
    efectos = agregarEfecto(efectos, "Velocidad de ataque", formulario.velocidadAtaque);
    efectos = agregarEfecto(efectos, "Adaptacion", formulario.adaptacion);
    efectos = agregarEfecto(efectos, "Polarizado", formulario.polarizado);
    efectos = agregarEfectoVida(efectos, "Daño al enemigo sobre", formulario.enemigoSobre5, 5);
    efectos = agregarEfectoVida(efectos, "Daño al enemigo bajo", formulario.enemigoBajo5, 5);
    efectos = agregarEfectoVida(efectos, "Daño al enemigo sobre", formulario.enemigoSobre10, 10);
    efectos = agregarEfectoVida(efectos, "Daño al enemigo bajo", formulario.enemigoBajo10, 10);
    efectos = agregarEfecto(efectos, "Daño continuo del daño hecho", formulario.danoContinuo);
    efectos = agregarEfecto(efectos, "Daño de habilidades", formulario.danoHabilidades);
    efectos = agregarEfectoAtributosCombinados(efectos, formulario.danoActive, formulario.danoTenacity, formulario.danoStrength, formulario.danoBravery);

    return efectos;
}

function normalizarTexto(texto) {
    return texto.trim();
}

function crearObjetoDesdeFormulario(formulario) {
    return {
        nombreConjunto: normalizarTexto(formulario.nombreConjunto),
        pieza: formulario.pieza,
        nombrePieza: normalizarTexto(formulario.nombrePieza),
        imagen: normalizarTexto(formulario.imagen),
        estadisticasBase: crearEstadisticasBase(formulario),
        efectosEspeciales: crearEfectosEspeciales(formulario),
        efectosConjunto: crearEfectosConjunto(formulario)
    };
}

function obtenerValorEfecto(efectos, nombre) {
    return efectos.find((efecto) => efecto.nombre === nombre)?.valor || "";
}

function obtenerValorEfectoVida(efectos, nombre, bonus) {
    const efecto = efectos.find((item) => item.nombre === nombre && item.valor === bonus);
    return efecto?.condicion?.replace("% de vida", "") || "";
}

function crearFormularioDesdeObjeto(objeto) {
    return {
        nombreConjunto: objeto.nombreConjunto,
        pieza: objeto.pieza,
        nombrePieza: objeto.nombrePieza,
        imagen: objeto.imagen || "",
        ataqueFisico: obtenerValorEfecto(objeto.estadisticasBase, "Ataque fisico"),
        ataqueMagico: obtenerValorEfecto(objeto.estadisticasBase, "Ataque magico"),
        piezaCritico: obtenerValorEfecto(objeto.efectosEspeciales, "Critico"),
        piezaMaximize: obtenerValorEfecto(objeto.efectosEspeciales, "Maximize"),
        conjuntoCritico: obtenerValorEfecto(objeto.efectosConjunto, "Critico"),
        conjuntoMaximize: obtenerValorEfecto(objeto.efectosConjunto, "Maximize"),
        velocidadAtaque: obtenerValorEfecto(objeto.efectosConjunto, "Velocidad de ataque"),
        adaptacion: obtenerValorEfecto(objeto.efectosConjunto, "Adaptacion"),
        polarizado: obtenerValorEfecto(objeto.efectosConjunto, "Polarizado"),
        enemigoSobre5: obtenerValorEfectoVida(objeto.efectosConjunto, "Daño al enemigo sobre", 5),
        enemigoBajo5: obtenerValorEfectoVida(objeto.efectosConjunto, "Daño al enemigo bajo", 5),
        enemigoSobre10: obtenerValorEfectoVida(objeto.efectosConjunto, "Daño al enemigo sobre", 10),
        enemigoBajo10: obtenerValorEfectoVida(objeto.efectosConjunto, "Daño al enemigo bajo", 10),
        danoContinuo: obtenerValorEfecto(objeto.efectosConjunto, "Daño continuo del daño hecho"),
        danoHabilidades: obtenerValorEfecto(objeto.efectosConjunto, "Daño de habilidades"),
        danoActive: obtenerValorEfecto(objeto.efectosConjunto, "Daño de Active"),
        danoTenacity: obtenerValorEfecto(objeto.efectosConjunto, "Daño de Tenacity"),
        danoStrength: obtenerValorEfecto(objeto.efectosConjunto, "Daño de Strength"),
        danoBravery: obtenerValorEfecto(objeto.efectosConjunto, "Daño de Bravery")
    };
}

function renderEfectos(titulo, efectos) {
    if (!efectos.length) {
        return null;
    }

    return (
        <div>
            <strong>{titulo}</strong>
            <ul>
                {efectos.map((efecto) => (
                    <li key = {`${efecto.nombre}-${efecto.valor}-${efecto.condicion || ""}`}>
                        {efecto.nombre} {efecto.condicion ? `${efecto.condicion} ` : ""}
                        +{efecto.valor}{efecto.unidad}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function AdministrationObjects() {
    const [objetos, setObjetos] = useState(() => obtenerObjetos());
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
    const [objetoEditando, setObjetoEditando] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    const objetosFiltrados = useMemo(() => {
        const textoBusqueda = busqueda.trim().toLowerCase();

        if (!textoBusqueda) {
            return objetos;
        }

        return objetos.filter((objeto) => {
            const nombreConjunto = (objeto.nombreConjunto || "").toLowerCase();
            const nombrePieza = (objeto.nombrePieza || "").toLowerCase();

            return nombreConjunto.includes(textoBusqueda) || nombrePieza.includes(textoBusqueda);
        });
    }, [busqueda, objetos]);

    function actualizarCampo(campo, valor) {
        setFormulario((formularioActual) => ({
            ...formularioActual,
            [campo]: valor
        }));
    }

    function limpiarFormulario() {
        setFormulario(FORMULARIO_INICIAL);
        setObjetoEditando("");
        setMensaje("");
    }

    function abrirModalNuevo() {
        limpiarFormulario();
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
        limpiarFormulario();
    }

    function guardarObjeto(event) {
        event.preventDefault();

        const objeto = crearObjetoDesdeFormulario(formulario);

        if (!objeto.nombreConjunto || !objeto.nombrePieza) {
            setMensaje("El conjunto y el nombre de la pieza son obligatorios.");
            return;
        }

        if (objetoEditando) {
            actualizarObjeto(objetoEditando, objeto);
            setMensaje("Objeto actualizado.");
        } else {
            crearObjeto(objeto);
            setMensaje("Objeto creado.");
        }

        setObjetos(obtenerObjetos());
        setTimeout(() => {
            cerrarModal();
        }, 500);
    }

    function editarObjeto(objeto) {
        setFormulario(crearFormularioDesdeObjeto(objeto));
        setObjetoEditando(objeto.id);
        setMensaje("");
        setModalAbierto(true);
    }

    function borrarObjeto(id) {
        const confirmarEliminacion = globalThis.confirm("Seguro que quieres eliminar este objeto?");

        if (!confirmarEliminacion) {
            return;
        }

        const contrasenaSistema = globalThis.prompt("Ingresa la contrasena de seguridad.");

        if (!contrasenaAdministracionValida(contrasenaSistema || "")) {
            globalThis.alert("Contrasena de seguridad incorrecta.");
            return;
        }

        eliminarObjeto(id);
        setObjetos(obtenerObjetos());
    }

    return (
        <main className = "administracion-page">
            <section className = "objetos-admin-panel">
                <div className = "objetos-admin-buscador">
                    <label htmlFor = "busquedaObjetos">Buscar objeto</label>
                    <input
                        id = "busquedaObjetos"
                        type = "search"
                        placeholder = "Nombre de conjunto o pieza"
                        value = {busqueda}
                        onChange = {(event) => setBusqueda(event.target.value)}
                    />
                    <button 
                        type = "button" 
                        className = "objeto-agregar-btn"
                        onClick = {abrirModalNuevo}
                    >
                        <Plus size = {20}/> Añadir
                    </button>
                </div>

                <div className = "objetos-admin-lista">
                    {objetosFiltrados.length > 0 ? (
                        objetosFiltrados.map((objeto) => (
                            <article className = "objeto-admin-card" key = {objeto.id}>
                                <h2>{objeto.nombrePieza}</h2>
                                <p><strong>Conjunto:</strong> {objeto.nombreConjunto}</p>
                                <p><strong>Pieza:</strong> {objeto.pieza}</p>
                                {renderEfectos("Estadisticas base:", objeto.estadisticasBase)}
                                {renderEfectos("Efectos fijos:", objeto.efectosEspeciales)}
                                {renderEfectos("Efectos de conjunto", objeto.efectosConjunto)}

                                <div className = "objeto-card-acciones">
                                    <button type = "button" onClick = {() => editarObjeto(objeto)}>
                                        <Pencil size = {18}/> Editar
                                    </button>
                                    <button className = "objeto-eliminar-btn" type = "button" onClick = {() => borrarObjeto(objeto.id)}>
                                        <Trash2 size = {18}/> Eliminar
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className = "objetos-admin-vacio">No hay objetos para mostrar.</p>
                    )}
                </div>

                {modalAbierto && (
                    <div className = "modal-overlay" onClick = {cerrarModal}>
                        <div className = "modal-contenido" onClick = {(e) => e.stopPropagation()}>
                            <div className = "modal-header">
                                <h2>{objetoEditando ? "Editar objeto" : "Agregar objeto"}</h2>
                                <button 
                                    type = "button" 
                                    className = "modal-cerrar-btn"
                                    onClick = {cerrarModal}
                                >
                                    <X size = {24}/>
                                </button>
                            </div>

                            <form className = "objeto-admin-form" onSubmit = {guardarObjeto}>
                                <label htmlFor = "nombreConjunto">Nombre del conjunto</label>
                                <input
                                    id = "nombreConjunto"
                                    value = {formulario.nombreConjunto}
                                    onChange = {(event) => actualizarCampo("nombreConjunto", event.target.value)}
                                    required
                                />

                                <label htmlFor = "nombrePieza">Nombre de la pieza</label>
                                <input
                                    id = "nombrePieza"
                                    value = {formulario.nombrePieza}
                                    onChange = {(event) => actualizarCampo("nombrePieza", event.target.value)}
                                    required
                                />

                                <label htmlFor = "pieza">Pieza</label>
                                <select
                                    id = "pieza"
                                    value = {formulario.pieza}
                                    onChange = {(event) => actualizarCampo("pieza", event.target.value)}
                                >
                                    {OPCIONES_PIEZA.map((pieza) => (
                                        <option key = {pieza} value = {pieza}>{pieza}</option>
                                    ))}
                                </select>

                                <label htmlFor = "imagenObjeto">Imagen opcional URL/base64</label>
                                <input
                                    id = "imagenObjeto"
                                    value = {formulario.imagen}
                                    onChange = {(event) => actualizarCampo("imagen", event.target.value)}
                                />

                                <h3>Estadisticas base</h3>
                                <div className = "objeto-admin-grid">
                                    <input type = "number" placeholder = "Ataque fisico + n" value = {formulario.ataqueFisico} onChange = {(event) => actualizarCampo("ataqueFisico", event.target.value)}/>
                                    <input type = "number" placeholder = "Ataque magico + n" value = {formulario.ataqueMagico} onChange = {(event) => actualizarCampo("ataqueMagico", event.target.value)}/>
                                </div>

                                <h3>Efectos especiales de la pieza</h3>
                                <div className = "objeto-admin-grid">
                                    <input type = "number" placeholder = "Critico + n%" value = {formulario.piezaCritico} onChange = {(event) => actualizarCampo("piezaCritico", event.target.value)}/>
                                    <input type = "number" placeholder = "Maximize + n%" value = {formulario.piezaMaximize} onChange = {(event) => actualizarCampo("piezaMaximize", event.target.value)}/>
                                </div>

                                <h3>Efectos del conjunto</h3>
                                <div className = "objeto-admin-grid">
                                    <input type = "number" placeholder = "Critico + n%" value = {formulario.conjuntoCritico} onChange = {(event) => actualizarCampo("conjuntoCritico", event.target.value)}/>
                                    <input type = "number" placeholder = "Maximize + n%" value = {formulario.conjuntoMaximize} onChange = {(event) => actualizarCampo("conjuntoMaximize", event.target.value)}/>
                                    <input type = "number" placeholder = "Velocidad de ataque + n%" value = {formulario.velocidadAtaque} onChange = {(event) => actualizarCampo("velocidadAtaque", event.target.value)}/>
                                    <input type = "number" placeholder = "Adaptacion + n%" value = {formulario.adaptacion} onChange = {(event) => actualizarCampo("adaptacion", event.target.value)}/>
                                    <input type = "number" placeholder = "Polarizado + n%" value = {formulario.polarizado} onChange = {(event) => actualizarCampo("polarizado", event.target.value)}/>
                                    <input type = "number" placeholder = "Sobre n% vida +5%" value = {formulario.enemigoSobre5} onChange = {(event) => actualizarCampo("enemigoSobre5", event.target.value)}/>
                                    <input type = "number" placeholder = "Bajo n% vida +5%" value = {formulario.enemigoBajo5} onChange = {(event) => actualizarCampo("enemigoBajo5", event.target.value)}/>
                                    <input type = "number" placeholder = "Sobre n% vida +10%" value = {formulario.enemigoSobre10} onChange = {(event) => actualizarCampo("enemigoSobre10", event.target.value)}/>
                                    <input type = "number" placeholder = "Bajo n% vida +10%" value = {formulario.enemigoBajo10} onChange = {(event) => actualizarCampo("enemigoBajo10", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño continuo + n%" value = {formulario.danoContinuo} onChange = {(event) => actualizarCampo("danoContinuo", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño habilidades + n%" value = {formulario.danoHabilidades} onChange = {(event) => actualizarCampo("danoHabilidades", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño Active + n%" value = {formulario.danoActive} onChange = {(event) => actualizarCampo("danoActive", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño Tenacity + n%" value = {formulario.danoTenacity} onChange = {(event) => actualizarCampo("danoTenacity", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño Strength + n%" value = {formulario.danoStrength} onChange = {(event) => actualizarCampo("danoStrength", event.target.value)}/>
                                    <input type = "number" placeholder = "Daño Bravery + n%" value = {formulario.danoBravery} onChange = {(event) => actualizarCampo("danoBravery", event.target.value)}/>
                                </div>

                                <div className = "objeto-admin-acciones">
                                    <button type = "submit"><Save size = {18}/> Guardar</button>
                                    <button type = "button" onClick = {cerrarModal}><X size = {18}/> Cancelar</button>
                                </div>

                                <p className = "objeto-admin-mensaje">{mensaje}</p>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
