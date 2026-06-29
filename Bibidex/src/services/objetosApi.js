const OBJETOS_STORAGE_KEY = "objetosWiki";

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
