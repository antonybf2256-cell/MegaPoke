(function () {
  if (typeof db === "undefined" || !db || typeof PRODUCTS === "undefined") return;

  var DEF = {};
  PRODUCTS.forEach(function (p) { DEF[p.id] = p; DEF["n:" + p.name] = p; });

  function aplicar() {
    Promise.all([
      db.collection("productos").get(),
      db.collection("banners").get(),
      db.collection("config").doc("tienda").get(),
    ]).then(function (r) {
      var porOrden = function (a, b) { return (a.orden || 0) - (b.orden || 0); };

      var cfg = r[2].exists ? r[2].data() : {};
      var recargar = false;

      if (Array.isArray(cfg.expansiones)) {
        EXPANSIONS.splice.apply(EXPANSIONS, [0, EXPANSIONS.length].concat(cfg.expansiones.map(function (e) { return String(e || "").trim(); })));
        recargar = true;
      }
      if (cfg.tituloFiltro) { FILTER_TITLE = cfg.tituloFiltro; recargar = true; }

      if (!r[0].empty) {
        var prods = r[0].docs.map(function (d) { return d.data(); })
          .filter(function (x) { return x.activo !== false; }).sort(porOrden)
          .map(function (x) {
            var c = Object.assign({}, x); delete c.orden; delete c.activo;
            var d = DEF[c.id] || DEF["n:" + c.name];
            if (d) ["contenido", "expansion"].forEach(function (k) {
              if (c[k] === undefined && d[k]) c[k] = d[k];
            });
            return c;
          });
        PRODUCTS.splice.apply(PRODUCTS, [0, PRODUCTS.length].concat(prods));
        recargar = true;
        renderMegaMenus();
      }
      if (recargar) renderAllCategoryGrids();

      if (!r[1].empty) {
        var slides = r[1].docs.map(function (d) { return d.data(); })
          .filter(function (x) { return x.activo !== false && x.image; }).sort(porOrden)
          .map(function (x, i) {
            return { id: x.id || "slide-" + i, image: x.image, alt: x.alt || x.title || "", eyebrow: x.eyebrow || "",
                     title: x.title || "", precio: Number(x.precio) || 0, precioNota: x.precioNota || "", cta: { label: x.ctaLabel || "Ver más", nav: x.ctaNav || "inicio" } };
          });
        if (slides.length) {
          HERO_SLIDES.splice.apply(HERO_SLIDES, [0, HERO_SLIDES.length].concat(slides));
          heroSlideIndex = 0;
          renderHeroCarousel();
          pintarPrecios(slides);
        }
      }

      var barra = document.querySelector(".utility-message");
      if (cfg.avisoBarra && barra && barra.lastChild && barra.lastChild.nodeType === 3) {
        barra.lastChild.textContent = cfg.avisoBarra;
      }
    }).catch(function (e) { console.error("[contenido-tienda.js]", e); });
  }

  function precioTxt(s) { return "S/ " + s.precio.toFixed(2) + (s.precioNota ? " · " + s.precioNota : ""); }

  function pintarPrecios(slides) {
    document.querySelectorAll(".hero-carousel-slide").forEach(function (el) {
      var s = slides[Number(el.dataset.slideIndex)];
      var cta = el.querySelector(".hero-carousel-cta");
      if (!s || !s.precio || !cta) return;
      var p = document.createElement("span");
      p.className = "hero-carousel-price";
      p.textContent = precioTxt(s);
      cta.parentNode.insertBefore(p, cta);
    });
    var g = document.getElementById("dynamicsGrid");
    if (!g) return;
    g.innerHTML = slides.map(function (s) {
      return '<article class="dynamic-card"><div class="dynamic-media"><img src="' + escapeHTML(s.image) + '" alt="' + escapeHTML(s.alt) + '" loading="lazy">' +
        (s.precio ? '<span class="dynamic-price">S/ ' + s.precio.toFixed(2) + "</span>" : "") + "</div>" +
        '<div class="dynamic-body">' + (s.eyebrow ? '<span class="dynamic-tag">' + escapeHTML(s.eyebrow) + "</span>" : "") +
        "<h3>" + escapeHTML(s.title) + "</h3>" +
        (s.precioNota ? '<span class="dynamic-extra">' + escapeHTML(s.precioNota) + "</span>" : "") + "</div></article>";
    }).join("");
  }

  function enlaceAdmin() {
    if (!auth) return;
    auth.onAuthStateChanged(function (u) {
      var previo = document.getElementById("adminLink");
      if (previo) previo.remove();
      if (!u) return;
      db.collection("admins").doc(u.uid).get().then(function (s) {
        var cont = document.querySelector(".header-right");
        if (!s.exists || !cont || document.getElementById("adminLink")) return;
        var a = document.createElement("a");
        a.id = "adminLink"; a.href = "admin.html"; a.className = "account-btn";
        a.style.textDecoration = "none"; a.innerHTML = "<span>Panel admin</span>";
        cont.insertBefore(a, cont.firstChild);
      }).catch(function () {});
    });
  }

  function iniciar() { aplicar(); enlaceAdmin(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
