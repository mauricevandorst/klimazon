// ./js/includes.js
function resolveIncludesBaseUrl() {
  const script =
    document.currentScript ||
    document.querySelector('script[src$="/js/includes.js"]') ||
    document.querySelector('script[src$="js/includes.js"]');
  if (script && script.src) {
    return new URL(script.src, window.location.href);
  }
  return new URL(window.location.href);
}

async function fetchHtml(urls, mustInclude) {
  for (const file of urls) {
    try {
      const res = await fetch(file, { cache: "no-store" });
      if (!res.ok) continue;
      const text = await res.text();
      if (!mustInclude || text.includes(mustInclude)) return text;
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function includeHTML(id, urls, mustInclude) {
  const el = document.getElementById(id);
  if (!el) return false;

  const html = await fetchHtml(urls, mustInclude);
  if (html != null) {
    el.innerHTML = html;
    return true;
  }
  return false;
}

(async () => {
  const includesBase = resolveIncludesBaseUrl();
  const headerBaseUrl = new URL("../partials/header.html", includesBase);
  const footerBaseUrl = new URL("../partials/footer.html", includesBase);

  const headerUrls = [
    headerBaseUrl.toString(),
    `${headerBaseUrl.toString()}?v=${Date.now()}`,
  ];

  const headerInjected = await includeHTML("header", headerUrls);
  if (!headerInjected) {
    console.warn("[includes] header inject failed", headerUrls);
  }

  if (!document.querySelector("[data-mobile-menu]")) {
    await includeHTML("header", [
      "/partials/header.html",
      `/partials/header.html?v=${Date.now()}`,
    ]);
  }

  if (typeof window.initMobileMenu === "function") {
    window.initMobileMenu();
  }
  if (typeof window.initTopbarCarousel === "function") {
    window.initTopbarCarousel();
  }
  if (typeof window.initDesktopDropdowns === "function") {
    window.initDesktopDropdowns();
  }

  const footerUrls = [
    footerBaseUrl.toString(),
    `${footerBaseUrl.toString()}?v=${Date.now()}`,
  ];
  await includeHTML("footer", footerUrls);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
