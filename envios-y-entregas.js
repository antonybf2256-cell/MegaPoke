
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function wireToastLinks() {
  document.querySelectorAll("[data-toast]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

function toggleMenu(forceState) {
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const overlay = document.getElementById("categoryOverlay");
  if (!menuBtn || !nav || !overlay) return;
  const isOpen = typeof forceState === "boolean" ? forceState : !nav.classList.contains("open");
  nav.classList.toggle("open", isOpen);
  overlay.classList.toggle("open", isOpen);
  nav.setAttribute("aria-hidden", String(!isOpen));
  menuBtn.setAttribute("aria-expanded", String(isOpen));
}

function runSearchFromHere(value) {
  const term = value.trim();
  if (term === "") return;
  window.location.href = "index.html?buscar=" + encodeURIComponent(term);
}

document.addEventListener("DOMContentLoaded", () => {
  wireToastLinks();

  const menuToggle = document.getElementById("menuToggle");
  const categoryOverlay = document.getElementById("categoryOverlay");
  const categoryClose = document.getElementById("categoryClose");
  if (menuToggle) menuToggle.addEventListener("click", () => toggleMenu());
  if (categoryClose) categoryClose.addEventListener("click", () => toggleMenu(false));
  if (categoryOverlay) categoryOverlay.addEventListener("click", () => toggleMenu(false));

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearchFromHere(searchInput.value);
    });
  }
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => runSearchFromHere(searchInput.value));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
});
