// topbar-carousel.js
(function () {
  const carousels = document.querySelectorAll(".js-topbar-carousel");
  carousels.forEach(initCarousel);

  function initCarousel(container) {
    const viewport = container.querySelector(".overflow-x-auto");
    const track = container.querySelector(".js-topbar-track");
    if (!viewport || !track) return;

    const slides = Array.from(track.children);
    const count = slides.length;

    let index = 0;
    let timer = null;
    let resumeTimeout = null;

    const INTERVAL = 3000;
    const PAUSE_AFTER_INTERACTION = 6000;

    function slideWidth() {
      return viewport.clientWidth || 1; // slides zijn w-full
    }

    function alignToIndex(behavior = "smooth") {
      viewport.scrollTo({
        left: index * slideWidth(),
        behavior,
      });
    }

    function next() {
      index = (index + 1) % count;
      alignToIndex("smooth");
    }

    function start() {
      stop();
      timer = setInterval(next, INTERVAL);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function pauseAuto() {
      stop();
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(start, PAUSE_AFTER_INTERACTION);
    }

    // Update index op basis van waar de gebruiker naartoe scrollt
    let scrollDebounce = null;
    viewport.addEventListener(
      "scroll",
      () => {
        if (scrollDebounce) clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
          const w = slideWidth();
          const newIndex = Math.round(viewport.scrollLeft / w);
          if (Number.isFinite(newIndex)) {
            index = Math.max(0, Math.min(count - 1, newIndex));
          }
        }, 80);
      },
      { passive: true }
    );

    // Pauzeer auto-scroll na interactie
    viewport.addEventListener("touchstart", pauseAuto, { passive: true });
    viewport.addEventListener("mousedown", pauseAuto);

    // Re-align bij resize/orientation change
    window.addEventListener("resize", () => alignToIndex("auto"));

    // Init
    alignToIndex("auto");
    start();
  }
})();
