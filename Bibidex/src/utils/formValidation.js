export function sanitizarTexto(texto) {
    if (typeof texto !== "string") {
        return texto;
    }

    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .trim();
}

export function validarCorreo(correo) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(correo);
}

export function validarUrl(url) {
    if (!url) {
        return true;
    }

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function validarNumero(valor) {
    if (valor === "" || valor === undefined || valor === null) {
        return true;
    }

    return !Number.isNaN(Number(valor));
}
