// dropdowns.desktop.js
(function () {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");
  const menusByKey = (key) =>
    document.querySelector(`[data-dropdown-menu="${key}"]`);

  function closeAll() {
    triggers.forEach(t => {
      t.setAttribute("aria-expanded", "false");
      const key = t.getAttribute("data-dropdown-trigger");
      const menu = menusByKey(key);
      if (menu) menu.dataset.open = "false";
    });
  }

  triggers.forEach(t => {
    const key = t.getAttribute("data-dropdown-trigger");
    const menu = menusByKey(key);

    t.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu?.dataset.open === "true";
      closeAll();
      if (menu) menu.dataset.open = String(!isOpen);
      t.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
