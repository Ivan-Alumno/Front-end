import { Link } from "react-router-dom";

export default function Footer() {
    
    return (
        <footer id = "contacto">

            <address>
                <p>Alumno: Iván José Luis Villagra Letelier</p>
                <p>Profesor: Víctor Armando Vásquez Muñoz</p>
                <p>Asignatura: Programación Front End</p>
                <p>Sección: 2026/O TI3031/D-FB50-N3-P13-C1/D La Granja FB5</p>
            </address>

            <Link className = "contacto-btn" to = "/contactar">¿Tienes dudas? Contactanos.</Link>

        </footer>
    );
}