import { useNavigate } from "react-router-dom";

export default function Administration() {
    const navigate = useNavigate();

    return (
        <main className = "administracion-page">
            <section className = "administracion-panel">
                <h1>Administracion</h1>

                <div className = "administracion-opciones">
                    <button
                        className = "administracion-opcion"
                        type = "button"
                        onClick = {() => navigate("/administracion/usuarios")}
                    >
                        <span>Usuarios</span>
                        <small>Administrar los usuarios registrados.</small>
                    </button>

                    <button className = "administracion-opcion" type = "button">
                        <span>Objetos</span>
                        <small>Administrar los objetos.</small>
                    </button>
                </div>
            </section>
        </main>
    );
}
