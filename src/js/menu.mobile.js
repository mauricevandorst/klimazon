// ./js/menu.mobile.js

(function () {
  function initMobileMenu() {
    const trigger = document.querySelector("[data-mobile-trigger]");
    const menu = document.querySelector("[data-mobile-menu]");

    if (!trigger || !menu) return;

    // Toggle hele menu panel
    trigger.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    // Accordions
    const accordionButtons = document.querySelectorAll("[data-mobile-accordion]");
    accordionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-mobile-accordion");
        const panel = document.querySelector(`[data-mobile-panel="${key}"]`);
        if (!panel) return;

        panel.classList.toggle("hidden");

        const icon = btn.querySelector("span");
        if (icon) icon.textContent = panel.classList.contains("hidden") ? "+" : "–";
      });
    });
  }

  // Expose globally, zodat includes.js dit kan callen
  window.initMobileMenu = initMobileMenu;
})();
