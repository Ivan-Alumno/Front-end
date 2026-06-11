"use strict";

let usuarios = [];

document.addEventListener("DOMContentLoaded", () => {

  // CONFIGURACIONES Y CONSTANTES
    // Configuración general
    const SELECTORS = {
      loginForm: "loginForm",
      registroForm: "registroForm",
      registroFields: ["registroNombre", "registroCorreo", "registroContraseña"],
      mensajeRegistro: "mensajeRegistro",
      mensajeLogin: "mensajeLogin"
    };
  //

  // UTILIDADES
    // Función para obtener elementos por ID
    function $id(id) {
      return document.getElementById(id);
    }
  //

  // MODAL
    const modal = $id("authModal");
    const loginBtn = document.querySelector(".login-btn");
    const userMenu = $id("userMenu");
    const logoutBtn = $id("logoutBtn");

    let usuarioActivo = localStorage.getItem("usuarioLogueado") || null;

    //Cambio de boton
    function actualizarBotonUsuario(username){
      if(!loginBtn) return;
      loginBtn.textContent = username;
    }

    function renderUsuario() {

      if (usuarioActivo) {
        loginBtn.textContent = usuarioActivo;
      } else {
        loginBtn.textContent = "Login";
      }

    }

    if (usuarioActivo) {
      actualizarBotonUsuario(usuarioActivo);
    }

    // Abrir modal o mostrar menu en la pestaña principal
    if (loginBtn && modal) {
      loginBtn.addEventListener("click", () => {

        if (usuarioActivo) {
          userMenu.classList.toggle("show");
          return;
        }

        limpiarFormularios();
        activarTab("login")
        modal.classList.add("active");

      });
    }

    function limpiarFormularios() {

      const loginForm = $id(SELECTORS.loginForm);
      const registroForm = $id(SELECTORS.registroForm);

      if (loginForm) {
        loginForm.reset();
      }

      if (registroForm) {
        registroForm.reset();
      }

      showMessage(SELECTORS.mensajeLogin, "");
      showMessage(SELECTORS.mensajeRegistro, "");

    }

    // Cerrar modal haciendo click fuera
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("active");
          limpiarFormularios();
        }
      });
    }

    // cerrar menu al click fuera
    document.addEventListener("click", (e) => {
      if (!userMenu || !loginBtn) return;

      if (!userMenu.contains(e.target) && e.target !== loginBtn) {
        userMenu.classList.remove("show");
      }
    });

    // logout
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {

        usuarioActivo = null;
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("correoLogueado");
        userMenu.classList.remove("show");
        renderUsuario();
      });
    }
  //


  // TABS LOGIN / REGISTRO
    const tabs = document.querySelectorAll("#authTabs button");
    const tabPanes = document.querySelectorAll(".tab-content");

    function activarTab(tabName) {

      tabs.forEach(btn => {
        btn.classList.remove("active");
      });

      tabPanes.forEach(pane => {
        pane.style.display = "none";
      });

      const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
      const activePane = $id(tabName);

      if (activeButton) {
        activeButton.classList.add("active");
      }

      if (activePane) {
        activePane.style.display = "block";
      }

    }

    tabs.forEach(tab => {

      tab.addEventListener("click", () => {

        // Remover active de todos los botones
        tabs.forEach(btn => btn.classList.remove("active"));

        // Activar botón actual
        tab.classList.add("active");

        // Ocultar todos los contenidos
        tabPanes.forEach(pane => {
          pane.style.display = "none";
        });

        // Mostrar contenido correspondiente
        const target = tab.dataset.tab;
        const activePane = document.getElementById(target); 

        if (activePane) {
          activePane.style.display = "block";
        }

      });

    });

    // Mostrar login por defecto
    const loginPane = $id("login");

    if (loginPane) {
      loginPane.style.display = "block";
    }

    const irRegistro = $id("irRegistro");

    if (irRegistro) {

      irRegistro.addEventListener("click", () => {
        activarTab("registro");
      });

    }
  //


  // MANEJO DE FORMULARIOS
    // Función para obtener los valores del formulario de registro
    function getRegistroValues() {

      const values = {};

      for (const name of SELECTORS.registroFields) {

        const el = $id(name);

        values[name] = el ? el.value.trim() : "";

      }

      return values;
    }

    // Función para verificar que todos los campos estén llenos
    function allFieldsFilled(values) {
      return Object.values(values).every(value => value !== "");
    }
  //


  // MENSAJES (DOM feedback)
    // Función para mostrar mensajes de error o éxito debajo de los formularios
    function showMessage(elementId, text, type = "error") {

      const el = $id(elementId);

      if (!el) return;

      el.innerHTML = text;

      // Limpiar clases anteriores
      el.className = "";

      // Estilos personalizados
      el.style.marginTop = "10px";
      el.style.fontSize = "14px";

      if (type === "error") {

        el.style.color = "#ff6b6b";

      } else if (type === "success") {

        el.style.color = "#51cf66";

      }

    }
  //


  // FUNCIONES DE VALIDACIÓN
    // Función para validar el nombre de usuario en tiempo real
    function validarUsername(username) {

      return {
        primercaract: /^[A-Za-z]/.test(username),
        largo: username.length >= 3 && username.length <= 20,
        caracteres: /^[A-Za-z0-9._]+$/.test(username)
      };

    }

    // Función para generar mensajes dinámicos
    function generarMensajeValidacion(result) {

      return `
        <ul style="padding-left:20px;">
          <li>${result.primercaract ? "✅" : "❌"} El primer carácter debe ser una letra</li>
          <li>${result.largo ? "✅" : "❌"} Largo entre 3 y 20 caracteres</li>
          <li>${result.caracteres ? "✅" : "❌"} Solo letras, números, "." o "_"</li>
        </ul>
      `;

    }
  //


  // LOGIN
    function handleLoginSubmit(event) {

      event.preventDefault();

      const correo = $id("loginCorreo")?.value.trim();
      const contraseña = $id("loginContraseña")?.value.trim();

      if (!correo || !contraseña) {
        if (!validarCorreo(correo)) {

          showMessage(
            SELECTORS.mensajeLogin,
            "Ingrese un correo válido.",
            "error"
          );

          return;
        }

        showMessage(
          SELECTORS.mensajeLogin,
          "Todos los campos son obligatorios.",
          "error"
        );

        return;
      }

      const usuarioEncontrado = usuarios.find(u =>
        u.correo === correo && u.contraseña === contraseña
      );

      if (!usuarioEncontrado) {
        showMessage(
          SELECTORS.mensajeLogin,
          "Usuario o contraseña incorrectos.",
          "error"
        );
        return;
      }

      showMessage(
        SELECTORS.mensajeLogin,
        "Ingreso exitoso.",
        "success"
      );

      usuarioActivo = usuarioEncontrado.username;
      // Guardar también el correo del usuario logueado
      localStorage.setItem("usuarioLogueado", usuarioActivo);
      localStorage.setItem("correoLogueado", usuarioEncontrado.correo);

      actualizarBotonUsuario(usuarioActivo);

      localStorage.setItem("usuarioLogueado", usuarioActivo);

      setTimeout(() => {

        $id(SELECTORS.loginForm).reset();

        showMessage(SELECTORS.mensajeLogin, "");

        modal.classList.remove("active");

      }, 1000);

    }
  //


  // REGISTRO
    function handleRegistroSubmit(event) {

      event.preventDefault();

      const values = getRegistroValues();

      values.registroNombre =
        values.registroNombre.charAt(0).toUpperCase() +
        values.registroNombre.slice(1);

      $id("registroNombre").value = values.registroNombre;

      const username = values.registroNombre;

      if (!allFieldsFilled(values)) {

        showMessage(
          SELECTORS.mensajeRegistro,
          "Todos los campos son obligatorios.",
          "error"
        );

        return;
      }

      const usernameRegex = /^[A-Z][a-zA-Z0-9._]{2,19}$/;

      if (!validarCorreo(values.registroCorreo)) {

        showMessage(
          SELECTORS.mensajeRegistro,
          "Ingrese un correo válido.",
          "error"
        );

        return;
      }

      if (!usernameRegex.test(username)) {

        showMessage(
          SELECTORS.mensajeRegistro,
          "El nombre de usuario debe comenzar con una letra y tener entre 3 y 20 caracteres.",
          "error"
        );

        return;
      }
      
      const correoExistente = usuarios.some(
        u => u.correo === values.registroCorreo
      );

      if (correoExistente) {

        showMessage(
          SELECTORS.mensajeRegistro,
          "Ese correo ya está registrado.",
          "error"
        );

        return;
      }
      
      showMessage(
        SELECTORS.mensajeRegistro,
        "Registro exitoso.",
        "success"
      );

      usuarios.push({
        username: values.registroNombre,
        correo: values.registroCorreo,
        contraseña: values.registroContraseña
      });

      setTimeout(() => {

        $id(SELECTORS.registroForm).reset();

        showMessage(SELECTORS.mensajeRegistro, "");

        tabs.forEach(btn => btn.classList.remove("active"));
        tabs[0].classList.add("active");

        tabPanes.forEach(pane => {
          pane.style.display = "none";
        });

        loginPane.style.display = "block";

      }, 1000);

    }

    function validarCorreo(correo) {

      const correoRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

      return correoRegex.test(correo);
    }
  //


  // EVENTOS
    const loginForm = $id(SELECTORS.loginForm);

    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }

    const registroForm = $id(SELECTORS.registroForm);

    if (registroForm) {

      registroForm.addEventListener("submit", handleRegistroSubmit);

      const inputNombre = $id("registroNombre");
      const inputContraseña = $id("registroContraseña");

      // Mostrar validaciones del nombre de usuario
      if (inputNombre) {

        // Mostrar validadores al entrar al input
        inputNombre.addEventListener("focus", () => {

          const username = inputNombre.value;

          const result = validarUsername(username);

          const todoOK =
            result.primercaract &&
            result.largo &&
            result.caracteres;

          showMessage(
            SELECTORS.mensajeRegistro,
            generarMensajeValidacion(result),
            todoOK ? "success" : "error"
          );

        });

        // Validación en tiempo real para nombre de usuario
        inputNombre.addEventListener("input", () => {

          const username = inputNombre.value;

          const result = validarUsername(username);

          const todoOK =
            result.primercaract &&
            result.largo &&
            result.caracteres;

          showMessage(
            SELECTORS.mensajeRegistro,
            generarMensajeValidacion(result),
            todoOK ? "success" : "error"
          );

        });

        // Capitalizar primera letra al salir del input
        inputNombre.addEventListener("blur", () => {

          let valor = inputNombre.value.trim();

          if (valor.length > 0) {

            inputNombre.value =
              valor.charAt(0).toUpperCase() +
              valor.slice(1);

          }

          // Ocultar validadores al perder foco
          showMessage(SELECTORS.mensajeRegistro, "");

        });

        // Ocultar validadores al presionar Enter
        inputNombre.addEventListener("keydown", (event) => {

          if (event.key === "Enter") {
            showMessage(SELECTORS.mensajeRegistro, "");
          }

        });

      }

      // Función reutilizable para mostrar validaciones
      function mostrarValidacionContraseña(contraseña) {

        const tieneMayuscula = /[A-Z]/.test(contraseña);
        const tieneEspecial = /[\W_]/.test(contraseña);
        const tieneNumero = /\d/.test(contraseña);
        const largoCorrecto = contraseña.length >= 8;

        showMessage(
          SELECTORS.mensajeRegistro,

          `
            <ul style="padding-left:20px;">
              <li>${tieneMayuscula ? "✅" : "❌"} Debe incluir una mayúscula</li>
              <li>${tieneEspecial ? "✅" : "❌"} Debe incluir un carácter especial</li>
              <li>${tieneNumero ? "✅" : "❌"} Debe incluir un número</li>
              <li>${largoCorrecto ? "✅" : "❌"} Mínimo 8 caracteres</li>
            </ul>
          `,

          (
            tieneMayuscula &&
            tieneEspecial &&
            tieneNumero &&
            largoCorrecto
          )
            ? "success"
            : "error"
        );

      }

      // Mostrar validaciones de contraseña
      if (inputContraseña) {

        // Mostrar reglas al entrar al input
        inputContraseña.addEventListener("focus", () => {

          mostrarValidacionContraseña(
            inputContraseña.value
          );

        });

        // Validación en tiempo real
        inputContraseña.addEventListener("input", () => {

          mostrarValidacionContraseña(
            inputContraseña.value
          );

        });

        // Ocultar validadores al salir
        inputContraseña.addEventListener("blur", () => {

          showMessage(
            SELECTORS.mensajeRegistro,
            ""
          );

        });

        // Ocultar validadores al presionar Enter
        inputContraseña.addEventListener("keydown", (event) => {

          if (event.key === "Enter") {

            showMessage(
              SELECTORS.mensajeRegistro,
              ""
            );

          }

        });

      }

    }
  //
  
  // MODAL CONTACTO
    const contactoModal = $id("contactoModal");
    const abrirContactoBtn = $id("abrirContactoBtn");
    const contactoForm = $id("contactoForm");

    // Abrir modal contacto
    if (abrirContactoBtn && contactoModal) {

      abrirContactoBtn.addEventListener("click", () => {

        // Verificar sesión activa
        if (!usuarioActivo) {
          
          showMessage(
            "mensajeLogin",
            "Debe iniciar sesión para enviar mensajes.",
            "error"
          );

          modal.classList.add("active");
          activarTab("login");
          return;
        }

        // Autollenar y bloquear campos
        const usuario = localStorage.getItem("usuarioLogueado") || "";
        const correo = localStorage.getItem("correoLogueado") || "";
        if ($id("contactoUsuario")) {
            $id("contactoUsuario").value = usuario;
            $id("contactoUsuario").readOnly = true;
        }
        if ($id("contactoCorreo")) {
            $id("contactoCorreo").value = correo;
            $id("contactoCorreo").readOnly = true;
        }
        contactoModal.classList.add("active");
      });

    }

    // Cerrar modal contacto haciendo click fuera
    if (contactoModal) {

      contactoModal.addEventListener("click", (event) => {

        if (event.target === contactoModal) {

          contactoModal.classList.remove("active");

          if (contactoForm) {
              contactoForm.reset();
              // Volver a habilitar los campos para el siguiente uso
              if ($id("contactoUsuario")) $id("contactoUsuario").readOnly = false;
              if ($id("contactoCorreo")) $id("contactoCorreo").readOnly = false;
          }
          showMessage("mensajeContacto", "");
        }
      });
    }

    // Envío formulario contacto
    if (contactoForm) {

      contactoForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const usuario = $id("contactoUsuario")?.value.trim();
        const correo = $id("contactoCorreo")?.value.trim();
        const mensaje = $id("contactoMensaje")?.value.trim();

        // Verificar campos vacíos
        if (!usuario || !correo || !mensaje) {

          showMessage(
            "mensajeContacto",
            "Todos los campos son obligatorios.",
            "error"
          );

          return;

        }

        // Verificar correo válido
        if (!validarCorreo(correo)) {

          showMessage(
            "mensajeContacto",
            "Ingrese un correo válido.",
            "error"
          );

          return;

        }

        // Mensaje exitoso
        showMessage(
          "mensajeContacto",
          "Mensaje enviado correctamente.",
          "success"
        );

        // Limpiar y cerrar modal
        setTimeout(() => {

          contactoForm.reset();

          showMessage("mensajeContacto", "");

          contactoModal.classList.remove("active");

        }, 1500);

      });

    }
  //

  // INICIO
    renderUsuario();
  //
  
  // CARRUSEL
    const carruselSlides = document.getElementById("carruselSlides");

    const slides = document.querySelectorAll(".slide");

    const indicadores = document.querySelectorAll(".indicador");

    const prevBtn = document.getElementById("prevBtn");

    const nextBtn = document.getElementById("nextBtn");

    let slideActual = 0;

    // Mostrar slide
    function mostrarSlide(index) {

      // Reiniciar si supera límites
      if (index >= slides.length) {
        slideActual = 0;
      }

      else if (index < 0) {
        slideActual = slides.length - 1;
      }

      else {
        slideActual = index;
      }

      // Movimiento del carrusel
      carruselSlides.style.transform =
        `translateX(-${slideActual * 100}%)`;

      // Actualizar indicadores
      indicadores.forEach(ind =>
        ind.classList.remove("active")
      );

      indicadores[slideActual].classList.add("active");
    }

    // Botón siguiente
    if (nextBtn) {

      nextBtn.addEventListener("click", () => {
        mostrarSlide(slideActual + 1);
      });

    }

    // Botón anterior
    if (prevBtn) {

      prevBtn.addEventListener("click", () => {
        mostrarSlide(slideActual - 1);
      });

    }

    // Indicadores
    indicadores.forEach((indicador, index) => {

      indicador.addEventListener("click", () => {
        mostrarSlide(index);
      });

    });

    setInterval(() => {
      mostrarSlide(slideActual + 1);
    }, 5000);

    // Inicializar
    mostrarSlide(0);
});