// ./js/menu.mobile.js

(function () {
  function toggleMenu(root, triggerEl) {
    const menu = root.querySelector("[data-mobile-menu]");
    if (!menu) return;
    menu.classList.toggle("hidden");

    if (triggerEl) {
      const isOpen = !menu.classList.contains("hidden");
      triggerEl.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function toggleAccordion(root, btn) {
    const key = btn.getAttribute("data-mobile-accordion");
    const panel = root.querySelector(`[data-mobile-panel="${key}"]`);
    if (!panel) return;

    panel.classList.toggle("hidden");

    const icon = btn.querySelector("span");
    if (icon) icon.textContent = panel.classList.contains("hidden") ? "+" : "–";
  }

  function initMobileMenu(root = document) {
    if (window.__mobileMenuDelegatedAdded) return;
    window.__mobileMenuDelegatedAdded = true;

    root.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-mobile-trigger]");
      if (trigger) {
        e.preventDefault();
        toggleMenu(root, trigger);
        return;
      }

      const accordionBtn = e.target.closest("[data-mobile-accordion]");
      if (accordionBtn) {
        e.preventDefault();
        toggleAccordion(root, accordionBtn);
      }
    });
  }

  // Expose globally, zodat includes.js dit kan callen
  window.initMobileMenu = initMobileMenu;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMobileMenu(document));
  } else {
    initMobileMenu(document);
  }
})();
