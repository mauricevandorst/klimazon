// ./js/includes.js
async function includeHTML(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file);
  el.innerHTML = await res.text();
}

(async () => {
  await includeHTML("header", "./partials/header.html");

  if (typeof window.initMobileMenu === "function") {
    window.initMobileMenu();
  }

  await includeHTML("footer", "./partials/footer.html");

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
