// ./js/menu.mobile.js

(function () {
  function updateMenuViewportBounds(menu) {
    if (!menu || menu.classList.contains("hidden")) return;

    const top = menu.getBoundingClientRect().top;
    const availableHeight = Math.max(120, window.innerHeight - top);

    menu.style.maxHeight = `${availableHeight}px`;
    menu.style.overflowY = "auto";
    menu.style.overscrollBehavior = "contain";
  }

  function toggleMenu(root, triggerEl) {
    const menu = root.querySelector("[data-mobile-menu]");
    if (!menu) return;

    const isOpen = !menu.classList.contains("hidden");

    if (!isOpen) {
      // Open: eerst zichtbaar maken, dan in volgende frame animeren
      menu.classList.remove("hidden");
      requestAnimationFrame(() => {
        updateMenuViewportBounds(menu);
        menu.classList.remove("opacity-0", "-translate-y-[18px]", "pointer-events-none");
        menu.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
      });
    } else {
      // Close: eerst terug animeren, daarna verbergen
      menu.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
      menu.classList.add("opacity-0", "-translate-y-[18px]", "pointer-events-none");

      const onEnd = (e) => {
        if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;
        menu.classList.add("hidden");
        menu.removeEventListener("transitionend", onEnd);
      };
      menu.addEventListener("transitionend", onEnd);
    }

    const header = root.querySelector("[data-mobile-header]");
    if (header) header.classList.toggle("is-mobile-open", !isOpen);

    if (triggerEl) triggerEl.setAttribute("aria-expanded", String(!isOpen));
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

    window.addEventListener("resize", () => {
      const menu = root.querySelector("[data-mobile-menu]");
      if (!menu || menu.classList.contains("hidden")) return;
      updateMenuViewportBounds(menu);
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
