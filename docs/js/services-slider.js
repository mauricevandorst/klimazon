(() => {
  const track = document.getElementById("servicesTrack");
  const allServices = document.getElementById("allServicesBtn");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const dots = Array.from(document.querySelectorAll(".dot"));

  let index = 0;
  const max = 1;

  function animateAllServicesBtn(toBusiness) {
    // reset animatie
    allServices.classList.remove("is-animate");

    // state zetten
    allServices.classList.toggle("is-business", toBusiness);

    // force reflow zodat de transition opnieuw start
    allServices.offsetHeight;

    // start animatie (binnenvliegen)
    if (toBusiness) {
      allServices.classList.add("is-animate");
    }
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);

      if (dot.getAttribute("aria-label") === "Zakelijk") {
        dot.classList.toggle("is-business", i === index);
      } else {
        dot.classList.remove("is-business");
      }
    });

    animateAllServicesBtn(index === 1);
  }

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", () => {
    index = Math.min(max, index + 1);
    update();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      update();
    });
  });

  update();
})();
