// /js/faq-accordion.js
(() => {
  const items = document.querySelectorAll('details.faq');

  items.forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.faq-content');
    if (!summary || !content) return;

    // Initial state
    content.style.height = details.open ? 'auto' : '0px';
    content.style.transitionProperty = 'height';
    content.style.transitionDuration = '300ms';
    content.style.transitionTimingFunction = 'ease';

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = details.open;

      if (isOpen) {
        // Close: from current height to 0
        const start = content.scrollHeight;
        content.style.height = start + 'px';

        requestAnimationFrame(() => {
          content.style.height = '0px';
        });

        content.addEventListener(
          'transitionend',
          () => {
            details.open = false;
          },
          { once: true }
        );
      } else {
        // Optional: only one open at a time
        items.forEach((other) => {
          if (other !== details && other.open) {
            const otherContent = other.querySelector('.faq-content');
            if (!otherContent) return;
            otherContent.style.height = otherContent.scrollHeight + 'px';
            requestAnimationFrame(() => (otherContent.style.height = '0px'));
            otherContent.addEventListener(
              'transitionend',
              () => {
                other.open = false;
              },
              { once: true }
            );
          }
        });

        // Open: set open first, then animate to scrollHeight
        details.open = true;
        content.style.height = '0px';

        requestAnimationFrame(() => {
          const target = content.scrollHeight;
          content.style.height = target + 'px';
        });

        content.addEventListener(
          'transitionend',
          () => {
            content.style.height = 'auto';
          },
          { once: true }
        );
      }
    });
  });
})();
