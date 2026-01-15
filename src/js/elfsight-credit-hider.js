// elfsight-credit-hider.js
// Laat de Elfsight credit-link bestaan (anti-tamper), maar forceert 'm onzichtbaar.

(function () {
  const SELECTOR = 'a[href*="elfsight.com"][href*="google-reviews-widget"]';

  function hideCredit(root = document) {
    const links = root.querySelectorAll(SELECTOR);
    if (!links.length) return;

    links.forEach((a) => {
      // Inline override (wint van hun inline !important omdat dit later gezet wordt)
      a.style.setProperty("display", "none", "important");
      a.style.setProperty("visibility", "hidden", "important");
      a.style.setProperty("opacity", "0", "important");
      a.style.setProperty("pointer-events", "none", "important");
      a.style.setProperty("height", "0", "important");
      a.style.setProperty("width", "0", "important");
      a.style.setProperty("margin", "0", "important");
      a.style.setProperty("padding", "0", "important");
      a.setAttribute("aria-hidden", "true");
      a.tabIndex = -1;
    });
  }

  // Eerste run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => hideCredit());
  } else {
    hideCredit();
  }

  // Monitor injecties en re-applies
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Als exact die <a> toegevoegd wordt
        if (node.matches?.(SELECTOR)) {
          hideCredit(node.parentNode || document);
          continue;
        }

        // Of ergens binnenin
        hideCredit(node);
      }
    }

    // Extra safety: als Elfsight later de style terugzet
    hideCredit();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
