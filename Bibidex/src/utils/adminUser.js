export const ADMIN_USER = {
    username: "Elgrande",
    correo: "Administrador@Bibidex.cl",
    contrasena: "123456D*",
    ["contrase\u00f1a"]: "123456D*",
    rol: "administrador"
};

const ADMIN_ACCESS_KEY = "administracionVerificada";

export function asegurarUsuarioAdministrador() {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const indiceAdministrador = usuariosGuardados.findIndex((usuario) => {
        return usuario.correo?.toLowerCase() === ADMIN_USER.correo.toLowerCase();
    });

    if (indiceAdministrador === -1) {
        localStorage.setItem("usuarios", JSON.stringify([...usuariosGuardados, ADMIN_USER]));
        return;
    }

    const usuariosActualizados = [...usuariosGuardados];

    usuariosActualizados[indiceAdministrador] = {
        ...usuariosActualizados[indiceAdministrador],
        ...ADMIN_USER
    };

    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
}

export function usuarioTieneRolAdministrador() {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado") || "";
    const correoLogueado = localStorage.getItem("correoLogueado") || "";
    const rolLogueado = localStorage.getItem("rolLogueado") || "";

    return (
        rolLogueado === ADMIN_USER.rol &&
        usuarioLogueado === ADMIN_USER.username &&
        correoLogueado.toLowerCase() === ADMIN_USER.correo.toLowerCase()
    );
}

export function contrasenaAdministracionValida(contrasena) {
    return contrasena === ADMIN_USER.contrasena;
}

export function marcarAdministracionVerificada() {
    sessionStorage.setItem(ADMIN_ACCESS_KEY, "true");
}

export function limpiarAdministracionVerificada() {
    sessionStorage.removeItem(ADMIN_ACCESS_KEY);
}

export function administracionEstaVerificada() {
    return sessionStorage.getItem(ADMIN_ACCESS_KEY) === "true";
}
