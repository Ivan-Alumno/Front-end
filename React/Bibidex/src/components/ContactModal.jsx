
export default function ContactModal() {
  return (
    <div className = "modal" id = "contactoModal">
      <div className = "modal-dialog">
        <div className = "modal-content">
          <div className = "modal-body">
            <h2>Enviar mensaje</h2>

            <form id = "contactoForm">
              <label htmlFor = "contactoUsuario">Usuario</label>
              <input id = "contactoUsuario" type = "text" placeholder = "Usuario" required/>

              <label htmlFor = "contactoCorreo">Correo electrónico</label>
              <input id = "contactoCorreo" type = "email" placeholder = "Correo electrónico"
                pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}"
                title = "Ingrese un correo válido. Ejemplo: usuario@correo.com"required/>

              <label htmlFor = "contactoMensaje">Mensaje</label>
              <textarea id = "contactoMensaje" placeholder = "Escribe tu duda o sugerencia..."
                rows = "6" required></textarea>

              <button type="submit">Enviar</button>

              <p id="mensajeContacto"></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}