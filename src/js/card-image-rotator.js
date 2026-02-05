document.addEventListener("DOMContentLoaded", () => {
  const items = [...document.querySelectorAll("[data-rotator]")].map(img => {
    const images = JSON.parse(img.dataset.images || "[]");
    const interval = Number(img.dataset.interval || 6500);

    if (images.length < 2) return null;

    return {
      img,
      images,
      interval,
      index: 0,
      paused: false,
      lastSlot: 0,
      active: false,
      preloaded: false
    };
  }).filter(Boolean);

  const fadeMs = 250;

  const switchTo = (item, nextIndex) => {
    item.img.classList.add("opacity-0");
    setTimeout(() => {
      item.img.src = item.images[nextIndex];
      item.img.classList.remove("opacity-0");
    }, fadeMs);
  };

  const activateItem = item => {
    if (item.active) return;
    item.active = true;
    if (item.preloaded) return;

    item.preloaded = true;
    item.images.slice(1).forEach(src => {
      const pre = new Image();
      pre.src = src;
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = items.find(current => current.img === entry.target);
        if (!item) return;

        if (entry.isIntersecting) {
          activateItem(item);
        } else {
          item.active = false;
        }
      });
    }, { rootMargin: "200px 0px", threshold: 0.1 });

    items.forEach(item => observer.observe(item.img));
  } else {
    items.forEach(activateItem);
  }

  // Hover pauze per card (optioneel)
  items.forEach(item => {
    const card = item.img.closest("a, .group");
    if (!card) return;

    card.addEventListener("mouseenter", () => item.paused = true);
    card.addEventListener("mouseleave", () => item.paused = false);
  });

  // Centrale "klok"
  const tick = () => {
    const now = Date.now();

    items.forEach(item => {
      if (item.paused || !item.active) return;

      const slot = Math.floor(now / item.interval); // globale fase
      if (slot === item.lastSlot) return;

      item.lastSlot = slot;
      item.index = (item.index + 1) % item.images.length;
      switchTo(item, item.index);
    });
  };

  // 4x per seconde checken is zat en houdt het synchroon genoeg
  setInterval(tick, 250);
  tick();
});
