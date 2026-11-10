const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const MP_TOKEN = defineSecret("MP_ACCESS_TOKEN");

// Se usa solo si no se puede detectar el dominio desde el que se paga
const SITIO_POR_DEFECTO = "https://megapokestore.web.app";

exports.crearPago = onCall({ secrets: [MP_TOKEN], cors: true }, async (req) => {
  const { pedidoId, items, cupon } = req.data || {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    throw new HttpsError("invalid-argument", "Pedido inválido");
  }

  const db = admin.firestore();

  // 1) Subtotal recalculado con los precios de Firestore (según la edición)
  let subtotal = 0;
  for (const it of items) {
    const qty = Math.floor(Number(it.qty) || 0);
    if (qty < 1 || qty > 99) throw new HttpsError("invalid-argument", "Cantidad inválida");
    const snap = await db.collection("productos").doc(String(it.id)).get();
    let precio = Number(it.price) || 0; // respaldo si el producto aún no está en Firestore
    if (snap.exists) {
      const d = snap.data();
      const campo = it.ed === "en" ? d.price_en : d.price;
      if (typeof campo === "number" && campo >= 0) precio = campo;
    }
    subtotal += precio * qty;
  }
  subtotal = Math.round(subtotal * 100) / 100;

  // 2) Cupón validado en el servidor
  let descuento = 0;
  if (cupon) {
    const codigo = String(cupon).trim().toUpperCase();
    if (/^[A-Z0-9_-]{3,20}$/.test(codigo)) {
      const c = await db.collection("cupones").doc(codigo).get();
      if (c.exists) {
        const d = c.data();
        const vence = d.vence && d.vence.toMillis ? d.vence.toMillis() : 0;
        if (d.activo !== false && vence > Date.now()) {
          const v = Number(d.valor) || 0;
          const bruto = d.tipo === "monto" ? v : (subtotal * v) / 100;
          descuento = Math.round(Math.min(bruto, subtotal) * 100) / 100;
        }
      }
    }
  }

  // 3) Envío: gratis desde S/ 150 (misma regla que la tienda)
  const envio = subtotal === 0 || subtotal >= 150 ? 0 : 12.9;
  const total = Math.round((subtotal - descuento + envio) * 100) / 100;
  if (!(total > 0)) throw new HttpsError("failed-precondition", "Monto inválido");

  // 4) Dominio al que volver después de pagar
  const origen = req.rawRequest && req.rawRequest.headers && req.rawRequest.headers.origin;
  const sitio = origen && /^https?:\/\//.test(origen) ? origen : SITIO_POR_DEFECTO;

  // 5) Crear el pago en Mercado Pago con el monto exacto
  const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + MP_TOKEN.value(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{
        title: "Pedido MegaPokeStore",
        quantity: 1,
        currency_id: "PEN",
        unit_price: total,
      }],
      external_reference: String(pedidoId || "sin-id"),
      back_urls: {
        success: sitio + "/index.html?pago=ok",
        pending: sitio + "/index.html?pago=pendiente",
        failure: sitio + "/pago.html",
      },
      auto_return: "approved",
    }),
  });

  const data = await resp.json();
  if (!resp.ok || !data.init_point) {
    console.error("Mercado Pago error:", JSON.stringify(data));
    throw new HttpsError("internal", "No se pudo crear el pago");
  }
  return { url: data.init_point, total };
});
