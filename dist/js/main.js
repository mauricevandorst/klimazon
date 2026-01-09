import { renderLayout } from "./layout.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();

  const toggle = document.querySelector("[data-mobile-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const header = document.querySelector("[data-header]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isHidden = menu.classList.contains("hidden");
      menu.classList.toggle("hidden", !isHidden);
      toggle.setAttribute("aria-expanded", String(isHidden));
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("shadow-sm", window.scrollY > 6);
    header.classList.toggle("border-slate-100", window.scrollY > 6);
    header.classList.toggle("border-transparent", window.scrollY <= 6);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

import "./assets.js";

window.asset = (key) => window.KLIMAZON_ASSETS[key] || "";
