export default function AuthModal() {
  return (
    <div className = "modal" id = "authModal">
      <div className = "modal-dialog">
        <div className = "modal-content">
          <div className = "tabs" id = "authTabs">
            <button className = "tab-btn active" data-tab = "login">
              Iniciar sesión
            </button>

            <button className = "tab-btn" data-tab = "registro">
              Registro
            </button>
          </div>

          <div className = "modal-body">
            <div className = "tab-content active" id = "login">
              <form id = "loginForm">
                <label htmlFor = "loginCorreo">Correo electrónico:</label>

                <input
                  id = "loginCorreo"
                  type = "email"
                  placeholder = "Correo electrónico"
                  pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}"
                  title = "Ingrese un correo válido. Ejemplo: usuario@correo.com"
                  required
                />

                <label htmlFor = "loginContraseña">Contraseña:</label>

                <input
                  id = "loginContraseña"
                  type = "password"
                  placeholder = "Contraseña"
                  autoComplete = "current-password"
                  title = "Ingrese su contraseña"
                  required
                />

                <p className = "registro-link">
                  ¿No tienes cuenta?<span id = "irRegistro"> Regístrate aquí</span>
                </p>

                <button type = "submit">Ingresar</button>

                <p id = "mensajeLogin"></p>
              </form>
            </div>

            <div className = "tab-content" id = "registro">
              <form id = "registroForm">
                <label htmlFor = "registroNombre">Nombre de usuario:</label>

                <input
                  id = "registroNombre"
                  type = "text"
                  placeholder = "Nombre de usuario"
                  minLength = "3"
                  maxLength = "20"
                  pattern = "[A-Za-z][A-Za-z0-9._]{2,19}"
                  required
                />

                <label htmlFor = "registroCorreo">Correo electrónico:</label>

                <input
                  id = "registroCorreo"
                  type = "email"
                  placeholder = "Correo electrónico"
                  pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}"
                  title = "Ingrese un correo válido. Ejemplo: usuario@correo.cl"
                  required
                />

                <label htmlFor = "registroContraseña">Contraseña:</label>

                <input
                  id = "registroContraseña"
                  type = "password"
                  placeholder = "Contraseña"
                  minLength = "8"
                  maxLength = "50"
                  pattern = "(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}"
                  title = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
                  autoComplete = "new-password"
                  required
                />

                <button type = "submit">Registrarse</button>

                <p id = "mensajeRegistro"></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}