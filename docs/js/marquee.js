// ...existing code...
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function readyMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    const imgs = marquee.querySelectorAll('img');
    const imgPromises = Array.from(imgs).map(img => new Promise(res => {
      if (img.complete) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    }));

    Promise.all(imgPromises).then(() => marquee.classList.add('is-ready'));
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    readyMarquee();
  } else {
    document.addEventListener('DOMContentLoaded', readyMarquee);
  }
})();