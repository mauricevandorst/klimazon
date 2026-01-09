// menu.mobile.js
(function () {
  const trigger = document.querySelector("[data-mobile-trigger]");
  const menu = document.querySelector("[data-mobile-menu]");
  const accordions = document.querySelectorAll("[data-mobile-accordion]");

  trigger?.addEventListener("click", () => {
    menu?.classList.toggle("hidden");
  });

  accordions.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-mobile-accordion");
      const panel = document.querySelector(
        `[data-mobile-panel="${key}"]`
      );
      panel?.classList.toggle("hidden");
    });
  });
})();
