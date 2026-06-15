import { Link } from "react-router-dom";

export default function Footer() {
    
    return (
        <footer id = "contacto">

            <h2>Contacto</h2>

            <address>
                <p>Email: Ivan.Villagra03@inacapmail.cl</p>
                <p>Teléfono: +xxx xxxx xxxx</p>
                <p>Dirección: Calle falsa 123, Ciudad, País</p>
            </address>

            <Link className = "contacto-btn" to = "/contactar">¿Tienes dudas? Contactanos.</Link>

        </footer>
    );
}