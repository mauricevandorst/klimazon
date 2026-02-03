// dropdowns.desktop.js
(function () {
  function closeAll(root = document) {
    root.querySelectorAll("[data-dropdown-trigger]").forEach((t) => {
      t.setAttribute("aria-expanded", "false");
      const key = t.getAttribute("data-dropdown-trigger");
      const menu = root.querySelector(`[data-dropdown-menu="${key}"]`);
      if (menu) menu.dataset.open = "false";
    });
  }

  function initDesktopDropdowns(root = document) {
    const triggers = root.querySelectorAll("[data-dropdown-trigger]");
    if (!triggers.length) return;

    triggers.forEach((t) => {
      if (t.dataset.dropdownBound === "true") return;
      t.dataset.dropdownBound = "true";

      const key = t.getAttribute("data-dropdown-trigger");
      const menu = root.querySelector(`[data-dropdown-menu="${key}"]`);
      if (menu) menu.dataset.open = "false";

      t.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu?.dataset.open === "true";
        closeAll(root);
        if (menu) menu.dataset.open = String(!isOpen);
        t.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    if (!window.__desktopDropdownListenersAdded) {
      window.__desktopDropdownListenersAdded = true;
      document.addEventListener("click", () => closeAll(document));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAll(document);
      });
    }
  }

  window.initDesktopDropdowns = initDesktopDropdowns;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDesktopDropdowns(document));
  } else {
    initDesktopDropdowns(document);
  }
})();
