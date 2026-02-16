(() => {
  const btnMonthly = document.getElementById('btn-monthly');
  const btnYearly = document.getElementById('btn-yearly');
  const slider = document.getElementById('toggle-slider');
  const priceBronze = document.getElementById('price-bronze');
  const priceSilver = document.getElementById('price-silver');
  const priceGold = document.getElementById('price-gold');

  let isYearly = false;

  const prices = {
    bronze: 13.21,
    silver: 17.35,
    gold: 22.59
  };

  function formatPrice(value) {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function applyDiscount(price, discountPercent) {
    return price * (1 - discountPercent);
  }

  function setActiveButton(activeBtn, inactiveBtn) {
    activeBtn.classList.remove('text-gray-500', 'hover:text-gray-900');
    activeBtn.classList.add('text-[color:var(--kz-blue)]');

    inactiveBtn.classList.remove('text-[color:var(--kz-blue)]');
    inactiveBtn.classList.add('text-gray-500', 'hover:text-gray-900');

    activeBtn.style.borderTop = '1px solid transparent';
    activeBtn.style.borderBottom = '1px solid var(--kz-blue)';
    activeBtn.style.borderLeft = '1px solid transparent';
    activeBtn.style.borderRight = '1px solid transparent';

    inactiveBtn.style.borderTop = '1px solid transparent';
    inactiveBtn.style.borderBottom = '1px solid transparent';
    inactiveBtn.style.borderLeft = '1px solid transparent';
    inactiveBtn.style.borderRight = '1px solid transparent';
  }

  function updatePricing() {
    if (isYearly) {
      // Yearly logic
      slider.classList.remove('translate-x-0');
      slider.classList.add('translate-x-full');
      setActiveButton(btnYearly, btnMonthly);

      // Update prices with 15% discount
      priceBronze.textContent = formatPrice(applyDiscount(prices.bronze, 0.15));
      priceSilver.textContent = formatPrice(applyDiscount(prices.silver, 0.15));
      priceGold.textContent = formatPrice(applyDiscount(prices.gold, 0.15));
    } else {
      // Monthly logic
      slider.classList.remove('translate-x-full');
      slider.classList.add('translate-x-0');
      setActiveButton(btnMonthly, btnYearly);

      // Reset prices
      priceBronze.textContent = formatPrice(prices.bronze);
      priceSilver.textContent = formatPrice(prices.silver);
      priceGold.textContent = formatPrice(prices.gold);
    }
  }

  btnMonthly.addEventListener('click', () => {
    isYearly = false;
    updatePricing();
  });

  btnYearly.addEventListener('click', () => {
    isYearly = true;
    updatePricing();
  });

  // Initialize
  updatePricing();
})();
