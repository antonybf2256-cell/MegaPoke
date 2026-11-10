
const firebaseConfig = {
  apiKey: "AIzaSyCFbgBbjUniMgaOKpfuYqzfWJPfaIW-SMQ",
  authDomain: "megapokestore.firebaseapp.com",
  projectId: "megapokestore",
  storageBucket: "megapokestore.firebasestorage.app",
  messagingSenderId: "208764573725",
  appId: "1:208764573725:web:1fec2dbb03f836ca6c4ef4",
  measurementId: "G-4BWH2KXY27",
};

let auth = null;
let googleProvider = null;
try {
  if (typeof firebase === "undefined") {
    throw new Error("El SDK de Firebase no se cargó (revisa los <script> de firebase-app-compat.js / firebase-auth-compat.js o tu conexión).");
  }
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  googleProvider = new firebase.auth.GoogleAuthProvider();
} catch (error) {
  console.error("[auth.js] No se pudo inicializar Firebase Authentication:", error);
}

let db = null;
try {
  if (auth && typeof firebase.firestore === "function") {
    db = firebase.firestore();
  } else if (auth) {
    console.warn("[auth.js] Falta el <script> de firebase-firestore-compat.js; no se guardarán datos personales.");
  }
} catch (error) {
  console.error("[auth.js] No se pudo inicializar Firestore:", error);
}

function authNoDisponible() {
  mostrarErrorAuth("El inicio de sesión no está disponible en este momento. Intenta más tarde.");
}

function mensajeError(error) {
  const codigos = {
    "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Intenta iniciar sesión.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
    "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
  };
  return codigos[error.code] || "Ocurrió un error. Inténtalo de nuevo.";
}

function mostrarErrorAuth(msg) {
  const el = document.getElementById("authError");
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function mostrarVistaAuth(vista) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginFoot = document.getElementById("loginFoot");
  const registerFoot = document.getElementById("registerFoot");
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");
  if (!loginForm || !registerForm) return;

  mostrarErrorAuth("");
  const esRegistro = vista === "registro";
  loginForm.style.display = esRegistro ? "none" : "flex";
  registerForm.style.display = esRegistro ? "flex" : "none";
  loginFoot.style.display = esRegistro ? "none" : "block";
  registerFoot.style.display = esRegistro ? "block" : "none";
  authTitle.textContent = esRegistro ? "Crea tu cuenta" : "Ingresa a tu cuenta";
  authSubtitle.textContent = esRegistro
    ? "Regístrate gratis y guarda tu carrito para tu próxima compra."
    : "Guarda tu carrito, sigue tus pedidos y entérate primero de los sobres nuevos.";
}

function cerrarModalLogin() {
  const modalEl = document.getElementById("loginModal");
  if (!modalEl) return;
  const instancia = bootstrap.Modal.getOrCreateInstance(modalEl);
  instancia.hide();
}

let aliasUsuario = null;

let fotoUsuario = null;

function fotoActual(user) {
  return fotoUsuario || (user && user.photoURL) || null;
}

function refrescarAvatar() {
  const user = auth && auth.currentUser;
  actualizarBotonCuenta(user);
  if (user && document.getElementById("profileAvatar")) {
    pintarAvatarPerfil(user);
    const quitar = document.getElementById("profilePhotoRemove");
    if (quitar) quitar.style.display = fotoUsuario ? "inline" : "none";
  }
}

function fijarFoto(foto) {
  fotoUsuario = foto ? String(foto) : null;
  refrescarAvatar();
}

function prepararFoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error("tipo"));
    if (file.size > 10 * 1024 * 1024) return reject(new Error("grande"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const lado = 256;
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const ctx = canvas.getContext("2d");
        const min = Math.min(img.width, img.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, lado, lado);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, lado, lado);
        let calidad = 0.85;
        let data = canvas.toDataURL("image/jpeg", calidad);
        while (data.length > 120000 && calidad > 0.4) {
          calidad -= 0.15;
          data = canvas.toDataURL("image/jpeg", calidad);
        }
        resolve(data);
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagen"));
    };
    img.src = url;
  });
}

function fijarAlias(alias) {
  aliasUsuario = alias ? String(alias) : null;
  const user = auth && auth.currentUser;
  actualizarBotonCuenta(user);
  const tituloPerfil = document.getElementById("profileTitle");
  if (user && tituloPerfil) llenarPerfil(user);
}

function actualizarBotonCuenta(user) {
  const accountBtn = document.getElementById("accountBtn");
  if (!accountBtn) return;
  const label = accountBtn.querySelector("span");

  accountBtn.setAttribute("data-bs-toggle", "modal");

  const icono = accountBtn.querySelector("svg");
  let imgFoto = accountBtn.querySelector(".account-avatar");
  const foto = user ? fotoActual(user) : null;
  if (foto) {
    if (!imgFoto) {
      imgFoto = document.createElement("img");
      imgFoto.className = "account-avatar";
      imgFoto.alt = "";
      imgFoto.referrerPolicy = "no-referrer";
      accountBtn.insertBefore(imgFoto, accountBtn.firstChild);
    }
    if (imgFoto.getAttribute("src") !== foto) imgFoto.src = foto;
    if (icono) icono.style.display = "none";
  } else {
    if (imgFoto) imgFoto.remove();
    if (icono) icono.style.display = "";
  }

  if (user) {
    const primerNombre = user.displayName ? user.displayName.split(" ")[0] : "Mi cuenta";
    if (label) label.textContent = aliasUsuario || (db ? "Mi cuenta" : primerNombre);
    accountBtn.setAttribute("data-bs-target", "#profileModal");
    accountBtn.dataset.loggedIn = "true";
  } else {
    if (label) label.textContent = "Ingresar";
    accountBtn.setAttribute("data-bs-target", "#loginModal");
    delete accountBtn.dataset.loggedIn;
  }
}

function crearModalPerfil() {
  if (document.getElementById("profileModal")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
<div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content login-modal-content">
      <div class="modal-header border-0 pb-0">
        <span class="login-eyebrow">Tu cuenta</span>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body pt-0">
        <div class="profile-head">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar" id="profileAvatar" aria-hidden="true"></div>
            <button type="button" class="profile-avatar-edit" id="profilePhotoBtn" aria-label="Cambiar foto de perfil" title="Cambiar foto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h3l1.6-2.5h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="2"/></svg>
            </button>
            <input type="file" id="profilePhotoInput" accept="image/*" hidden>
          </div>
          <div class="profile-head-text">
            <h2 id="profileTitle">Mi perfil</h2>
            <p id="profileEmailText"></p>
            <button type="button" class="profile-photo-remove" id="profilePhotoRemove" style="display:none;">Quitar foto</button>
          </div>
        </div>

        <p class="auth-error" id="profileError" style="display:none;"></p>
        <p class="profile-ok" id="profileOk" style="display:none;"></p>

        <form class="login-form" id="profileForm">
          <label>Nombre
            <input type="text" name="displayName" id="profileName" class="form-control" placeholder="Tu nombre" maxlength="40" autocomplete="name" required>
          </label>
          <label>Correo electrónico
            <input type="email" id="profileEmail" class="form-control" readonly disabled>
          </label>
          <button type="submit" class="btn btn-primary w-100 login-submit">Guardar cambios</button>
        </form>

        <div class="profile-section" id="profileHistorySection">
          <h3>Mis compras</h3>
          <p>Revisa los pedidos que has hecho en la tienda.</p>
          <button type="button" class="btn btn-outline-secondary w-100" id="profileHistoryBtn">Ver historial de compras</button>
        </div>

        <div class="profile-section" id="profileDataSection">
          <h3>Mis datos</h3>
          <p>Nombre completo, DNI, teléfono y alias para tus pedidos.</p>
          <button type="button" class="btn btn-outline-secondary w-100" id="profileEditData">Ver o editar mis datos</button>
        </div>

        <div class="profile-section" id="profilePasswordSection">
          <h3>Contraseña</h3>
          <p>Te enviaremos un correo con un enlace para crear una contraseña nueva.</p>
          <button type="button" class="btn btn-outline-secondary w-100" id="profileResetPwd">Enviar enlace para cambiar contraseña</button>
        </div>
        <p class="profile-note" id="profileGoogleNote" style="display:none;">Iniciaste sesión con Google, por eso tu contraseña y tu correo se gestionan desde tu cuenta de Google.</p>

        <button type="button" class="btn btn-link profile-signout" id="profileSignOut">Cerrar sesión</button>
      </div>
    </div>
  </div>
</div>`;
  document.body.appendChild(wrap.firstElementChild);
}

function mostrarMensajePerfil(tipo, msg) {
  const err = document.getElementById("profileError");
  const ok = document.getElementById("profileOk");
  if (!err || !ok) return;
  err.style.display = "none";
  ok.style.display = "none";
  if (!msg) return;
  const el = tipo === "error" ? err : ok;
  el.textContent = msg;
  el.style.display = "block";
}

function pintarAvatarPerfil(user) {
  const avatar = document.getElementById("profileAvatar");
  if (!avatar) return;
  avatar.textContent = "";
  const foto = fotoActual(user);
  if (foto) {
    const img = document.createElement("img");
    img.src = foto;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    avatar.appendChild(img);
  } else {
    const base = (aliasUsuario || user.displayName || user.email || "?").trim();
    avatar.textContent = base.charAt(0).toUpperCase();
  }
}

function llenarPerfil(user) {
  if (!user) return;
  pintarAvatarPerfil(user);
  document.getElementById("profileTitle").textContent = aliasUsuario || "Mi perfil";
  document.getElementById("profileEmailText").textContent = user.email || "";
  document.getElementById("profileName").value = user.displayName || "";
  document.getElementById("profileEmail").value = user.email || "";
  const conPassword = (user.providerData || []).some((p) => p.providerId === "password");
  document.getElementById("profilePasswordSection").style.display = conPassword ? "block" : "none";
  document.getElementById("profileGoogleNote").style.display = conPassword ? "none" : "block";
}

function cerrarModalPerfil() {
  const modalEl = document.getElementById("profileModal");
  if (!modalEl) return;
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();
}

function iniciarPerfil() {
  crearModalPerfil();
  const modalEl = document.getElementById("profileModal");
  const form = document.getElementById("profileForm");
  const resetBtn = document.getElementById("profileResetPwd");
  const signOutBtn = document.getElementById("profileSignOut");

  const fotoBtn = document.getElementById("profilePhotoBtn");
  const fotoInput = document.getElementById("profilePhotoInput");
  const fotoQuitar = document.getElementById("profilePhotoRemove");
  fotoBtn.addEventListener("click", () => fotoInput.click());
  document.getElementById("profileAvatar").addEventListener("click", () => { if (db) fotoInput.click(); });

  fotoInput.addEventListener("change", () => {
    const user = auth && auth.currentUser;
    const archivo = fotoInput.files && fotoInput.files[0];
    fotoInput.value = "";
    if (!user || !db || !archivo) return;
    mostrarMensajePerfil("", "");
    fotoBtn.disabled = true;
    prepararFoto(archivo)
      .then((data) => guardarDatos(user, { foto: data }).then(() => data))
      .then((data) => {
        fijarFoto(data);
        mostrarMensajePerfil("ok", "Foto actualizada.");
        showToast("Foto actualizada");
      })
      .catch((error) => {
        console.error("[auth.js] No se pudo cambiar la foto:", error);
        const msg = { tipo: "Elige un archivo de imagen (JPG o PNG).", grande: "La imagen pesa demasiado. Elige una de menos de 10 MB.", imagen: "No se pudo leer esa imagen. Prueba con otra en JPG o PNG." }[error && error.message];
        mostrarMensajePerfil("error", msg || "No se pudo guardar la foto. Inténtalo de nuevo.");
      })
      .finally(() => { fotoBtn.disabled = false; });
  });

  fotoQuitar.addEventListener("click", () => {
    const user = auth && auth.currentUser;
    if (!user || !db) return;
    mostrarMensajePerfil("", "");
    guardarDatos(user, { foto: firebase.firestore.FieldValue.delete() })
      .then(() => {
        fijarFoto(null);
        mostrarMensajePerfil("ok", "Foto eliminada.");
      })
      .catch((error) => {
        console.error("[auth.js] No se pudo quitar la foto:", error);
        mostrarMensajePerfil("error", "No se pudo quitar la foto. Inténtalo de nuevo.");
      });
  });

  const editDataBtn = document.getElementById("profileEditData");
  if (editDataBtn) {
    editDataBtn.addEventListener("click", () => {
      cerrarModalPerfil();
      abrirCuandoLibre(abrirModalDatos);
    });
  }

  modalEl.addEventListener("show.bs.modal", () => {
    const secDatos = document.getElementById("profileDataSection");
    if (secDatos) secDatos.style.display = db ? "block" : "none";
    document.getElementById("profilePhotoBtn").style.display = db ? "flex" : "none";
    document.getElementById("profilePhotoRemove").style.display = db && fotoUsuario ? "inline" : "none";
    mostrarMensajePerfil("", "");
    llenarPerfil(auth && auth.currentUser);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = auth && auth.currentUser;
    if (!user) return;
    mostrarMensajePerfil("", "");
    const nombre = document.getElementById("profileName").value.trim();
    if (!nombre) return mostrarMensajePerfil("error", "Escribe tu nombre.");
    user
      .updateProfile({ displayName: nombre })
      .then(() => {
        actualizarBotonCuenta(auth.currentUser);
        llenarPerfil(auth.currentUser);
        mostrarMensajePerfil("ok", "Perfil actualizado.");
        showToast("Perfil actualizado");
      })
      .catch((error) => {
        console.error("[auth.js] No se pudo actualizar el perfil:", error);
        mostrarMensajePerfil("error", "No se pudo guardar. Inténtalo de nuevo.");
      });
  });

  resetBtn.addEventListener("click", () => {
    const user = auth && auth.currentUser;
    if (!user || !user.email) return;
    mostrarMensajePerfil("", "");
    auth
      .sendPasswordResetEmail(user.email)
      .then(() => mostrarMensajePerfil("ok", `Te enviamos un enlace a ${user.email}. Revisa también tu carpeta de spam.`))
      .catch((error) => mostrarMensajePerfil("error", mensajeError(error)));
  });

  signOutBtn.addEventListener("click", () => {
    if (!auth) return;
    auth.signOut().then(() => {
      cerrarModalPerfil();
      showToast("Sesión cerrada");
    });
  });
}

const CLAVE_DATOS_OMITIDOS = "megapokestore_datos_omitidos";
const ORDEN_DATOS = ["nombre", "dni", "telefono", "alias"];

function enmascararDni(dni) {
  const d = String(dni || "");
  return d.length <= 2 ? d : "*".repeat(d.length - 2) + d.slice(-2);
}
function enmascararTelefono(tel) {
  return "*".repeat(String(tel || "").length);
}

const CAMPOS_DATOS = {
  nombre: {
    etiqueta: "Nombre completo",
    editable: true,
    mostrar: (v) => v,
    limpiar: (v) => v.trim().replace(/\s+/g, " "),
    validar: (v) => (v.length < 3 ? "Escribe tu nombre completo." : ""),
    input: { type: "text", maxLength: 60, inputMode: "text", placeholder: "Nombres y apellidos", autocomplete: "name" },
  },
  dni: {
    etiqueta: "DNI",
    editable: false,
    mostrar: enmascararDni,
    limpiar: (v) => v.replace(/\D/g, ""),
    validar: (v) => (/^\d{8}$/.test(v) ? "" : "El DNI debe tener 8 dígitos."),
  },
  telefono: {
    etiqueta: "Teléfono",
    editable: true,
    mostrar: enmascararTelefono,
    limpiar: (v) => v.replace(/\D/g, ""),
    validar: (v) => (/^9\d{8}$/.test(v) ? "" : "El teléfono debe tener 9 dígitos y empezar con 9."),
    input: { type: "tel", maxLength: 9, inputMode: "numeric", placeholder: "9 dígitos, ej. 987654321", autocomplete: "tel-national" },
  },
  alias: {
    etiqueta: "Alias",
    editable: true,
    mostrar: (v) => v,
    limpiar: (v) => v.trim(),
    validar: (v) => (v.length < 2 ? "Escribe un alias de al menos 2 caracteres." : ""),
    input: { type: "text", maxLength: 30, inputMode: "text", placeholder: "Cómo quieres que te llamemos", autocomplete: "nickname" },
  },
};

const ICONO_LAPIZ = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 7l3 3" stroke="currentColor" stroke-width="2"/></svg>';
const ICONO_CANDADO = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2"/></svg>';
const ICONO_CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICONO_X = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

function datosOmitidos() {
  try { return sessionStorage.getItem(CLAVE_DATOS_OMITIDOS) === "1"; } catch (e) { return false; }
}
function omitirDatos() {
  try { sessionStorage.setItem(CLAVE_DATOS_OMITIDOS, "1"); } catch (e) {  }
}
function datosCompletos(d) {
  return !!(d && d.nombre && d.dni && d.telefono && d.alias);
}

function abrirCuandoLibre(fn) {
  if (!document.querySelector(".modal.show, .modal-backdrop")) {
    fn();
    return;
  }
  const alCerrar = () => {
    document.removeEventListener("hidden.bs.modal", alCerrar);
    setTimeout(fn, 60);
  };
  document.addEventListener("hidden.bs.modal", alCerrar);
}

function crearModalDatos() {
  if (document.getElementById("datosModal")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
<div class="modal fade" id="datosModal" tabindex="-1" aria-labelledby="datosTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content login-modal-content">
      <div class="modal-header border-0 pb-0">
        <span class="login-eyebrow">Tus datos</span>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body pt-0">
        <div class="login-modal-head">
          <h2 id="datosTitle">Tus datos</h2>
          <p id="datosSubtitle"></p>
        </div>

        <p class="auth-error" id="datosError" style="display:none;"></p>

        <form class="login-form" id="datosForm" novalidate style="display:none;">
          <label>Nombre completo
            <input type="text" name="nombre" class="form-control" placeholder="Nombres y apellidos" maxlength="60" autocomplete="name" required>
          </label>
          <label>DNI
            <input type="text" name="dni" class="form-control" placeholder="8 dígitos" inputmode="numeric" maxlength="8" autocomplete="off" required>
            <small class="datos-hint">Una vez guardado, el DNI no se podrá modificar.</small>
          </label>
          <label>Número de teléfono
            <input type="tel" name="telefono" class="form-control" placeholder="9 dígitos, ej. 987654321" inputmode="numeric" maxlength="9" autocomplete="tel-national" required>
          </label>
          <label>Alias
            <input type="text" name="alias" class="form-control" placeholder="Cómo quieres que te llamemos" maxlength="30" autocomplete="nickname" required>
          </label>
          <button type="submit" class="btn btn-primary w-100 login-submit" id="datosGuardar">Guardar datos</button>
          <button type="button" class="btn btn-link profile-signout" data-bs-dismiss="modal">Ahora no</button>
        </form>

        <div id="datosView" style="display:none;">
          <ul class="datos-lista" id="datosLista"></ul>
          <button type="button" class="btn btn-outline-secondary w-100" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
  document.body.appendChild(wrap.firstElementChild);
}

function mostrarErrorDatos(msg) {
  const el = document.getElementById("datosError");
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function abrirModalDatos() {
  const el = document.getElementById("datosModal");
  if (!el || !auth || !auth.currentUser) return;
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function revisarDatosUsuario(user) {
  if (!db) return;
  db.collection("usuarios").doc(user.uid).get()
    .then((snap) => {
      if (!auth.currentUser || auth.currentUser.uid !== user.uid) return;
      const d = snap.exists ? snap.data() : null;
      fijarAlias(d && d.alias);
      fijarFoto(d && d.foto);
      if (datosOmitidos()) return;
      if (!datosCompletos(d)) abrirCuandoLibre(abrirModalDatos);
    })
    .catch((error) => console.error("[auth.js] No se pudieron leer los datos del usuario:", error));
}

function guardarDatos(user, campos) {
  return db.collection("usuarios").doc(user.uid).set(
    Object.assign({}, campos, {
      email: user.email || "",
      actualizado: firebase.firestore.FieldValue.serverTimestamp(),
    }),
    { merge: true }
  );
}

function iniciarDatos() {
  if (!db) return;
  crearModalDatos();
  const modalEl = document.getElementById("datosModal");
  const form = document.getElementById("datosForm");
  const vista = document.getElementById("datosView");
  const lista = document.getElementById("datosLista");
  const titulo = document.getElementById("datosTitle");
  const subtitulo = document.getElementById("datosSubtitle");
  const btnGuardar = document.getElementById("datosGuardar");
  let guardado = false;
  let datos = {};
  let dniBloqueado = false;

  ["dni", "telefono"].forEach((n) => {
    form[n].addEventListener("input", () => {
      if (!form[n].disabled) form[n].value = form[n].value.replace(/\D/g, "");
    });
  });

  function mostrarFormulario(user) {
    vista.style.display = "none";
    form.style.display = "flex";
    titulo.textContent = "Completa tus datos";
    subtitulo.textContent = "Así podremos gestionar tus pedidos y entregas más rápido.";
    form.reset();
    form.nombre.value = datos.nombre || user.displayName || "";
    form.telefono.value = datos.telefono || "";
    form.alias.value = datos.alias || "";
    dniBloqueado = !!datos.dni;
    form.dni.disabled = dniBloqueado;
    form.dni.value = dniBloqueado ? enmascararDni(datos.dni) : "";
  }

  function mostrarLista() {
    form.style.display = "none";
    vista.style.display = "block";
    titulo.textContent = "Mis datos";
    subtitulo.textContent = "Toca el lápiz para cambiar un dato.";
    pintarLista();
  }

  function pintarLista() {
    mostrarErrorDatos("");
    lista.textContent = "";
    ORDEN_DATOS.forEach((campo) => {
      const def = CAMPOS_DATOS[campo];
      const li = document.createElement("li");
      li.className = "datos-fila";

      const etiqueta = document.createElement("span");
      etiqueta.className = "datos-etiqueta";
      etiqueta.textContent = def.etiqueta;

      const valor = document.createElement("span");
      valor.className = "datos-valor";
      valor.textContent = def.mostrar(datos[campo] || "");

      li.append(etiqueta, valor);

      if (def.editable) {
        const lapiz = document.createElement("button");
        lapiz.type = "button";
        lapiz.className = "datos-btn";
        lapiz.setAttribute("aria-label", "Editar " + def.etiqueta.toLowerCase());
        lapiz.innerHTML = ICONO_LAPIZ;
        lapiz.addEventListener("click", () => editarCampo(li, campo));
        li.appendChild(lapiz);
      } else {
        const candado = document.createElement("span");
        candado.className = "datos-candado";
        candado.title = "El DNI no se puede modificar";
        candado.innerHTML = ICONO_CANDADO;
        li.appendChild(candado);
      }
      lista.appendChild(li);
    });
  }

  function editarCampo(li, campo) {
    pintarLista();
    const fila = lista.children[ORDEN_DATOS.indexOf(campo)];
    const def = CAMPOS_DATOS[campo];
    const valor = fila.querySelector(".datos-valor");
    fila.querySelector(".datos-btn").remove();

    const input = document.createElement("input");
    input.className = "form-control datos-input";
    input.type = def.input.type;
    input.maxLength = def.input.maxLength;
    input.inputMode = def.input.inputMode;
    input.placeholder = def.input.placeholder;
    input.setAttribute("autocomplete", def.input.autocomplete);
    input.setAttribute("aria-label", def.etiqueta);
    input.value = datos[campo] || "";
    if (campo === "telefono") input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, ""); });
    valor.replaceWith(input);

    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "datos-btn datos-btn-ok";
    ok.setAttribute("aria-label", "Guardar " + def.etiqueta.toLowerCase());
    ok.innerHTML = ICONO_CHECK;

    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "datos-btn";
    cancelar.setAttribute("aria-label", "Cancelar");
    cancelar.innerHTML = ICONO_X;

    fila.append(ok, cancelar);
    input.focus();

    const guardar = () => {
      const user = auth && auth.currentUser;
      if (!user) return;
      const nuevo = def.limpiar(input.value);
      const error = def.validar(nuevo);
      if (error) return mostrarErrorDatos(error);
      mostrarErrorDatos("");
      ok.disabled = true;
      guardarDatos(user, { [campo]: nuevo })
        .then(() => {
          datos[campo] = nuevo;
          if (campo === "alias") fijarAlias(nuevo);
          pintarLista();
          showToast("Dato actualizado");
        })
        .catch((err) => {
          console.error("[auth.js] No se pudo actualizar el dato:", err);
          mostrarErrorDatos("No se pudo guardar el cambio. Inténtalo de nuevo en un momento.");
          ok.disabled = false;
        });
    };

    ok.addEventListener("click", guardar);
    cancelar.addEventListener("click", pintarLista);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); guardar(); }
      if (e.key === "Escape") { e.stopPropagation(); pintarLista(); }
    });
  }

  modalEl.addEventListener("show.bs.modal", () => {
    guardado = false;
    mostrarErrorDatos("");
    form.style.display = "none";
    vista.style.display = "none";
    const user = auth && auth.currentUser;
    if (!user) return;
    db.collection("usuarios").doc(user.uid).get()
      .then((snap) => {
        datos = snap.exists ? snap.data() : {};
      })
      .catch((error) => {
        console.error("[auth.js] No se pudieron leer los datos del usuario:", error);
        datos = {};
      })
      .then(() => {
        if (datosCompletos(datos)) {
          guardado = true;
          mostrarLista();
        } else {
          mostrarFormulario(user);
        }
      });
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    if (!guardado) omitirDatos();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = auth && auth.currentUser;
    if (!user) return;
    mostrarErrorDatos("");

    const campos = {
      nombre: CAMPOS_DATOS.nombre.limpiar(form.nombre.value),
      telefono: CAMPOS_DATOS.telefono.limpiar(form.telefono.value),
      alias: CAMPOS_DATOS.alias.limpiar(form.alias.value),
    };
    if (!dniBloqueado) campos.dni = CAMPOS_DATOS.dni.limpiar(form.dni.value);

    for (const campo of ["nombre", "dni", "telefono", "alias"]) {
      if (campo === "dni" && dniBloqueado) continue;
      const error = CAMPOS_DATOS[campo].validar(campos[campo]);
      if (error) return mostrarErrorDatos(error);
    }

    btnGuardar.disabled = true;
    guardarDatos(user, campos)
      .then(() => {
        guardado = true;
        datos = Object.assign({}, datos, campos);
        fijarAlias(campos.alias);
        showToast("Datos guardados");
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      })
      .catch((error) => {
        console.error("[auth.js] No se pudieron guardar los datos:", error);
        mostrarErrorDatos("No se pudieron guardar tus datos. Inténtalo de nuevo en un momento.");
      })
      .finally(() => { btnGuardar.disabled = false; });
  });
}

const ESTADOS_PEDIDO = {
  pendiente: { texto: "Pendiente de confirmación", clase: "is-pendiente" },
  pagado: { texto: "Pagado", clase: "is-pagado" },
  enviado: { texto: "Enviado", clase: "is-enviado" },
  entregado: { texto: "Entregado", clase: "is-entregado" },
  cancelado: { texto: "Cancelado", clase: "is-cancelado" },
};
const METODOS_PAGO = { mercadopago: "Mercado Pago", yape: "Yape" };

function escaparHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function crearModalHistorial() {
  if (document.getElementById("historialModal")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
<div class="modal fade" id="historialModal" tabindex="-1" aria-labelledby="historialTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content login-modal-content">
      <div class="modal-header border-0 pb-0">
        <span class="login-eyebrow">Tu cuenta</span>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body pt-0">
        <div class="login-modal-head">
          <h2 id="historialTitle">Historial de compras</h2>
          <p>Tus pedidos, del más reciente al más antiguo.</p>
        </div>
        <div id="historialLista" class="hist-lista"></div>
      </div>
    </div>
  </div>
</div>`;
  document.body.appendChild(wrap.firstElementChild);
}

function abrirHistorial() {
  const el = document.getElementById("historialModal");
  if (!el || !auth || !auth.currentUser) return;
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function pintarPedidoHistorial(id, p) {
  const estado = ESTADOS_PEDIDO[p.estado] || ESTADOS_PEDIDO.pendiente;
  const fecha = p.creado && p.creado.toDate
    ? p.creado.toDate().toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Procesando…";
  const items = (p.items || [])
    .map((i) => `<li><span>${escaparHtml(i.name)} <em>× ${Number(i.qty) || 1}</em></span><span>S/ ${((Number(i.price) || 0) * (Number(i.qty) || 1)).toFixed(2)}</span></li>`)
    .join("");
  const envio = Number(p.shipping) || 0;
  return `
<article class="hist-pedido">
  <header class="hist-pedido-head">
    <div>
      <b>Pedido #${escaparHtml(String(id).slice(-6).toUpperCase())}</b>
      <small>${escaparHtml(fecha)} · ${escaparHtml(METODOS_PAGO[p.metodo] || "—")}</small>
    </div>
    <span class="hist-estado ${estado.clase}">${estado.texto}</span>
  </header>
  <ul class="hist-items">${items}</ul>
  <div class="hist-total"><span>Envío: ${envio === 0 ? "Gratis" : "S/ " + envio.toFixed(2)}</span><b>Total: S/ ${(Number(p.total) || 0).toFixed(2)}</b></div>
</article>`;
}

function iniciarHistorial() {
  crearModalHistorial();
  const perfilEl = document.getElementById("profileModal");
  const modalEl = document.getElementById("historialModal");
  const lista = document.getElementById("historialLista");
  const btn = document.getElementById("profileHistoryBtn");
  const seccion = document.getElementById("profileHistorySection");

  if (perfilEl && seccion) {
    perfilEl.addEventListener("show.bs.modal", () => { seccion.style.display = db ? "block" : "none"; });
  }
  if (btn) {
    btn.addEventListener("click", () => {
      cerrarModalPerfil();
      abrirCuandoLibre(abrirHistorial);
    });
  }

  modalEl.addEventListener("show.bs.modal", () => {
    const user = auth && auth.currentUser;
    if (!user || !db) return;
    lista.innerHTML = '<p class="hist-vacio">Cargando tus pedidos…</p>';
    db.collection("usuarios").doc(user.uid).collection("pedidos")
      .orderBy("creado", "desc").limit(50).get()
      .then((snap) => {
        if (snap.empty) {
          lista.innerHTML = '<p class="hist-vacio">Aún no has hecho ninguna compra.</p>';
          return;
        }
        lista.innerHTML = snap.docs.map((d) => pintarPedidoHistorial(d.id, d.data())).join("");
      })
      .catch((error) => {
        console.error("[auth.js] No se pudo leer el historial de compras:", error);
        lista.innerHTML = '<p class="hist-vacio">No se pudo cargar tu historial. Inténtalo de nuevo en un momento.</p>';
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarPerfil();
  iniciarDatos();
  iniciarHistorial();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const googleSignIn = document.getElementById("googleSignIn");
  const switchToRegister = document.getElementById("switchToRegister");
  const switchToLogin = document.getElementById("switchToLogin");

  if (auth) {
    auth.onAuthStateChanged((user) => {
      if (!user) { aliasUsuario = null; fotoUsuario = null; }
      actualizarBotonCuenta(user);
      if (user) revisarDatosUsuario(user);
    });
  }

  if (googleSignIn) {
    googleSignIn.addEventListener("click", () => {
      if (!auth) return authNoDisponible();
      mostrarErrorAuth("");
      auth
        .signInWithPopup(googleProvider)
        .then((result) => {
          showToast("¡Bienvenido, coleccionista!");
          cerrarModalLogin();
        })
        .catch((error) => {
          if (error.code !== "auth/popup-closed-by-user") {
            mostrarErrorAuth(mensajeError(error));
          }
        });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!auth) return authNoDisponible();
      mostrarErrorAuth("");
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          showToast("Sesión iniciada correctamente");
          cerrarModalLogin();
          loginForm.reset();
        })
        .catch((error) => mostrarErrorAuth(mensajeError(error)));
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!auth) return authNoDisponible();
      mostrarErrorAuth("");
      const nombre = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value;
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => cred.user.updateProfile({ displayName: nombre }))
        .then(() => {
          showToast("¡Cuenta creada! Bienvenido, coleccionista");
          cerrarModalLogin();
          registerForm.reset();
        })
        .catch((error) => mostrarErrorAuth(mensajeError(error)));
    });
  }

  if (switchToRegister) {
    switchToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarVistaAuth("registro");
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarVistaAuth("login");
    });
  }

  const modalEl = document.getElementById("loginModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => mostrarVistaAuth("login"));
  }
});
