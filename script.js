
const CATEGORIES = {
  sobres:      { label: "Productos" },
  singles:     { label: "Cartas" },
  mazos:       { label: "Mazos" },
  accesorios:  { label: "Accesorios" },
  selladas:    { label: "Selladas" },
};

const CATEGORY_ICON_PATHS = {
  sobres: '<path d="M4 7l8 5 8-5M4 7v10a1 1 0 001 1h14a1 1 0 001-1V7M4 7a1 1 0 011-1h14a1 1 0 011 1" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>',
  singles: '<rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="2" fill="none"/>',
  mazos: '<rect x="4" y="6" width="12" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="8" y="2" width="12" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>',
  accesorios: '<rect x="3" y="5" width="18" height="15" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/>',
  selladas: '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 9h16M9 4v16" stroke="currentColor" stroke-width="2"/>',
};

const CATEGORY_ALIASES = {
  sobres: ["sobres", "sobre", "producto", "productos"],
  singles: ["singles", "single", "carta", "cartas", "carta individual", "cartas individuales", "disponible"],
  mazos: ["mazos", "mazo"],
  accesorios: ["accesorios", "accesorio"],
  selladas: ["selladas", "sellada", "sellado", "sellados"],
};
function catOf(p) {
  const norm = (v) => String(v || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const c = norm(p.category);
  for (const key in CATEGORY_ALIASES) {
    if (CATEGORY_ALIASES[key].indexOf(c) !== -1) return key;
  }
  return null;
}

const PRODUCTS = [
  {
    id: "phantasmal-flames",
    name: "PHANTASMAL FLAMES",
    desc: "10 cartas por sobre. Sellado de fábrica.",
    expansion: "Expansión 1",
    contenido: ["10 cartas por sobre", "1 carta holográfica garantizada", "Sellado de fábrica"],
    price: 24.90,
    price_en: 29.90,
    stock_en: 10,
    tag: "Nuevo",
    color: "#C8102E",
    category: "sobres",
    kind: "pack",
    image: "img/produc/phantasmal.png",
  },
  {
    id: "prismatic-evolution",
    name: "PRISMATIC EVOLUTION",
    desc: "10 cartas por sobre. Sellado de fábrica.",
    expansion: "Expansión 2",
    contenido: ["10 cartas por sobre", "1 carta holográfica garantizada", "Sellado de fábrica"],
    price: 24.90,
    price_en: 29.90,
    stock_en: 10,
    tag: "Nuevo",
    color: "#F5B400",
    category: "sobres",
    kind: "pack",
    image: "img/produc/prismatic.png",
  },
  {
    id: "BUNDLE ACENDED HEROES",
    name: "BUNDLE ACENDED HEROES",
    desc: "10 cartas por sobre. Set reciente, alta demanda.",
    expansion: "Expansión 3",
    contenido: ["10 cartas por sobre", "1 carta holográfica garantizada", "Sellado de fábrica"],
    price: 27.90,
    price_en: 32.90,
    stock_en: 10,
    tag: "Top ventas",
    color: "#2B2B2B",
    category: "sobres",
    kind: "pack",
  },
  {
    id: "pitch-black",
    name: "PITCH BLACK",
    desc: "8 sobres + accesorios exclusivos.",
    expansion: "Expansión 4",
    contenido: ["Caja sellada de fábrica", "36 sobres de 10 cartas", "1 carta promocional"],
    price: 179.90,
    price_en: 184.90,
    stock_en: 10,
    tag: "Top ventas",
    color: "#0D0D0D",
    category: "selladas",
    kind: "pack",
    holo: true,
    image: "img/produc/black.png",
  },
  {
    id: "display-30",
    name: "30th CELEBRATION",
    desc: "Caja sellada, edición completa.",
    expansion: "Expansión 5",
    contenido: ["Caja sellada de fábrica", "36 sobres de 10 cartas", "1 carta promocional"],
    price: 699.90,
    price_en: 704.90,
    stock_en: 10,
    tag: "Sellado",
    color: "#D4AF37",
    category: "selladas",
    kind: "pack",
    holo: true,
    image: "img/produc/30.png",
  },
  {
    id: "UPC LLAMARADAS FANTASMALES",
    name: "UPC LLAMARADAS FANTASMALES",
    desc: "Lata coleccionable + 4 sobres sellados.",
    expansion: "Expansión 6",
    contenido: ["Caja sellada de fábrica", "36 sobres de 10 cartas", "1 carta promocional"],
    price: 129.90,
    price_en: 134.90,
    stock_en: 10,
    tag: "Edición limitada",
    color: "#C8102E",
    category: "selladas",
    kind: "pack",
  },
  {
    id: "destiny-rivals",
    name: "DESTINY RIVALS",
    desc: "Carta individual, rareza secreta.",
    expansion: "Expansión 7",
    contenido: ["1 carta individual", "Estado: Near Mint", "Incluye funda protectora"],
    price: 89.90,
    price_en: 94.90,
    stock_en: 10,
    tag: "Disponible",
    color: "#F5B400",
    category: "singles",
    kind: "card",
    small: true,
    holo: true,
    image: "img/produc/rivals.png",
  },
  {
    id: "acended-hero",
    name: "ACENDED HERO",
    desc: "Carta individual, arte completo.",
    expansion: "Expansión 8",
    contenido: ["1 carta individual", "Estado: Near Mint", "Incluye funda protectora"],
    price: 64.90,
    price_en: 69.90,
    stock_en: 10,
    tag: "Disponible",
    color: "#C8102E",
    category: "singles",
    kind: "card",
    small: true,
    image: "img/produc/acended.png",
  },
  {
    id: "DELTA RAING",
    name: "DELTA RAING",
    desc: "Carta individual, ilustración alterna.",
    expansion: "Expansión 9",
    contenido: ["1 carta individual", "Estado: Near Mint", "Incluye funda protectora"],
    price: 54.90,
    price_en: 59.90,
    stock_en: 10,
    tag: "Disponible",
    color: "#E5A400",
    category: "singles",
    kind: "card",
    small: true,
  },
  {
    id: "chaos-rasing",
    name: "CHAOS RASING",
    desc: "60 cartas listas para jugar.",
    expansion: "Expansión 10",
    contenido: ["60 cartas listas para jugar", "Caja del mazo", "Guía de reglas", "Dados y contadores"],
    price: 69.90,
    price_en: 74.90,
    stock_en: 10,
    tag: "Mazo",
    color: "#C8102E",
    category: "mazos",
    kind: "card",
    small: true,
    image: "img/produc/greninja.png",
  },
  {
    id: "STORM SMERAL",
    name: "STORM SMERAL",
    desc: "Mazo de iniciación, ideal para nuevos jugadores.",
    expansion: "Expansión 1",
    contenido: ["60 cartas listas para jugar", "Caja del mazo", "Guía de reglas", "Dados y contadores"],
    price: 49.90,
    price_en: 54.90,
    stock_en: 10,
    tag: "Mazo",
    color: "#F5B400",
    category: "mazos",
    kind: "card",
    small: true,
  },
  {
    id: "ETB 151L",
    name: "ETB 151L",
    desc: "60 cartas, estrategia de control competitiva.",
    expansion: "Expansión 2",
    contenido: ["60 cartas listas para jugar", "Caja del mazo", "Guía de reglas", "Dados y contadores"],
    price: 74.90,
    price_en: 79.90,
    stock_en: 10,
    tag: "Mazo",
    color: "#1A1A1A",
    category: "mazos",
    kind: "card",
    small: true,
  },
  {
    id: "perfec-order",
    name: "PERFEC ORDER",
    desc: "Protege tus cartas de valor.",
    expansion: "Expansión 3",
    contenido: ["Producto de protección", "Compatible con tamaño estándar", "Caja original incluida"],
    price: 22.90,
    price_en: 27.90,
    stock_en: 10,
    tag: "Accesorio",
    color: "#6E655C",
    category: "accesorios",
    kind: "card",
    small: true,
    image: "img/produc/perfec.png",
  },
  {
    id: "BLISTER PERFEC OREDER",
    name: "BLISTER PERFEC OREDER",
    desc: "Álbum con 20 páginas, capacidad para 160 cartas.",
    expansion: "Expansión 4",
    contenido: ["Producto de protección", "Compatible con tamaño estándar", "Caja original incluida"],
    price: 59.90,
    price_en: 64.90,
    stock_en: 10,
    tag: "Accesorio",
    color: "#C8102E",
    category: "accesorios",
    kind: "card",
    small: true,
  },
  {
    id: "ETB WHIE FLARE",
    name: "ETB WHIE FLARE",
    desc: "Fundas estándar, acabado mate anti-huella.",
    expansion: "Expansión 5",
    contenido: ["Producto de protección", "Compatible con tamaño estándar", "Caja original incluida"],
    price: 18.90,
    price_en: 23.90,
    stock_en: 10,
    tag: "Accesorio",
    color: "#F5B400",
    category: "accesorios",
    kind: "card",
    small: true,
  },
];

const PRICE_BOARD_IDS = [
  "pitch-black",
  "destiny-rivals",
  "display-30",
  "phantasmal-flames",
  "chaos-rasing",
  "prismatic-evolution",
  "acended-hero",
];

let cart = {};
let currentPage = "inicio";
const EXPANSIONS = Array.from({ length: 10 }, (_, i) => "Expansión " + (i + 1));
let FILTER_TITLE = "Filtrar por expansión";
const expState = {};
const filterState = {};
const sortState = {};

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function productIconSVG(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${escapeHTML(p.name)}" class="product-img">`;
  }
  if (p.kind === "card") {
    return `
      <svg viewBox="0 0 100 140" width="80%" height="80%">
        <rect x="4" y="4" width="92" height="132" rx="10" fill="#FAF6F0" stroke="#1A1A1A" stroke-width="3"/>
        <rect x="14" y="14" width="72" height="72" rx="6" fill="${p.color}22" stroke="#1A1A1A" stroke-width="2"/>
        <circle cx="50" cy="50" r="22" fill="${p.color}" stroke="#1A1A1A" stroke-width="2.5"/>
        <rect x="14" y="94" width="72" height="7" rx="3.5" fill="${p.color}"/>
        <rect x="14" y="108" width="50" height="7" rx="3.5" fill="#1A1A1A33"/>
      </svg>`;
  }
  return `
    <svg viewBox="0 0 160 190" width="78%" height="78%">
      <rect x="10" y="20" width="140" height="160" rx="12" fill="${p.color}" stroke="#1A1A1A" stroke-width="3"/>
      <rect x="24" y="34" width="112" height="24" rx="6" fill="#FAF6F0" stroke="#1A1A1A" stroke-width="2"/>
      <rect x="24" y="66" width="112" height="92" rx="8" fill="#FAF6F0" stroke="#1A1A1A" stroke-width="2.5"/>
      <path d="M80 84 L96 116 H64 Z" fill="#1A1A1A"/>
      <circle cx="80" cy="134" r="12" fill="#1A1A1A"/>
      <path d="M10 20 L80 60 L150 20" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
    </svg>`;
}

function stockOf(p) {
  if (!p || p.stock === undefined || p.stock === null || p.stock === "") return null;
  const n = Number(p.stock);
  return isFinite(n) ? Math.max(0, Math.floor(n)) : null;
}
function stockLabelHTML(p, L) {
  const st = stockOf(p);
  if (st === null) return "";
  if (st <= 0) return `<span class="stock-badge out">${(L && L.soldOut) || "Agotado"}</span>`;
  if (st <= 5) return `<span class="stock-badge low">${(L && L.low) || "Por agotarse"}</span>`;
  return `<span class="stock-badge">${(L && L.available) || "Disponible"}</span>`;
}

function labelTextColor(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return "#fff";
  const n = parseInt(m[1], 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6 ? "#171717" : "#fff";
}
function customLabelsHTML(p, cls) {
  if (!Array.isArray(p.etiquetas)) return "";
  return p.etiquetas
    .filter((e) => e && e.texto)
    .map((e) => {
      const bg = /^#[0-9a-f]{6}$/i.test(e.color || "") ? e.color : "#742284";
      return `<span class="${cls}" style="background:${bg};color:${labelTextColor(bg)}">${escapeHTML(e.texto)}</span>`;
    })
    .join("");
}

function productCardHTML(p) {
  return `
    <div class="product-card" data-pid="${escapeHTML(p.id)}" tabindex="0">
      <div class="product-media">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        ${(p.holo || (Array.isArray(p.etiquetas) && p.etiquetas.some((e) => e && e.texto))) ? `<div class="product-badges">${p.holo ? `<span class="product-stamp">NUEVO</span>` : ""}${customLabelsHTML(p, "pb-label")}</div>` : ""}
        ${productIconSVG(p)}
      </div>
      <div class="product-info">
        <h3>${escapeHTML(p.name)}</h3>
        <p class="desc">${escapeHTML(p.desc)}</p>
        <div class="product-bottom">
          <div class="price-wrap">
            <span class="price-label">Precio</span>
            <span class="price">S/ ${p.price.toFixed(2)}</span>
            ${stockLabelHTML(p)}
          </div>
          <button class="btn btn-primary btn-sm add-btn${stockOf(p) === 0 ? " sold-out" : ""}" data-id="${p.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </div>`;
}

function wireAddButtons(container) {
  container.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!addToCart(btn.dataset.id)) return;
      btn.classList.add("added");
      const original = btn.innerHTML;
      btn.innerHTML = "Agregado ✓";
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = original;
      }, 900);
    });
  });
}

function sortProducts(list, sort) {
  const copy = [...list];
  if (sort === "precio-asc") copy.sort((a, b) => a.price - b.price);
  else if (sort === "precio-desc") copy.sort((a, b) => b.price - a.price);
  return copy;
}

function buildFilters(category) {
  const layout = document.querySelector(`.catalog-layout[data-category="${category}"]`);
  if (!layout) return;
  const aside = layout.querySelector(".filters");
  const tags = [...new Set(PRODUCTS.filter((p) => catOf(p) === category && p.tag).map((p) => p.tag))];

  const exps = EXPANSIONS.filter(Boolean);
  const attr = (v) => escapeHTML(v).replace(/"/g, "&quot;");

  filterState[category] = new Set(tags);
  expState[category] = new Set(exps);
  sortState[category] = "relevancia";

  aside.innerHTML = `
    <h4>${escapeHTML(FILTER_TITLE)}</h4>
    <div class="filter-group">
      ${exps
        .map(
          (e) => `
        <label class="filter-option">
          <input type="checkbox" value="${attr(e)}" checked data-exp-for="${category}">
          ${escapeHTML(e)}
        </label>`
        )
        .join("")}
    </div>
    <button class="filter-reset" type="button" data-reset-for="${category}">Restablecer filtros</button>
  `;

  aside.querySelectorAll(`input[data-filter-for="${category}"]`).forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) filterState[category].add(input.value);
      else filterState[category].delete(input.value);
      renderCategoryGrid(category);
    });
  });

  aside.querySelectorAll(`input[data-exp-for="${category}"]`).forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) expState[category].add(input.value);
      else expState[category].delete(input.value);
      renderCategoryGrid(category);
    });
  });

  aside.querySelector(`[data-reset-for="${category}"]`).addEventListener("click", () => {
    filterState[category] = new Set(tags);
    expState[category] = new Set(exps);
    aside.querySelectorAll("input[type=checkbox]").forEach((input) => (input.checked = true));
    renderCategoryGrid(category);
  });
}

function renderCategoryGrid(category) {
  const grid = document.getElementById("grid" + capitalize(category));
  const countEl = document.getElementById("count" + capitalize(category));
  if (!grid) return;

  const active = filterState[category];
  const activeExp = expState[category];
  const expOk = (p) =>
    !activeExp || activeExp.size === 0 || !p.expansion || EXPANSIONS.indexOf(p.expansion) === -1 || activeExp.has(p.expansion);
  let list = PRODUCTS.filter(
    (p) => catOf(p) === category && (!active || active.size === 0 || active.has(p.tag)) && expOk(p)
  );
  list = sortProducts(list, sortState[category] || "relevancia");

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-dim);">
      No hay productos con los filtros seleccionados.
    </p>`;
  } else {
    grid.innerHTML = list.map(productCardHTML).join("");
    wireAddButtons(grid);
  }

  if (countEl) {
    const total = PRODUCTS.filter((p) => catOf(p) === category).length;
    countEl.textContent = `${list.length} de ${total} producto${total === 1 ? "" : "s"}`;
  }
}

function renderAllCategoryGrids() {
  Object.keys(CATEGORIES).forEach((cat) => {
    buildFilters(cat);
    renderCategoryGrid(cat);
  });

  document.querySelectorAll(".sort-select").forEach((select) => {
    select.addEventListener("change", () => {
      const category = select.dataset.sortFor;
      sortState[category] = select.value;
      renderCategoryGrid(category);
    });
  });
}

function updateFiltersToggleCount(category) {
  const btn = document.querySelector(`[data-filters-toggle="${category}"]`);
  if (!btn) return;
  const badge = btn.querySelector(".filters-toggle-count");
  if (!badge) return;
  const layout = document.querySelector(`.catalog-layout[data-category="${category}"]`);
  const totalTags = layout ? layout.querySelectorAll(`input[data-filter-for="${category}"]`).length : 0;
  const activeSize = filterState[category] ? filterState[category].size : totalTags;
  const totalExp = layout ? layout.querySelectorAll(`input[data-exp-for="${category}"]`).length : 0;
  const activeExp = expState[category] ? expState[category].size : totalExp;
  const activeCount = Math.max(0, totalTags - activeSize) + Math.max(0, totalExp - activeExp);
  if (activeCount > 0) {
    badge.textContent = activeCount;
    badge.classList.add("show");
  } else {
    badge.textContent = "";
    badge.classList.remove("show");
  }
}

function wireFiltersToggle() {
  document.querySelectorAll("[data-filters-toggle]").forEach((btn) => {
    const category = btn.dataset.filtersToggle;
    const aside = document.querySelector(`.catalog-layout[data-category="${category}"] .filters`);
    if (!aside) return;

    btn.addEventListener("click", () => {
      const isOpen = aside.classList.toggle("filters-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) aside.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    aside.addEventListener("change", (e) => {
      if (e.target.matches(`input[data-filter-for="${category}"]`)) updateFiltersToggleCount(category);
    });
    aside.addEventListener("click", (e) => {
      if (e.target.matches(`[data-reset-for="${category}"]`)) updateFiltersToggleCount(category);
    });
  });
}

const HERO_SLIDES = [
  {
    id: "slide-1",
    image: "img/dinamicas/Energias.jpg",
    alt: "Dinamica de energias",
    eyebrow: "Dinamiva de energias - MegaPokeStore",
    title: "Cada sobre esconde una sorpresa.",
    cta: { label: "Unirme", nav: "sobres" },
  },
  {
    id: "slide-2",
    image: "img/dinamicas/PokeDestino.jpg",
    alt: "Noche de Sobres Sellados",
    eyebrow: "Dinamica Poke Destino - Dinamica de eliminacion",
    title: "Escoge tus cartas y elimina atus adversarios para asi ganar el premio.",
    cta: { label: "Unirme", nav: "singles" },
  },
  {
    id: "slide-3",
    image: "img/dinamicas/mecha.jpg",
    alt: "Poke Mecha - MegaPokeStore",
    eyebrow: "Poke Mecha - MegaPokeStore.",
    title: "Enfrentate con otros jugadores para ganar uno de los premios.",
    cta: { label: "Unirme", nav: "mazos" },
  },
];

const ICON_PAUSE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
const ICON_PLAY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l14 8-14 8V4z"/></svg>`;

let heroSlideIndex = 0;
let heroCarouselTimer = null;
let heroCarouselPaused = false;

function heroSlideHTML(slide, i) {
  return `
      <div class="hero-carousel-slide${i === 0 ? " active" : ""}" data-slide-index="${i}">
        <img src="${slide.image}" alt="${escapeHTML(slide.alt)}" class="hero-carousel-img">
        <div class="hero-carousel-scrim" aria-hidden="true"></div>
        <div class="hero-carousel-caption">
          <span class="hero-carousel-eyebrow">${escapeHTML(slide.eyebrow)}</span>
          <h2 class="hero-carousel-title">${escapeHTML(slide.title)}</h2>
          <a href="#" class="hero-carousel-cta" data-nav="${slide.cta.nav}">${escapeHTML(slide.cta.label)}</a>
        </div>
      </div>`;
}

function heroDotHTML(_, i) {
  return `<button type="button" class="hero-carousel-dot${i === 0 ? " active" : ""}" data-dot-index="${i}" aria-label="Ir a la imagen ${i + 1}"></button>`;
}

function renderHeroCarousel() {
  const track = document.getElementById("heroCarouselTrack");
  const dots = document.getElementById("heroCarouselDots");
  if (!track || !dots) return;
  track.innerHTML = HERO_SLIDES.map(heroSlideHTML).join("");
  dots.innerHTML = HERO_SLIDES.map(heroDotHTML).join("");
  track.querySelectorAll(".hero-carousel-cta[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goToPage(el.dataset.nav);
    });
  });
}

function goToHeroSlide(index) {
  const track = document.getElementById("heroCarouselTrack");
  const dots = document.getElementById("heroCarouselDots");
  if (!track || !dots) return;
  heroSlideIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
  track.querySelectorAll(".hero-carousel-slide").forEach((el, i) => {
    el.classList.toggle("active", i === heroSlideIndex);
  });
  dots.querySelectorAll(".hero-carousel-dot").forEach((el, i) => {
    el.classList.toggle("active", i === heroSlideIndex);
  });
}

function advanceHeroCarousel() {
  goToHeroSlide(heroSlideIndex + 1);
}

function startHeroCarouselAutoplay() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;
  if (heroCarouselTimer) clearInterval(heroCarouselTimer);
  heroCarouselTimer = setInterval(advanceHeroCarousel, 3800);
}

function stopHeroCarouselAutoplay() {
  if (heroCarouselTimer) clearInterval(heroCarouselTimer);
  heroCarouselTimer = null;
}

function wireHeroCarousel() {
  const dots = document.getElementById("heroCarouselDots");
  const pauseBtn = document.getElementById("heroCarouselPause");

  if (dots) {
    dots.addEventListener("click", (e) => {
      const dot = e.target.closest(".hero-carousel-dot");
      if (!dot) return;
      heroCarouselPaused = true;
      stopHeroCarouselAutoplay();
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-label", "Reanudar carrusel");
        pauseBtn.innerHTML = ICON_PLAY;
      }
      goToHeroSlide(Number(dot.dataset.dotIndex));
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      heroCarouselPaused = !heroCarouselPaused;
      if (heroCarouselPaused) {
        stopHeroCarouselAutoplay();
        pauseBtn.setAttribute("aria-label", "Reanudar carrusel");
        pauseBtn.innerHTML = ICON_PLAY;
      } else {
        startHeroCarouselAutoplay();
        pauseBtn.setAttribute("aria-label", "Pausar carrusel");
        pauseBtn.innerHTML = ICON_PAUSE;
      }
    });
  }
}

function renderSearchResults(term) {
  const grid = document.getElementById("gridResultados");
  const countEl = document.getElementById("countResultados");
  const titleEl = document.getElementById("resultadosTitulo");
  const q = term.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  );

  titleEl.textContent = `Resultados para "${term}"`;
  countEl.textContent = `${list.length} producto${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-dim);">
      No encontramos productos para "${escapeHTML(term)}".
    </p>`;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join("");
  wireAddButtons(grid);
}

function pickMegaFeatured(category) {
  const list = PRODUCTS.filter((p) => catOf(p) === category);
  return list.find((p) => p.holo) || list[0];
}

const MEGA_HELP_LINKS = {
  sobres: [
    { label: "Cómo se abre un sobre", toast: "Demo: guía de apertura de sobres" },
    { label: "Probabilidades por set", toast: "Demo: tabla de probabilidades" },
    { label: "Verificación de sellado", toast: "Demo: cómo verificamos el sellado" },
    { label: "Preguntas frecuentes", toast: "Demo: preguntas frecuentes" },
  ],
  singles: [
    { label: "Guía de condición", toast: "Demo: guía de condición de cartas" },
    { label: "Cómo leemos la rareza", toast: "Demo: guía de rareza" },
    { label: "Autenticidad y grading", toast: "Demo: proceso de autenticación" },
    { label: "Preguntas frecuentes", toast: "Demo: preguntas frecuentes" },
  ],
  mazos: [
    { label: "Cómo elegir tu mazo", toast: "Demo: guía para elegir mazo" },
    { label: "Reglas básicas del juego", toast: "Demo: guía de reglas" },
    { label: "Torneos y eventos", toast: "Demo: calendario de torneos" },
    { label: "Preguntas frecuentes", toast: "Demo: preguntas frecuentes" },
  ],
  accesorios: [
    { label: "Guía de tallas de fundas", toast: "Demo: guía de tallas de fundas" },
    { label: "Cómo cuidar tu colección", toast: "Demo: guía de cuidado" },
    { label: "Comparar binders", toast: "Demo: comparador de binders" },
    { label: "Preguntas frecuentes", toast: "Demo: preguntas frecuentes" },
  ],
  selladas: [
    { label: "Guía de inversión", toast: "Demo: guía de inversión en sellado" },
    { label: "Cómo almacenar cajas", toast: "Demo: guía de almacenamiento" },
    { label: "Verificación de sellado", toast: "Demo: cómo verificamos el sellado" },
    { label: "Preguntas frecuentes", toast: "Demo: preguntas frecuentes" },
  ],
};

function megaMenuSetItems(category) {
  return PRODUCTS.filter((p) => catOf(p) === category);
}

const MEGA_PRODUCT_TYPES = {
  sobres: ["Sobre individual", "Display de sobres", "Blister especial", "Caja coleccionable"],
  singles: ["Carta holográfica", "Rareza secreta", "Arte alterno", "Reverse holo"],
  mazos: ["Mazo temático", "Mazo de iniciación", "Mazo competitivo", "Mazo de torneo"],
  accesorios: ["Fundas protectoras", "Binders y álbumes", "Cajas de almacenamiento", "Playmats"],
  selladas: ["Caja sellada", "Lata coleccionable", "Edición limitada", "Bundle especial"],
};

function megaMenuTrendingItems(category) {
  const rank = (p) => {
    const i = PRICE_BOARD_IDS.indexOf(p.id);
    return i === -1 ? PRICE_BOARD_IDS.length : i;
  };
  return PRODUCTS.filter((p) => catOf(p) === category)
    .sort((x, y) => rank(x) - rank(y))
    .slice(0, 4);
}

function megaSetLinkHTML(p) {
  return `<li><a href="#" data-mega-search="${escapeHTML(p.name)}">${escapeHTML(p.name)}</a></li>`;
}

function megaMenuHTML(category) {
  const meta = CATEGORIES[category];
  const featured = pickMegaFeatured(category);
  if (!featured) return "";

  const setItems = megaMenuSetItems(category);
  const productTypes = MEGA_PRODUCT_TYPES[category] || [];
  const trending = megaMenuTrendingItems(category);
  const helpLinks = MEGA_HELP_LINKS[category] || [];

  return `
    <div class="mega-menu-inner">
      <div class="mega-menu-eyebrow">
        <h3>${meta.label}</h3>
        <div class="mega-eyebrow-links">
          <a href="#" class="mega-shopall" data-nav="${category}">Ver todo ${escapeHTML(meta.label)}</a>
          <a href="#" class="mega-shopall" data-toast="Demo: ranking completo de más buscados">Ver más buscados</a>
        </div>
      </div>

      <div class="mega-menu-body">
        <div class="mega-sets-col">
          <h4>Expansiones</h4>
          <ul>${setItems.map(megaSetLinkHTML).join("")}</ul>
        </div>

        <div class="mega-sets-col">
          <h4>Productos</h4>
          <ul>
            ${productTypes
              .map(
                (label) =>
                  `<li><a href="#" data-toast="Demo: catálogo filtrado por ${escapeHTML(label)}">${escapeHTML(label)}</a></li>`
              )
              .join("")}
          </ul>
        </div>

        <div class="mega-mini-col">
          <h4>Más buscados</h4>
          <ul>
            ${trending.map((p) => `<li><a href="#" data-mega-search="${escapeHTML(p.name)}">${escapeHTML(p.name)}</a></li>`).join("")}
          </ul>
        </div>

        <div class="mega-mini-col">
          <h4>Ayuda</h4>
          <ul>
            ${helpLinks.map((h) => `<li><a href="#" data-toast="${escapeHTML(h.toast)}">${escapeHTML(h.label)}</a></li>`).join("")}
          </ul>
        </div>

        <div class="mega-promo">
          <div class="mega-promo-media">${productIconSVG(featured)}</div>
          <h4>${escapeHTML(featured.name)}</h4>
          <a href="#" class="btn-preorder" data-mega-search="${escapeHTML(featured.name)}">Ver producto</a>
          <div class="mega-menu-utils">
            <button type="button" class="mega-util-btn-outline" data-toast="Demo: guía de precios de ${escapeHTML(meta.label)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 6.5c0-1.9-2.24-3.5-5-3.5s-5 1.6-5 3.5 2.24 3.2 5 3.7c2.76.5 5 1.8 5 3.8s-2.24 3.5-5 3.5-5-1.6-5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Guía de precios
            </button>
            <button type="button" class="mega-util-btn-outline mega-search-focus">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Búsqueda avanzada
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderMegaMenus() {
  Object.keys(CATEGORIES).forEach((category) => {
    const mount = document.getElementById("megaMenu-" + category);
    if (mount) mount.innerHTML = megaMenuHTML(category);
  });

  const inicioMount = document.getElementById("megaMenu-inicio");
  if (inicioMount) inicioMount.innerHTML = inicioMegaMenuHTML();
}

function inicioMegaMenuHTML() {
  const cards = Object.entries(CATEGORIES)
    .filter(([key]) => key !== "selladas")
    .map(([key, meta]) => {
      const count = PRODUCTS.filter((p) => catOf(p) === key).length;
      return `
        <a href="#" class="mega-simple-card" data-nav="${key}">
          <span class="icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24">${CATEGORY_ICON_PATHS[key] || ""}</svg></span>
          <span>
            <span class="mega-simple-name">${meta.label}</span>
            <span class="mega-simple-count">${count} producto${count === 1 ? "" : "s"}</span>
          </span>
        </a>`;
    })
    .join("");

  const dinamicasCard = `
        <a href="#" class="mega-simple-card" data-nav="dinamicas">
          <span class="icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span>
          <span>
            <span class="mega-simple-name">Dinámicas</span>
            <span class="mega-simple-count">Torneos y eventos</span>
          </span>
        </a>`;

  return `
    <div class="mega-menu-inner">
      <div class="mega-menu-head">
        <h3>Explorar categorías</h3>
      </div>
      <div class="mega-simple-grid">${cards}${dinamicasCard}</div>
    </div>`;
}

function wireMegaMenus() {
  document.querySelectorAll("[data-mega-search]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const term = el.dataset.megaSearch;
      document.getElementById("searchInput").value = term;
      renderSearchResults(term);
      goToPage("resultados");
    });
  });

  document.querySelectorAll("[data-mega-filter]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const category = el.dataset.megaFilter;
      const tag = el.dataset.megaTag;
      filterState[category] = new Set([tag]);
      const aside = document.querySelector(`.catalog-layout[data-category="${category}"] .filters`);
      if (aside) {
        aside.querySelectorAll(`input[data-filter-for="${category}"]`).forEach((input) => {
          input.checked = input.value === tag;
        });
      }
      renderCategoryGrid(category);
      goToPage(category);
    });
  });

  document.querySelectorAll(".mega-search-focus").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.getElementById("searchInput").focus();
    });
  });
}

function goToPage(page, options = {}) {
  const target = document.getElementById("page-" + page);
  if (!target) return;

  document.querySelectorAll(".page").forEach((el) => el.classList.remove("active"));
  target.classList.add("active");
  currentPage = page;

  document.querySelectorAll("#mainTabs a").forEach((a) => {
    const active = a.dataset.nav === page;
    a.classList.toggle("active", active);
    a.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("#mobileTabs a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === page);
  });

  if (!options.keepScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  toggleMenu(false);
  closeCategoryCollapse();
}

function closeCategoryCollapse() {
  const el = document.getElementById("categoryNavCollapse");
  if (!el || !el.classList.contains("show")) return;
  bootstrap.Collapse.getOrCreateInstance(el).hide();
}

function wireNavLinks() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goToPage(el.dataset.nav);
    });
  });
}

function wireToastLinks() {
  document.querySelectorAll("[data-toast]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

function addToCart(id) {
  const st = stockOf(cartProduct(id));
  if (st !== null) {
    if (st <= 0) { showToast("Producto agotado"); return false; }
    if ((cart[id] || 0) >= st) {
      showToast(`Solo hay ${st} unidad${st === 1 ? "" : "es"} disponible${st === 1 ? "" : "s"}`);
      return false;
    }
  }
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  updateCartCount();
  showToast("Agregado al carrito");
  return true;
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  if (delta > 0) {
    const st = stockOf(cartProduct(id));
    if (st !== null && cart[id] + delta > st) {
      showToast(`Solo hay ${st} unidad${st === 1 ? "" : "es"} disponible${st === 1 ? "" : "s"}`);
      return;
    }
  }
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
  updateCartCount();
}

function getCartEntries() {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = cartProduct(id);
      const { id: baseId, ed } = editionOf(id);
      return product ? { ...product, id, baseId, ed, qty } : null;
    })
    .filter(Boolean);
}

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const countEl = document.getElementById("cartCount");
  countEl.textContent = totalItems;
  countEl.style.display = totalItems > 0 ? "flex" : "none";
}

function renderCart() {
  const entries = getCartEntries();
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const footerEl = document.getElementById("cartFooter");

  if (entries.length === 0) {
    itemsEl.style.display = "none";
    footerEl.style.display = "none";
    emptyEl.style.display = "flex";
    return;
  }

  itemsEl.style.display = "flex";
  footerEl.style.display = "block";
  emptyEl.style.display = "none";

  itemsEl.innerHTML = entries
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-media">${productIconSVG(item)}</div>
      <div class="cart-item-info">
        <div class="cart-item-top">
          <h4>${escapeHTML(item.name)}</h4>
          <span class="cart-item-price">S/ ${(item.price * item.qty).toFixed(2)}</span>
        </div>
        <div class="qty-control">
          <button class="qty-minus" data-id="${item.id}" aria-label="Quitar uno">−</button>
          <span>${item.qty}</span>
          <button class="qty-plus" data-id="${item.id}" aria-label="Agregar uno">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Eliminar</button>
      </div>
    </div>`
    )
    .join("");

  itemsEl.querySelectorAll(".qty-plus").forEach((b) =>
    b.addEventListener("click", () => changeQty(b.dataset.id, 1))
  );
  itemsEl.querySelectorAll(".qty-minus").forEach((b) =>
    b.addEventListener("click", () => changeQty(b.dataset.id, -1))
  );
  itemsEl.querySelectorAll(".remove-btn").forEach((b) =>
    b.addEventListener("click", () => removeFromCart(b.dataset.id))
  );

  updateTotals(entries);
}

let appliedCoupon = null;
try {
  const c = JSON.parse(localStorage.getItem("mps_coupon") || "null");
  if (c && c.codigo && c.vence > Date.now()) appliedCoupon = c;
} catch (e) {}
function saveCoupon() {
  try {
    if (appliedCoupon) localStorage.setItem("mps_coupon", JSON.stringify(appliedCoupon));
    else localStorage.removeItem("mps_coupon");
  } catch (e) {}
}
function couponText(c) {
  return c.tipo === "monto" ? `S/ ${Number(c.valor).toFixed(2)} de descuento` : `${Number(c.valor)}% de descuento`;
}
function couponDiscount(subtotal) {
  if (!appliedCoupon || subtotal <= 0) return 0;
  const v = Number(appliedCoupon.valor) || 0;
  const d = appliedCoupon.tipo === "monto" ? v : (subtotal * v) / 100;
  return Math.round(Math.min(d, subtotal) * 100) / 100;
}
async function validarCupon(codigo) {
  codigo = String(codigo || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9_-]{3,20}$/.test(codigo)) return { ok: false, msg: "Código no válido" };
  if (typeof db === "undefined" || !db) return { ok: false, error: true, msg: "No se pudo verificar el cupón ahora" };
  try {
    const s = await db.collection("cupones").doc(codigo).get();
    if (!s.exists) return { ok: false, msg: "Ese código no existe" };
    const d = s.data();
    if (d.activo === false) return { ok: false, msg: "Este cupón no está disponible" };
    const vence = d.vence && d.vence.toMillis ? d.vence.toMillis() : 0;
    if (vence <= Date.now()) return { ok: false, msg: "Este cupón ya venció" };
    return { ok: true, cupon: { codigo, tipo: d.tipo === "monto" ? "monto" : "porcentaje", valor: Number(d.valor) || 0, vence } };
  } catch (e) {
    console.error("[script.js] No se pudo verificar el cupón:", e);
    return { ok: false, error: true, msg: "No se pudo verificar el cupón. Intenta de nuevo" };
  }
}
function updateCouponUI(msg, cls) {
  const input = document.getElementById("couponInput");
  const btn = document.getElementById("couponBtn");
  const out = document.getElementById("couponMsg");
  if (!input || !btn || !out) return;
  if (appliedCoupon && appliedCoupon.vence <= Date.now()) { appliedCoupon = null; saveCoupon(); }
  if (appliedCoupon) {
    input.value = appliedCoupon.codigo;
    input.disabled = true;
    btn.textContent = "Quitar";
    out.textContent = msg || `Cupón aplicado: ${couponText(appliedCoupon)}`;
    out.className = "cart-coupon-msg ok";
  } else {
    input.disabled = false;
    btn.textContent = "Aplicar";
    if (msg !== undefined) { out.textContent = msg; out.className = "cart-coupon-msg " + (cls || ""); }
    else if (!out.classList.contains("err")) { out.textContent = ""; out.className = "cart-coupon-msg"; }
  }
}
async function toggleCoupon() {
  const input = document.getElementById("couponInput");
  const btn = document.getElementById("couponBtn");
  if (appliedCoupon) {
    appliedCoupon = null;
    saveCoupon();
    input.value = "";
    updateCouponUI("");
    renderCart();
    return;
  }
  if (!input.value.trim()) { updateCouponUI("Escribe tu código de descuento", "err"); return; }
  btn.disabled = true;
  updateCouponUI("Validando…", "");
  const r = await validarCupon(input.value);
  btn.disabled = false;
  if (!r.ok) { updateCouponUI(r.msg, "err"); return; }
  appliedCoupon = r.cupon;
  saveCoupon();
  renderCart();
}

function updateTotals(entries) {
  const subtotal = entries.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 12.9;
  updateCouponUI();
  const descuento = couponDiscount(subtotal);

  document.getElementById("cartSubtotal").textContent = `S/ ${subtotal.toFixed(2)}`;
  const dRow = document.getElementById("cartDiscountRow");
  if (dRow) {
    dRow.style.display = descuento > 0 ? "" : "none";
    document.getElementById("cartDiscountLabel").textContent = descuento > 0 ? `Descuento (${appliedCoupon.codigo})` : "Descuento";
    document.getElementById("cartDiscount").textContent = `- S/ ${descuento.toFixed(2)}`;
  }
  document.getElementById("cartShipping").textContent =
    shipping === 0 ? "Gratis" : `S/ ${shipping.toFixed(2)}`;
  document.getElementById("cartTotal").textContent = `S/ ${(subtotal - descuento + shipping).toFixed(2)}`;
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function getCartOffcanvas() {
  return bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("cartDrawer"));
}
function closeCart() {
  getCartOffcanvas().hide();
}

function toggleMenu(forceState) {
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const overlay = document.getElementById("categoryOverlay");
  const isOpen = typeof forceState === "boolean" ? forceState : !nav.classList.contains("open");
  nav.classList.toggle("open", isOpen);
  overlay.classList.toggle("open", isOpen);
  nav.setAttribute("aria-hidden", String(!isOpen));
  menuBtn.setAttribute("aria-expanded", String(isOpen));
}

function getLoginModal() {
  return bootstrap.Modal.getOrCreateInstance(document.getElementById("loginModal"));
}
function closeLogin() {
  getLoginModal().hide();
}

async function checkout() {
  const entries = getCartEntries();
  if (entries.length === 0) return;

  const usuarioLogueado = typeof auth !== "undefined" && auth && auth.currentUser;
  if (!usuarioLogueado) {
    closeCart();
    showToast("Debes iniciar sesión para completar tu compra");
    getLoginModal().show();
    return;
  }

  const sinStock = entries.find((i) => { const st = stockOf(i); return st !== null && i.qty > st; });
  if (sinStock) {
    const st = stockOf(sinStock);
    showToast(st === 0 ? `"${sinStock.name}" está agotado` : `De "${sinStock.name}" solo quedan ${st}`);
    return;
  }

  if (appliedCoupon) {
    const r = await validarCupon(appliedCoupon.codigo);
    if (!r.ok) {
      if (!r.error) { appliedCoupon = null; saveCoupon(); renderCart(); }
      showToast(r.msg);
      return;
    }
    appliedCoupon = r.cupon;
    saveCoupon();
  }

  const subtotal = entries.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 12.9;
  const descuento = couponDiscount(subtotal);
  const pedido = {
    items: entries.map((i) => ({
      id: i.baseId,
      ed: i.ed,
      name: i.name,
      price: i.price,
      qty: i.qty,
      image: i.image,
    })),
    subtotal,
    shipping,
    descuento,
    cupon: descuento > 0 ? appliedCoupon.codigo : "",
    total: Math.round((subtotal - descuento + shipping) * 100) / 100,
  };
  localStorage.setItem("mps_checkout", JSON.stringify(pedido));

  window.location.href = "pago.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllCategoryGrids();
  wireFiltersToggle();
  renderHeroCarousel();
  startHeroCarouselAutoplay();
  wireHeroCarousel();
  renderCart();
  updateCartCount();
  renderMegaMenus();
  wireNavLinks();
  wireToastLinks();
  wireMegaMenus();

  document.getElementById("checkoutBtn").addEventListener("click", checkout);
  const couponBtn = document.getElementById("couponBtn");
  const couponInput = document.getElementById("couponInput");
  if (couponBtn) couponBtn.addEventListener("click", toggleCoupon);
  if (couponInput) couponInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); toggleCoupon(); } });

  const menuToggle = document.getElementById("menuToggle");
  const categoryOverlay = document.getElementById("categoryOverlay");
  menuToggle.addEventListener("click", () => toggleMenu());
  document.getElementById("categoryClose").addEventListener("click", () => toggleMenu(false));
  categoryOverlay.addEventListener("click", () => toggleMenu(false));

  let pageBeforeSearch = "inicio";
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function runSearch(value) {
    const term = value.trim();
    if (term === "") {
      goToPage(pageBeforeSearch, { keepScroll: true });
      return;
    }
    if (currentPage !== "resultados") pageBeforeSearch = currentPage;
    renderSearchResults(term);
    goToPage("resultados", { keepScroll: true });
  }

  searchInput.addEventListener("input", (e) => runSearch(e.target.value));
  searchBtn.addEventListener("click", () => runSearch(searchInput.value));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
      closeCategoryCollapse();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const navParam = urlParams.get("nav");
  const buscarParam = urlParams.get("buscar");
  if (buscarParam) {
    searchInput.value = buscarParam;
    pageBeforeSearch = navParam || "inicio";
    runSearch(buscarParam);
  } else if (navParam) {
    goToPage(navParam, { keepScroll: true });
  }
});

const PM_INTERVAL = 3000;
let pmTimer = null;
let pmIndex = 0;
let pmCount = 0;
let pmProduct = null;

let pmLang = "es";
try { if (localStorage.getItem("mps_lang") === "en") pmLang = "en"; } catch (e) {}

function editionOf(key) {
  key = String(key);
  return key.slice(-4) === "::en" ? { id: key.slice(0, -4), ed: "en" } : { id: key, ed: "es" };
}
function viewFor(p, ed) {
  if (ed !== "en") return p;
  const pe = Number(p.price_en);
  const se = p.stock_en === undefined || p.stock_en === null || p.stock_en === "" ? 0 : Number(p.stock_en);
  const cEn = Array.isArray(p.contenido_en) && p.contenido_en.length ? p.contenido_en : p.contenido;
  return {
    ...p,
    price: pe > 0 ? pe : p.price,
    stock: se,
    name: (p.name_en || p.name) + " (EN)",
    desc: p.desc_en || p.desc,
    tag: p.tag_en || p.tag,
    contenido: cEn,
  };
}
function cartProduct(key) {
  const { id, ed } = editionOf(key);
  const p = PRODUCTS.find((x) => x.id === id);
  return p ? viewFor(p, ed) : null;
}

function ensureProductModal() {
  if (document.getElementById("productModal")) return;

  const st = document.createElement("style");
  st.textContent = `
    .product-grid .product-card{cursor:pointer}
    .product-grid .product-card:focus-visible{outline:2px solid #742284;outline-offset:2px}
    .pm-overlay{position:fixed;inset:0;z-index:3000;background:rgba(15,10,20,.6);display:none;align-items:center;justify-content:center;padding:16px}
    .pm-overlay.open{display:flex}
    .pm-box{position:relative;background:#fff;border-radius:16px;max-width:900px;width:100%;max-height:92vh;overflow:auto;display:grid;grid-template-columns:1.1fr 1fr;box-shadow:0 20px 60px rgba(0,0,0,.35)}
    .pm-close{position:absolute;top:10px;right:10px;z-index:5;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.95);font-size:22px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}
    .pm-gallery{position:relative;background:#f6f4f1;min-height:340px;display:flex;flex-direction:column}
    .pm-stage{position:relative;flex:1;min-height:340px}
    .pm-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .5s ease;pointer-events:none}
    .pm-slide.active{opacity:1}
    .pm-slide img{max-width:88%;max-height:88%;object-fit:contain}
    .pm-slide svg{max-width:70%;max-height:70%}
    .pm-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.92);font-size:22px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}
    .pm-prev{left:10px}.pm-next{right:10px}
    .pm-dots{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;gap:7px}
    .pm-dots button{width:9px;height:9px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.25);cursor:pointer}
    .pm-dots button.active{background:#742284;transform:scale(1.25)}
    .pm-info{padding:28px 26px;display:flex;flex-direction:column;gap:12px;justify-content:center}
    .pm-info h2{font-size:1.4rem;margin:0}
    .pm-info .pm-tag{align-self:flex-start;background:#742284;color:#fff;font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:999px}
    .pm-info p{margin:0;color:#555;line-height:1.5}
    .pm-toprow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-right:44px}
    .pm-lang{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;align-items:center;width:78px;height:30px;padding:0;border:1px solid #d9d2dc;border-radius:999px;background:#f1edf3;cursor:pointer;font-size:.74rem;font-weight:800;color:#742284}
    .pm-lang span{position:relative;z-index:1;text-align:center;transition:color .2s}
    .pm-lang .pm-lang-thumb{position:absolute;z-index:0;top:2px;left:2px;width:calc(50% - 2px);height:24px;border-radius:999px;background:#742284;transition:transform .22s ease}
    .pm-lang.is-en .pm-lang-thumb{transform:translateX(100%)}
    .pm-lang span:nth-child(2){color:#fff}
    .pm-lang.is-en span:nth-child(2){color:#742284}
    .pm-lang.is-en span:nth-child(3){color:#fff}
    .pm-exp{font-size:.85rem}
    .pm-contents h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#777;margin:0 0 6px}
    .pm-contents ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
    .pm-contents li{position:relative;padding-left:20px;font-size:.9rem;color:#333}
    .pm-contents li::before{content:"✓";position:absolute;left:0;color:#742284;font-weight:800}
    .pm-price{font-size:1.7rem;font-weight:800}
    .product-badges{position:absolute;top:10px;right:10px;z-index:2;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
    .product-badges .product-stamp{position:static}
    .pb-label{font-size:.6rem;font-weight:800;padding:4px 8px;border-radius:6px;letter-spacing:.02em;line-height:1.1}
    .pm-labels{display:flex;flex-wrap:wrap;gap:6px}
    .pm-label{font-size:.72rem;font-weight:800;padding:3px 10px;border-radius:999px}
    .stock-badge{display:inline-block;margin-top:4px;font-size:.78rem;font-weight:700;color:#1a7f37;background:#e8f6ec;padding:2px 9px;border-radius:999px}
    .stock-badge.low{color:#9a6700;background:#fff4d6}
    .stock-badge.out{color:#b42318;background:#fde8e6}
    .price-wrap{display:flex;flex-direction:column;align-items:flex-start}
    .add-btn.sold-out{opacity:.55}
    @media (max-width:720px){.pm-box{grid-template-columns:1fr}.pm-gallery,.pm-stage{min-height:260px}}
  `;
  document.head.appendChild(st);

  const m = document.createElement("div");
  m.id = "productModal";
  m.className = "pm-overlay";
  m.setAttribute("role", "dialog");
  m.setAttribute("aria-modal", "true");
  m.setAttribute("aria-hidden", "true");
  m.innerHTML = `
    <div class="pm-box">
      <button type="button" class="pm-close" aria-label="Cerrar">&times;</button>
      <div class="pm-gallery" id="pmGallery">
        <div class="pm-stage" id="pmStage"></div>
        <button type="button" class="pm-nav pm-prev" aria-label="Imagen anterior">&#8249;</button>
        <button type="button" class="pm-nav pm-next" aria-label="Imagen siguiente">&#8250;</button>
        <div class="pm-dots" id="pmDots"></div>
      </div>
      <div class="pm-info" id="pmInfo"></div>
    </div>`;
  document.body.appendChild(m);

  m.addEventListener("click", (e) => { if (e.target === m) closeProductModal(); });
  m.querySelector(".pm-close").addEventListener("click", closeProductModal);
  m.querySelector(".pm-prev").addEventListener("click", () => { pmShow(pmIndex - 1); pmStart(); });
  m.querySelector(".pm-next").addEventListener("click", () => { pmShow(pmIndex + 1); pmStart(); });
  document.getElementById("pmDots").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) { pmShow(Number(b.dataset.i)); pmStart(); }
  });
  const gal = document.getElementById("pmGallery");
  gal.addEventListener("mouseenter", pmStop);
  gal.addEventListener("mouseleave", pmStart);
}

function pmShow(i) {
  if (!pmCount) return;
  pmIndex = (i + pmCount) % pmCount;
  document.querySelectorAll("#pmStage .pm-slide").forEach((el, k) => el.classList.toggle("active", k === pmIndex));
  document.querySelectorAll("#pmDots button").forEach((el, k) => el.classList.toggle("active", k === pmIndex));
}
function pmStop() { clearInterval(pmTimer); pmTimer = null; }
function pmStart() {
  pmStop();
  if (pmCount > 1) pmTimer = setInterval(() => pmShow(pmIndex + 1), PM_INTERVAL);
}

function renderPmInfo() {
  const base = pmProduct;
  if (!base) return;
  const en = pmLang === "en";
  const p = viewFor(base, en ? "en" : "es");
  const cont = p.contenido;
  const agotado = stockOf(p) === 0;

  document.getElementById("pmInfo").innerHTML = `
    <div class="pm-toprow">
      ${p.tag ? `<span class="pm-tag">${escapeHTML(p.tag)}</span>` : "<span></span>"}
      <button type="button" class="pm-lang${en ? " is-en" : ""}" role="switch" aria-checked="${en}" aria-label="Edición ES / EN" title="ES / EN">
        <span class="pm-lang-thumb"></span><span>ES</span><span>EN</span>
      </button>
    </div>
    ${customLabelsHTML(p, "pm-label") ? `<div class="pm-labels">${customLabelsHTML(p, "pm-label")}</div>` : ""}
    <h2>${escapeHTML(en ? (base.name_en || base.name) : base.name)}</h2>
    <p>${escapeHTML(p.desc || "")}</p>
    ${base.expansion ? `<p class="pm-exp">Expansión: <b>${escapeHTML(base.expansion)}</b></p>` : ""}
    ${Array.isArray(cont) && cont.length ? `<div class="pm-contents"><h3>Contenido</h3><ul>${cont.map((c) => `<li>${escapeHTML(c)}</li>`).join("")}</ul></div>` : ""}
    <span class="pm-price">S/ ${Number(p.price).toFixed(2)}</span>
    <div>${stockLabelHTML(p)}</div>
    <button type="button" class="btn btn-primary" id="pmAdd"${agotado ? " disabled" : ""}>${agotado ? "Agotado" : "Agregar al carrito"}</button>`;

  document.getElementById("pmAdd").addEventListener("click", (e) => {
    if (!addToCart(en ? base.id + "::en" : base.id)) return;
    const b = e.currentTarget;
    b.textContent = "Agregado ✓";
    setTimeout(() => { b.textContent = "Agregar al carrito"; }, 900);
  });
  document.querySelector("#pmInfo .pm-lang").addEventListener("click", () => {
    pmLang = en ? "es" : "en";
    try { localStorage.setItem("mps_lang", pmLang); } catch (e) {}
    renderPmInfo();
  });
}

function openProductModal(p) {
  ensureProductModal();
  pmLang = "en";
  const imgs = [p.image].concat(Array.isArray(p.images) ? p.images : []).filter(Boolean);
  pmCount = imgs.length;
  pmIndex = 0;

  document.getElementById("pmStage").innerHTML = imgs.length
    ? imgs.map((src, k) => `<div class="pm-slide${k === 0 ? " active" : ""}"><img src="${escapeHTML(src)}" alt="${escapeHTML(p.name)} (${k + 1})"></div>`).join("")
    : `<div class="pm-slide active">${productIconSVG(p)}</div>`;
  document.getElementById("pmDots").innerHTML = imgs.length > 1
    ? imgs.map((_, k) => `<button type="button" data-i="${k}" aria-label="Imagen ${k + 1}"${k === 0 ? ' class="active"' : ""}></button>`).join("")
    : "";
  const multi = imgs.length > 1;
  document.querySelector("#productModal .pm-prev").style.display = multi ? "" : "none";
  document.querySelector("#productModal .pm-next").style.display = multi ? "" : "none";

  pmProduct = p;
  renderPmInfo();

  const m = document.getElementById("productModal");
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  pmStart();
}

function closeProductModal() {
  const m = document.getElementById("productModal");
  if (!m) return;
  pmStop();
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".add-btn")) return;
  const card = e.target.closest(".product-grid .product-card[data-pid]");
  if (!card) return;
  const p = PRODUCTS.find((x) => x.id === card.dataset.pid);
  if (p) openProductModal(p);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProductModal();
  if (e.key === "Enter" && e.target.matches && e.target.matches(".product-grid .product-card[data-pid]")) {
    const p = PRODUCTS.find((x) => x.id === e.target.dataset.pid);
    if (p) openProductModal(p);
  }
});
document.addEventListener("DOMContentLoaded", ensureProductModal);
