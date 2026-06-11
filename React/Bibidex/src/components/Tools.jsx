import logoMejoras from "../assets/Logo_mejoras.png";
import logoEstadisticas from "../assets/Logo_estadisticas.png";
import logoTablaERP from "../assets/Logo_Tabla_ERP.png";
import logoEquipamiento from "../assets/Logo_Equipamiento.png";

export default function Tools() {
    return (
        
        <section id = "herramientas">

            <a className = "contenedor" href = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Mejoras de equipamiento </p> </div>
                <div className = "icono"> <img src = {logoMejoras} alt = "Mejoras"/> </div>
            </a>

            <a className = "contenedor" href = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Editor de estadísticas </p> </div>
                <div className = "icono"> <img src = {logoEstadisticas} alt = "Estadísticas"/> </div>
            </a>

            <a className = "contenedor" href = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Tabla de Experiencia </p> </div>
                <div className = "icono"> <img src = {logoTablaERP} alt = "Tabla ERP"/> </div>
            </a>

            <a className = "contenedor" href = "button">
                <div className = "texto"> <p className = "texto_contenedor"> Editor de equipamiento </p> </div>
                <div className = "icono"> <img src = {logoEquipamiento} alt = "Equipamiento"/> </div>
            </a>

        </section>
    );
}