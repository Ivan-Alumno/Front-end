const BIN_ID = "6a456a7ff5f4af5e294f9047"; 
const MASTER_KEY = "$2a$10$wb375W9REBbubtA5Ssdrx.KCGGjRawh9FVPVLICQadXyAIV7PPjxC"; 
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const LOCAL_CREADOS_KEY = "objetos_creados_admin";
const LOCAL_ACTUALIZADOS_KEY = "objetos_actualizados_admin";
const SESSION_ELIMINADOS_KEY = "objetos_eliminados_admin_session";
const API_CACHE_KEY = "objetos_api_cache";

const headers = {
    "Content-Type": "application/json",
    "X-Master-Key": MASTER_KEY,
    "X-Bin-Meta": "false"
};

function crearId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function obtenerObjetosLocal() {
    const creadosLocal = JSON.parse(localStorage.getItem(LOCAL_CREADOS_KEY)) || [];
    const actualizadosLocal = JSON.parse(localStorage.getItem(LOCAL_ACTUALIZADOS_KEY)) || [];
    const eliminadosLocal = obtenerIdsEliminadosSession();

    const mapaObjetos = new Map();

    creadosLocal.forEach((objeto) => {
        mapaObjetos.set(objeto.id, objeto);
    });

    actualizadosLocal.forEach((objeto) => {
        mapaObjetos.set(objeto.id, objeto);
    });

    return Array.from(mapaObjetos.values()).filter(
        (objeto) => !eliminadosLocal.includes(objeto.id)
    );
}

function obtenerIdsEliminadosSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_ELIMINADOS_KEY)) || [];
}

async function obtenerObjetosExternos() {
    const cache = JSON.parse(sessionStorage.getItem(API_CACHE_KEY));
    if (cache && Array.isArray(cache) && cache.length > 0) {
        return cache;
    }

    const respuesta = await fetch(BASE_URL, { method: "GET", headers });
    if (!respuesta.ok) {
        throw new Error("Error al consultar la API externa");
    }

    const datos = await respuesta.json();
    const objetos = Array.isArray(datos) ? datos : datos.record || [];

    sessionStorage.setItem(API_CACHE_KEY, JSON.stringify(objetos));
    return objetos;
}

function fusionarObjetos(objetosExternos, objetosLocales, idsEliminados) {
    const mapaObjetos = new Map();

    objetosExternos.forEach((objeto) => {
        mapaObjetos.set(objeto.id, objeto);
    });

    objetosLocales.forEach((objeto) => {
        mapaObjetos.set(objeto.id, objeto);
    });

    return Array.from(mapaObjetos.values()).filter(
        (objeto) => !idsEliminados.includes(objeto.id)
    );
}

export async function obtenerObjetosAsync() {
    try {
        const objetosInternet = await obtenerObjetosExternos();
        const objetosLocales = obtenerObjetosLocal();
        const eliminadosIdsLocal = obtenerIdsEliminadosSession();

        return fusionarObjetos(objetosInternet, objetosLocales, eliminadosIdsLocal);
    } catch (error) {
        console.error("Error al obtener objetos externos:", error);
        return obtenerObjetosLocal();
    }
}

export function obtenerObjetos() {
    return obtenerObjetosLocal();
}

export async function crearObjeto(datosObjeto) {
    const nuevoObjeto = {
        ...datosObjeto,
        id: crearId()
    };

    const creadosLocal = JSON.parse(localStorage.getItem(LOCAL_CREADOS_KEY)) || [];
    creadosLocal.push(nuevoObjeto);
    localStorage.setItem(LOCAL_CREADOS_KEY, JSON.stringify(creadosLocal));
    globalThis.dispatchEvent(new Event("objetosActualizados"));
    return nuevoObjeto;
}

export async function actualizarObjeto(id, datosObjeto) {
    const creadosLocal = JSON.parse(localStorage.getItem(LOCAL_CREADOS_KEY)) || [];
    const actualizadosLocal = JSON.parse(localStorage.getItem(LOCAL_ACTUALIZADOS_KEY)) || [];
    const objetoActualizado = { ...datosObjeto, id };

    if (creadosLocal.some((objeto) => objeto.id === id)) {
        const creadosActualizados = creadosLocal.map((objeto) =>
            objeto.id === id ? objetoActualizado : objeto
        );
        localStorage.setItem(LOCAL_CREADOS_KEY, JSON.stringify(creadosActualizados));
    } else {
        const actualizadosFiltrados = actualizadosLocal.filter((objeto) => objeto.id !== id);
        actualizadosFiltrados.push(objetoActualizado);
        localStorage.setItem(LOCAL_ACTUALIZADOS_KEY, JSON.stringify(actualizadosFiltrados));
    }

    globalThis.dispatchEvent(new Event("objetosActualizados"));
    return objetoActualizado;
}

export async function eliminarObjeto(id) {
    const creadosLocal = JSON.parse(localStorage.getItem(LOCAL_CREADOS_KEY)) || [];
    const actualizadosLocal = JSON.parse(localStorage.getItem(LOCAL_ACTUALIZADOS_KEY)) || [];

    const creadosFiltrados = creadosLocal.filter((obj) => obj.id !== id);
    const actualizadosFiltrados = actualizadosLocal.filter((obj) => obj.id !== id);

    localStorage.setItem(LOCAL_CREADOS_KEY, JSON.stringify(creadosFiltrados));
    localStorage.setItem(LOCAL_ACTUALIZADOS_KEY, JSON.stringify(actualizadosFiltrados));

    const eliminadosIdsLocal = JSON.parse(sessionStorage.getItem(SESSION_ELIMINADOS_KEY)) || [];
    if (!eliminadosIdsLocal.includes(id)) {
        eliminadosIdsLocal.push(id);
        sessionStorage.setItem(SESSION_ELIMINADOS_KEY, JSON.stringify(eliminadosIdsLocal));
    }
    
    globalThis.dispatchEvent(new Event("objetosActualizados"));
    return true;
}