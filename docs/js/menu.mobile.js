// ./js/menu.mobile.js

(function () {
  const MOBILE_SCROLL_THRESHOLD = 6;
  const MOBILE_PROGRESS_VAR = "--mobile-scroll-progress";

  function isMobileViewport() {
    return window.matchMedia("(max-width: 1023px)").matches;
  }

  function getPageScrollProgress() {
    const doc = document.documentElement;
    const maxScrollable = Math.max(0, doc.scrollHeight - window.innerHeight);
    if (maxScrollable <= 0) return 0;
    const progress = window.scrollY / maxScrollable;
    return Math.min(1, Math.max(0, progress));
  }

  function syncMobileScrollState(root) {
    const header = root.querySelector("[data-mobile-header]");
    const gradientBar = root.querySelector("[data-mobile-gradient-bar]");
    if (!header && !gradientBar) return;

    const isMobile = isMobileViewport();
    const isMenuOpen = Boolean(header && header.classList.contains("is-mobile-open"));
    const scrollProgress = getPageScrollProgress();
    const shouldShowScrolledState = isMobile && !isMenuOpen && window.scrollY > MOBILE_SCROLL_THRESHOLD;

    if (header) header.classList.toggle("is-mobile-scrolled", shouldShowScrolledState);
    if (gradientBar) {
      gradientBar.classList.toggle("hidden", !shouldShowScrolledState);
      gradientBar.classList.toggle("is-mobile-scrolled", shouldShowScrolledState);
      gradientBar.style.setProperty(
        MOBILE_PROGRESS_VAR,
        shouldShowScrolledState ? String(scrollProgress) : "0"
      );
    }
  }

  function updateMenuViewportBounds(menu) {
    if (!menu || menu.classList.contains("hidden")) return;

    const top = menu.getBoundingClientRect().top;
    const availableHeight = Math.max(120, window.innerHeight - top);

    menu.style.maxHeight = `${availableHeight}px`;
    menu.style.overflowY = "auto";
    menu.style.overscrollBehavior = "contain";
  }

  function closeMenu(root) {
    const menu = root.querySelector("[data-mobile-menu]");
    if (!menu || menu.classList.contains("hidden")) return;

    menu.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
    menu.classList.add("opacity-0", "-translate-y-[18px]", "pointer-events-none");

    const onEnd = (e) => {
      if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;
      menu.classList.add("hidden");
      menu.removeEventListener("transitionend", onEnd);
    };
    menu.addEventListener("transitionend", onEnd);

    const header = root.querySelector("[data-mobile-header]");
    if (header) header.classList.remove("is-mobile-open");
    syncMobileScrollState(root);

    root.querySelectorAll("[data-mobile-trigger]").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
    });
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
      closeMenu(root);
    }

    const header = root.querySelector("[data-mobile-header]");
    if (header) header.classList.toggle("is-mobile-open", !isOpen);
    syncMobileScrollState(root);

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
    if (window.__mobileMenuDelegatedAdded) {
      syncMobileScrollState(root);
      return;
    }
    window.__mobileMenuDelegatedAdded = true;

    syncMobileScrollState(root);

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
        return;
      }

      const menu = root.querySelector("[data-mobile-menu]");
      if (!menu || menu.classList.contains("hidden")) return;

      const clickedInsideMenu = Boolean(e.target.closest("[data-mobile-menu]"));
      if (!clickedInsideMenu) {
        closeMenu(root);
      }
    });

    window.addEventListener("resize", () => {
      syncMobileScrollState(root);
      const menu = root.querySelector("[data-mobile-menu]");
      if (!menu || menu.classList.contains("hidden")) return;
      updateMenuViewportBounds(menu);
    });

    window.addEventListener(
      "scroll",
      () => {
        syncMobileScrollState(root);
      },
      { passive: true }
    );
  }

  // Expose globally, zodat includes.js dit kan callen
  window.initMobileMenu = initMobileMenu;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMobileMenu(document));
  } else {
    initMobileMenu(document);
  }
})();
