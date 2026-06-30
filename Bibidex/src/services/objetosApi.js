const OBJETOS_STORAGE_KEY = "objetosWiki";

const OBJETOS_INICIALES = [
    {
        id: "veritas-persona-hair",
        nombreConjunto: "Veritas Persona",
        pieza: "Peinado",
        nombrePieza: "Veritas Persona Hair",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 50, unidad: "" },
            { nombre: "Ataque magico", valor: 50, unidad: "" }
        ],
        efectosEspeciales: [
            { nombre: "Critico", valor: 4, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Critico", valor: 8, unidad: "%" },
            { nombre: "Polarizado", valor: 5, unidad: "%" },
            { nombre: "Daño continuo del daño hecho", valor: 5, unidad: "%" },
            { nombre: "Daño al enemigo bajo", valor: 10, unidad: "%", condicion: "100% de vida" }
        ]
    },
    {
        id: "ballad-hwarang-hair",
        nombreConjunto: "Ballad of Hwarang",
        pieza: "Peinado",
        nombrePieza: "Ballad of Hwarang Hair",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 50, unidad: "" },
            { nombre: "Ataque magico", valor: 50, unidad: "" }
        ],
        efectosEspeciales: [
            { nombre: "Maximize", valor: 4, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Critico", valor: 5, unidad: "%" },
            { nombre: "Maximize", valor: 5, unidad: "%" },
            { nombre: "Daño continuo del daño hecho", valor: 3, unidad: "%" },
            { nombre: "Polarizado", valor: 2, unidad: "%" },
            { nombre: "Daño al enemigo sobre", valor: 10, unidad: "%", condicion: "50% de vida" },
            { nombre: "Daño al enemigo bajo", valor: 10, unidad: "%", condicion: "50% de vida" }
        ]
    },
    {
        id: "aries-aethra-hair",
        nombreConjunto: "Aries Aethra",
        pieza: "Peinado",
        nombrePieza: "Aries Aethra Hair",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 50, unidad: "" },
            { nombre: "Ataque magico", valor: 50, unidad: "" }
        ],
        efectosEspeciales: [
            { nombre: "Critico", valor: 2, unidad: "%" },
            { nombre: "Maximize", valor: 2, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Maximize", valor: 10, unidad: "%" },
            { nombre: "Polarizado", valor: 2, unidad: "%" },
            { nombre: "Daño continuo del daño hecho", valor: 3, unidad: "%" },
            { nombre: "Daño al enemigo bajo", valor: 10, unidad: "%", condicion: "100% de vida" }
        ]
    }
];

function crearId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function guardarObjetos(objetos) {
    localStorage.setItem(OBJETOS_STORAGE_KEY, JSON.stringify(objetos));
}

export function asegurarObjetosIniciales() {
    const datosGuardados = localStorage.getItem(OBJETOS_STORAGE_KEY);

    if (!datosGuardados || datosGuardados === "null") {
        guardarObjetos(OBJETOS_INICIALES);
        return;
    }

    try {
        const objetos = JSON.parse(datosGuardados);

        if (!Array.isArray(objetos) || objetos.length === 0) {
            guardarObjetos(OBJETOS_INICIALES);
        }
    } catch {
        guardarObjetos(OBJETOS_INICIALES);
    }
}

export function obtenerObjetos() {
    asegurarObjetosIniciales();

    try {
        return JSON.parse(localStorage.getItem(OBJETOS_STORAGE_KEY)) || [];
    } catch {
        guardarObjetos(OBJETOS_INICIALES);
        return OBJETOS_INICIALES;
    }
}

export function crearObjeto(datosObjeto) {
    const objetos = obtenerObjetos();
    const nuevoObjeto = {
        ...datosObjeto,
        id: crearId()
    };

    guardarObjetos([...objetos, nuevoObjeto]);
    return nuevoObjeto;
}

export function actualizarObjeto(id, datosObjeto) {
    const objetos = obtenerObjetos();
    const objetosActualizados = objetos.map((objeto) => {
        if (objeto.id !== id) {
            return objeto;
        }

        return {
            ...datosObjeto,
            id
        };
    });

    guardarObjetos(objetosActualizados);
    return objetosActualizados.find((objeto) => objeto.id === id);
}

export function eliminarObjeto(id) {
    const objetos = obtenerObjetos();
    guardarObjetos(objetos.filter((objeto) => objeto.id !== id));
}
