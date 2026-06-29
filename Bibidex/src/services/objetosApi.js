const OBJETOS_STORAGE_KEY = "objetosWiki";

const OBJETOS_INICIALES = [
    {
        id: "dragon-cabello",
        nombreConjunto: "Dragon",
        pieza: "peinado",
        nombrePieza: "Cabello Dragon",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 120 },
            { nombre: "Ataque magico", valor: 120 }
        ],
        efectosEspeciales: [
            { nombre: "Critico", valor: 4, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Velocidad de ataque", valor: 3, unidad: "%" }
        ]
    },
    {
        id: "dragon-superior",
        nombreConjunto: "Dragon",
        pieza: "superior",
        nombrePieza: "Superior Dragon",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 250 },
            { nombre: "Ataque magico", valor: 250 }
        ],
        efectosEspeciales: [
            { nombre: "Maximize", valor: 5, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Critico", valor: 4, unidad: "%" },
            { nombre: "Daño de habilidades", valor: 6, unidad: "%" }
        ]
    },
    {
        id: "hielo-guantes",
        nombreConjunto: "Hielo",
        pieza: "guantes",
        nombrePieza: "Guantes de Hielo",
        imagen: "",
        estadisticasBase: [
            { nombre: "Ataque fisico", valor: 95 },
            { nombre: "Ataque magico", valor: 110 }
        ],
        efectosEspeciales: [
            { nombre: "Critico", valor: 3, unidad: "%" },
            { nombre: "Maximize", valor: 3, unidad: "%" }
        ],
        efectosConjunto: [
            { nombre: "Adaptacion", valor: 2, unidad: "%" }
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
    if (!localStorage.getItem(OBJETOS_STORAGE_KEY)) {
        guardarObjetos(OBJETOS_INICIALES);
    }
}

export function obtenerObjetos() {
    asegurarObjetosIniciales();
    return JSON.parse(localStorage.getItem(OBJETOS_STORAGE_KEY)) || [];
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
