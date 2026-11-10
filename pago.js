
// Pega aquí la URL de tu Worker de Cloudflare (ej: https://megapokestore-pago.TU-USUARIO.workers.dev)
const PAGO_API_URL = "https://nameless-boat-37eb.antonybf2256.workers.dev";

const WHATSAPP_EMPRESA = "51 935515809";

const YAPE_QR_SRC = "img/yape-qr.png";

const CHECKOUT_STORAGE_KEY = "mps_checkout";

const QR_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">' +
      '<rect width="260" height="260" fill="#f3eef5"/>' +
      '<rect x="30" y="30" width="60" height="60" fill="none" stroke="#742284" stroke-width="8"/>' +
      '<rect x="170" y="30" width="60" height="60" fill="none" stroke="#742284" stroke-width="8"/>' +
      '<rect x="30" y="170" width="60" height="60" fill="none" stroke="#742284" stroke-width="8"/>' +
      '<rect x="110" y="110" width="40" height="40" fill="#742284"/>' +
      '<text x="130" y="252" font-family="Arial" font-size="13" text-anchor="middle" fill="#742284">QR referencial de Yape</text>' +
    "</svg>"
  );

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function leerPedidoGuardado() {
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return null;
    return data;
  } catch (error) {
    console.error("[pago.js] No se pudo leer el pedido guardado:", error);
    return null;
  }
}

function renderResumenPedido(pedido) {
  const itemsEl = document.getElementById("orderSummaryItems");
  itemsEl.innerHTML = pedido.items
    .map(
      (item) => `
    <div class="order-summary-item">
      <div class="order-summary-media">${
        item.image ? `<img src="${item.image}" alt="${escapeHTML(item.name)}">` : ""
      }</div>
      <div class="order-summary-info">
        <h4>${escapeHTML(item.name)}</h4>
        <span>Cantidad: ${item.qty}</span>
      </div>
      <span class="order-summary-price">S/ ${(item.price * item.qty).toFixed(2)}</span>
    </div>`
    )
    .join("");

  document.getElementById("summarySubtotal").textContent = `S/ ${pedido.subtotal.toFixed(2)}`;
  document.getElementById("summaryShipping").textContent =
    pedido.shipping === 0 ? "Gratis" : `S/ ${pedido.shipping.toFixed(2)}`;
  actualizarMontos(pedido);
}

function actualizarMontos(pedido) {
  const desc = Number(pedido.descuento) || 0;
  const row = document.getElementById("summaryDiscountRow");
  row.style.display = desc > 0 ? "" : "none";
  document.getElementById("summaryDiscountLabel").textContent = `Descuento${pedido.cupon ? " (" + pedido.cupon + ")" : ""}`;
  document.getElementById("summaryDiscount").textContent = `- S/ ${desc.toFixed(2)}`;
  const total = `S/ ${pedido.total.toFixed(2)}`;
  document.getElementById("summaryTotal").textContent = total;
  document.getElementById("mpAmount").textContent = total;
  document.getElementById("yapeMonto").textContent = total;
}

async function validarCupon(codigo) {
  codigo = String(codigo || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9_-]{3,20}$/.test(codigo)) return { ok: false, msg: "Código no válido" };
  if (typeof db === "undefined" || !db) return { ok: false, msg: "No se pudo verificar el cupón ahora" };
  try {
    const s = await db.collection("cupones").doc(codigo).get();
    if (!s.exists) return { ok: false, msg: "Ese código no existe" };
    const d = s.data();
    if (d.activo === false) return { ok: false, msg: "Este cupón no está disponible" };
    const vence = d.vence && d.vence.toMillis ? d.vence.toMillis() : 0;
    if (vence <= Date.now()) return { ok: false, msg: "Este cupón ya venció" };
    return { ok: true, cupon: { codigo, tipo: d.tipo === "monto" ? "monto" : "porcentaje", valor: Number(d.valor) || 0, vence } };
  } catch (e) {
    console.error("[pago.js] No se pudo verificar el cupón:", e);
    return { ok: false, msg: "No se pudo verificar el cupón. Intenta de nuevo" };
  }
}

function wireCupon(pedido) {
  const input = document.getElementById("couponInput");
  const btn = document.getElementById("couponBtn");
  const msg = document.getElementById("couponMsg");
  if (!input || !btn || !msg) return;

  const guardar = () => localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(pedido));
  const mostrar = (texto, cls) => { msg.textContent = texto || ""; msg.className = "summary-coupon-msg " + (cls || ""); };

  function pintar() {
    const aplicado = !!pedido.cupon && (Number(pedido.descuento) || 0) > 0;
    input.value = aplicado ? pedido.cupon : input.value;
    input.disabled = aplicado || !!pedido.pedidoId;
    btn.textContent = aplicado ? "Quitar" : "Aplicar";
    btn.disabled = !!pedido.pedidoId;
    if (aplicado) mostrar(`Cupón aplicado: ${pedido.cupon}`, "ok");
    else if (!msg.classList.contains("err")) mostrar("");
  }

  btn.addEventListener("click", async () => {
    if (pedido.pedidoId) return;
    if (pedido.cupon && (Number(pedido.descuento) || 0) > 0) {
      pedido.descuento = 0;
      pedido.cupon = "";
      pedido.total = Math.round((pedido.subtotal + pedido.shipping) * 100) / 100;
      guardar();
      try { localStorage.removeItem("mps_coupon"); } catch (e) {}
      input.value = "";
      mostrar("");
      actualizarMontos(pedido);
      pintar();
      return;
    }
    if (!input.value.trim()) { mostrar("Escribe tu código de descuento", "err"); return; }
    btn.disabled = true;
    mostrar("Validando…");
    const r = await validarCupon(input.value);
    btn.disabled = false;
    if (!r.ok) { mostrar(r.msg, "err"); return; }
    const c = r.cupon;
    const bruto = c.tipo === "monto" ? c.valor : (pedido.subtotal * c.valor) / 100;
    pedido.descuento = Math.round(Math.min(bruto, pedido.subtotal) * 100) / 100;
    pedido.cupon = c.codigo;
    pedido.total = Math.round((pedido.subtotal - pedido.descuento + pedido.shipping) * 100) / 100;
    guardar();
    try { localStorage.setItem("mps_coupon", JSON.stringify(c)); } catch (e) {}
    actualizarMontos(pedido);
    mostrar("");
    pintar();
  });

  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); btn.click(); } });
  pintar();
}

function descontarStock(pedido) {
  if (typeof db === "undefined" || !db) return Promise.resolve({ ok: true, descontado: false });
  const grupos = {};
  pedido.items.forEach((i) => {
    const g = grupos[i.id] || (grupos[i.id] = { ref: db.collection("productos").doc(String(i.id)), es: 0, en: 0, names: { es: i.name, en: i.name } });
    if (i.ed === "en") { g.en += i.qty; g.names.en = i.name; } else { g.es += i.qty; g.names.es = i.name; }
  });
  const lista = Object.values(grupos);
  return db
    .runTransaction(async (tx) => {
      const snaps = await Promise.all(lista.map((g) => tx.get(g.ref)));
      let hubo = false;
      const cambios = [];
      snaps.forEach((s, k) => {
        if (!s.exists) return;
        const d = s.data(), g = lista[k], upd = {};
        [["es", "stock"], ["en", "stock_en"]].forEach(([ed, campo]) => {
          const qty = g[ed];
          if (!qty) return;
          const st = d[campo];
          if (typeof st !== "number") return;
          if (st < qty) throw { sinStock: g.names[ed], disponible: Math.max(0, st) };
          upd[campo] = st - qty;
        });
        if (Object.keys(upd).length) cambios.push([g.ref, upd]);
      });
      cambios.forEach(([ref, upd]) => { tx.update(ref, upd); hubo = true; });
      return hubo;
    })
    .then((hubo) => ({ ok: true, descontado: !!hubo }))
    .catch((err) => {
      if (err && err.sinStock) {
        const msg =
          err.disponible === 0
            ? `"${err.sinStock}" se agotó. Vuelve a la tienda y ajusta tu carrito.`
            : `De "${err.sinStock}" solo quedan ${err.disponible}. Vuelve a la tienda y ajusta tu carrito.`;
        return { ok: false, msg };
      }
      console.error("[pago.js] No se pudo descontar el stock:", err);
      return { ok: true, descontado: false };
    });
}

async function registrarPedido(pedido, metodo, envio) {
  try {
    const user = typeof auth !== "undefined" && auth && auth.currentUser;
    if (!user || typeof db === "undefined" || !db) return { ok: true };

    const esNuevo = !pedido.pedidoId;
    let descontado = false;
    if (esNuevo) {
      const r = await descontarStock(pedido);
      if (!r.ok) return r;
      descontado = r.descontado;
      pedido.pedidoId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(pedido));
    }

    const datos = { metodo };
    if (envio) datos.envio = envio;
    if (esNuevo) {
      Object.assign(datos, {
        items: pedido.items.map((i) => ({ id: i.id, ed: i.ed || "es", name: i.name, price: i.price, qty: i.qty, image: (i.image && i.image.indexOf("data:") !== 0) ? i.image : "" })),
        subtotal: pedido.subtotal,
        shipping: pedido.shipping,
        descuento: Number(pedido.descuento) || 0,
        cupon: pedido.cupon || "",
        total: pedido.total,
        estado: "pendiente",
        stockDescontado: descontado,
        creado: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    const guardado = db.collection("usuarios").doc(user.uid).collection("pedidos").doc(pedido.pedidoId).set(datos, { merge: true });
    await Promise.race([guardado, new Promise((r) => setTimeout(r, 3000))]).catch((error) => {
      console.error("[pago.js] No se pudo guardar el pedido:", error);
    });
    return { ok: true };
  } catch (error) {
    console.error("[pago.js] No se pudo guardar el pedido:", error);
    return { ok: true };
  }
}

function metodoSeleccionado() {
  const checked = document.querySelector('input[name="metodoPago"]:checked');
  return checked ? checked.value : "mercadopago";
}

function actualizarMetodoPago() {
  const metodo = metodoSeleccionado();
  const esYape = metodo === "yape";

  document.querySelectorAll(".pay-method").forEach((el) => {
    const input = el.querySelector("input");
    el.classList.toggle("is-active", input.checked);
  });

  document.getElementById("panelMp").style.display = esYape ? "none" : "flex";
  document.getElementById("panelYape").style.display = esYape ? "flex" : "none";

}

function abrirModalYape(pedido) {
  const total = `S/ ${pedido.total.toFixed(2)}`;
  document.getElementById("yapeAmount").textContent = total;

  const qr = document.getElementById("yapeQr");
  qr.onerror = () => {
    qr.onerror = null;
    qr.src = QR_PLACEHOLDER;
  };
  qr.src = YAPE_QR_SRC;

  const mensaje =
    `Hola, acabo de pagar mi pedido de MegaPokeStore por ${total} con Yape. ` +
    `Te envío la captura del pago. Mi nombre es: ____ y mi nickname de TikTok es: ____`;
  document.getElementById("yapeWhatsappBtn").href =
    `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent(mensaje)}`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById("yapeModal")).show();
}

function wireFormularioPago(pedido) {
  const form = document.getElementById("checkoutForm");
  const submitBtn = document.getElementById("checkoutSubmit");

  document.querySelectorAll('input[name="metodoPago"]').forEach((radio) => {
    radio.addEventListener("change", actualizarMetodoPago);
  });
  actualizarMetodoPago();

  document.getElementById("yapePayBtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    const r = await registrarPedido(pedido, "yape");
    btn.disabled = false;
    if (!r.ok) { showToast(r.msg); return; }
    abrirModalYape(pedido);
  });

  document.getElementById("mpAmount").textContent = `S/ ${pedido.total.toFixed(2)}`;
  document.getElementById("yapeMonto").textContent = `S/ ${pedido.total.toFixed(2)}`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (metodoSeleccionado() !== "mercadopago") return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!PAGO_API_URL || PAGO_API_URL.includes("TU-WORKER")) {
      showToast("Falta configurar la URL del servidor de pagos");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Redirigiendo a Mercado Pago…";

    const envio = {
      nombre: form.nombre.value.trim(),
    };
    registrarPedido(pedido, "mercadopago", envio).then((r) => {
      if (!r.ok) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Pagar con Mercado Pago";
        showToast(r.msg);
        return;
      }
      fetch(PAGO_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId: pedido.pedidoId || "web-" + Date.now().toString(36),
          items: pedido.items.map((i) => ({ id: i.id, ed: i.ed || "es", price: i.price, qty: i.qty })),
          cupon: pedido.cupon || "",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.url) throw new Error(data.error || "Sin URL de pago");
          window.location.href = data.url;
        })
        .catch((err) => {
          console.error("[pago.js] No se pudo crear el pago:", err);
          submitBtn.disabled = false;
          submitBtn.textContent = "Pagar con Mercado Pago";
          showToast("No se pudo iniciar el pago. Intenta de nuevo");
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const pedido = leerPedidoGuardado();
  const checkoutContent = document.getElementById("checkoutContent");
  const checkoutEmpty = document.getElementById("checkoutEmpty");

  if (!pedido) {
    checkoutContent.style.display = "none";
    checkoutEmpty.style.display = "flex";
    return;
  }

  renderResumenPedido(pedido);
  wireFormularioPago(pedido);
  wireCupon(pedido);
});
