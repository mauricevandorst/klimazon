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

function createHeaderSkeleton() {
  return `
    <div class="navbar-skeleton" aria-hidden="true">
      <div class="navbar-skeleton__topbar"></div>
      <div class="navbar-skeleton__nav">
        <div class="navbar-skeleton__brand">
          <span class="navbar-skeleton__logo navbar-skeleton__shimmer"></span>
          <span class="navbar-skeleton__brand-lines">
            <span class="navbar-skeleton__line navbar-skeleton__shimmer"></span>
            <span class="navbar-skeleton__line navbar-skeleton__line--small navbar-skeleton__shimmer"></span>
          </span>
        </div>
        <div class="navbar-skeleton__links">
          <span class="navbar-skeleton__pill navbar-skeleton__shimmer"></span>
          <span class="navbar-skeleton__pill navbar-skeleton__shimmer"></span>
          <span class="navbar-skeleton__pill navbar-skeleton__shimmer"></span>
          <span class="navbar-skeleton__pill navbar-skeleton__shimmer"></span>
        </div>
        <span class="navbar-skeleton__menu-btn navbar-skeleton__shimmer"></span>
      </div>
    </div>
  `;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function includeHTML(id, urls, mustInclude, minDelayMs = 0) {
  const el = document.getElementById(id);
  if (!el) return false;

  const startedAt = Date.now();
  const html = await fetchHtml(urls, mustInclude);
  if (html != null) {
    const elapsedMs = Date.now() - startedAt;
    if (minDelayMs > elapsedMs) {
      await wait(minDelayMs - elapsedMs);
    }
    el.innerHTML = html;
    return true;
  }
  return false;
}

(async () => {
  const includesBase = resolveIncludesBaseUrl();
  const headerBaseUrl = new URL("../partials/header.html", includesBase);
  const footerBaseUrl = new URL("../partials/footer.html", includesBase);
  const headerEl = document.getElementById("header");

  if (headerEl && !headerEl.firstElementChild) {
    headerEl.setAttribute("aria-busy", "true");
    headerEl.innerHTML = createHeaderSkeleton();
  }

  const headerUrls = [
    headerBaseUrl.toString(),
    `${headerBaseUrl.toString()}?v=${Date.now()}`,
  ];

  const headerInjected = await includeHTML("header", headerUrls, undefined, 220);
  if (!headerInjected) {
    console.warn("[includes] header inject failed", headerUrls);
  }

  if (!document.querySelector("[data-mobile-menu]")) {
    await includeHTML("header", [
      "/partials/header.html",
      `/partials/header.html?v=${Date.now()}`,
    ], undefined, 220);
  }

  if (headerEl) {
    headerEl.removeAttribute("aria-busy");
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
