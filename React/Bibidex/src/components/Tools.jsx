import logoMejoras from "../assets/Logo_mejoras.png";
import logoEstadisticas from "../assets/Logo_estadisticas.png";
import logoTablaERP from "../assets/Logo_Tabla_ERP.png";
import logoEquipamiento from "../assets/Logo_equipamiento.png";
import logoCalentadores from "../assets/Logo_calentadores.png"

export default function Tools() {
    return (
        <section id = "herramientas">

            <button className = "contenedor" type = "button">
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

        </section>
    );
}
